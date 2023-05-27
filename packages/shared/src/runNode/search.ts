import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Node } from "reactflow";
import { getNodes } from "../getNodes";
import { TraversalStateType } from "../traversalStateType";
import {
  CustomNode,
  SearchDataType,
  NodeTypesEnum,
} from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";
import { setupSupabaseClient } from "../utils/setupSupabaseClient";
import { SupabaseVectorStoreWithFilter } from "../utils/vectorStores/SupabaseVectorStoreWithFilter";
import { getRuntimeEnvironment } from "../utils/env";
import { SupabaseSettingsType } from "../types/SupabaseSettingsType";

const search = async (
  state: TraversalStateType,
  chatbotId: string | undefined,
  nodes: CustomNode[],
  node: Node<SearchDataType>,
  openAiKey: string,
  supabaseSettings: SupabaseSettingsType
) => {
  try {
    const inputs = node.data.inputs;
    const inputIds = inputs.inputs.filter((input) => input !== "docsLoader");
    const searchNode = node.data as SearchDataType;
    const userQuestion = parsePromptInputs(nodes, inputIds, searchNode.text);

    const supabase = await setupSupabaseClient(
      supabaseSettings.url,
      supabaseSettings.key
    );

    let embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiKey });
    const session = await supabase.auth.getSession();

    if (session.error) {
      throw new Error(session.error.message);
    }

    const openAiOptions: any = {
      // TODO: need to let user set the openai settings
      modelName: node.data.model,
      maxTokens:  Math.floor(node.data.max_tokens),
      temperature: node.data.temperature,
      openAIApiKey: openAiKey,
    }

    if (node.data.stop) {
      openAiOptions.stop = node.data.stop;
    }



    let model = new ChatOpenAI(openAiOptions);

    const { runtime } = await getRuntimeEnvironment();

    // if no sessions found, use api key set in non-user's "session"
    if (
      session &&
      session.data &&
      session.data.session &&
      session.data.session.access_token
    ) {
      if (runtime === "browser") {
        embeddings = new OpenAIEmbeddings(
          {
            openAIApiKey: session.data.session.access_token,
          },
          {
            basePath: `${supabaseSettings.functionUrl}/openai`,
          }
        );
        model = new ChatOpenAI(
          {
            modelName: "gpt-3.5-turbo",
            // this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
            openAIApiKey: session.data.session.access_token,
          },
          {
            basePath: `${supabaseSettings.functionUrl}/openai`,
          }
        );
      } else {
        embeddings = new OpenAIEmbeddings({
          openAIApiKey: session.data.session.access_token,
        });
        model = new ChatOpenAI({
          ...openAiOptions,
          // this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
          openAIApiKey: session.data.session.access_token,
        });
      }
    }
    // Load the docs into the vector store
    const vectorStore = await SupabaseVectorStoreWithFilter.fromExistingIndex(
      embeddings,
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents_with_filters",
      }
    );

    const documents = node.data.docs
      .split(",")
      .map((document) => {
        const filter: any = {
          name: document,
        };
        if (
          node.data.askUser
        ) {
          filter.user_id = session.data.session?.user.id;
        } else {
          filter.chatbot_id = chatbotId;
        }
        return filter;
      });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(undefined, documents),
      {
        returnSourceDocuments: true,
      }
    );

    chain.returnSourceDocuments = true;
    // chain.verbose = true;
    const res = await chain.call({
      question: userQuestion,
      chat_history: [],
    });

    let answer = res.text;

    if (searchNode.returnSource) {
      /*
       * append answer to add source from res.sourceDocuments, which is an array of objects with loc object field.
       * append the res.sourceDocument[x].metadata.loc.pageNumber and res.sourceDocument[x].pageContent like so:
       * `originalAnswer
       * page pageNumber: pageContent
       * page n: pageContent n
       * ...
       * `
       */
      answer += "\n\nSource:\n";
      res.sourceDocuments.forEach((doc: any) => {
        answer += `file: ${doc.metadata.name}, page: #${
          doc.metadata.loc.pageNumber
        }\ncontent: ${doc.pageContent.slice(0, 190)}\n`;
      });
    }

    state.chatHistory = [
      ...state.chatHistory,
      {
        content: "Search Finished!",
        role: "assistant",
        assistantMessageType: NodeTypesEnum.outputText,
      },
    ];

    node.data = {
      ...node.data,
      // TODO: need to have a combiner node or a for loop node
      response: answer,
      isLoading: false,
    };
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default search;
