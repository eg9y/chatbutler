import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { Node } from 'reactflow';

import { createSupabaseClient } from '../../auth/supabaseClient';
import { SearchDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';
import { SupabaseVectorStoreWithFilter } from '../vectorStores/SupabaseVectorStoreWithFilter';
const search = async (node: Node<SearchDataType>, get: () => RFState, openAiKey: string) => {
	try {
		const inputs = node.data.inputs;
		const inputNodes = get().getNodes(inputs.inputs);
		const docsLoaderNodeIndex = inputNodes.findIndex((node) => node.type === 'docsLoader');
		const inputIds = inputs.inputs.filter((input) => input !== 'docsLoader');

		const searchNode = node.data as SearchDataType;
		// const document = searchNode?.document;
		// if (!document) {
		// 	throw new Error('Document is not defined');
		// }

		const supabase = createSupabaseClient();

		let embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiKey });
		const session = await supabase.auth.getSession();

		if (session.error) {
			throw new Error(session.error.message);
		}

		// if no sessions found, use api key set in non-user's "session"
		if (session && session.data && session.data.session && session.data.session.access_token) {
			embeddings = new OpenAIEmbeddings(
				{
					openAIApiKey: session.data.session.access_token,
				},
				{
					basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
				},
			);
		}

		// Load the docs into the vector store
		const vectorStore = await SupabaseVectorStoreWithFilter.fromExistingIndex(embeddings, {
			client: supabase,
			tableName: 'documents',
			queryName: 'match_documents_with_filters',
		});
		// const vectorStore = await MemoryVectorStore.fromDocuments(docOutput, embeddings);

		const parsedPrompt = parsePromptInputs(get, searchNode.text, inputIds);
		const model = new OpenAI(
			{
				// this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
				openAIApiKey: session.data.session?.access_token,
			},
			{
				basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
			},
		);
		const chain = RetrievalQAChain.fromLLM(
			model,
			vectorStore.asRetriever(undefined, {
				name: inputNodes[docsLoaderNodeIndex].data.response,
			}),
			{
				returnSourceDocuments: true,
			},
		);
		chain.returnSourceDocuments = true;
		const res = await chain.call({
			query: parsedPrompt,
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
			answer += '\n\n';
			res.sourceDocuments.forEach((doc: any) => {
				answer += `file: ${doc.metadata.file_name}, page: #${doc.metadata.loc.pageNumber}\ncontent: ${doc.pageContent}\n`;
			});
		}

		node.data = {
			...node.data,
			// TODO: need to have a combiner node or a for loop node
			response: answer,
			isLoading: false,
		};
	} catch (error) {
		node.data = {
			...node.data,
			isLoading: false,
		};
		// TODO: set UI error
	}
};

export default search;
