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
		if (
			!session ||
			!session.data ||
			!session.data.session ||
			!session.data.session.access_token
		) {
			console.log('test');
		} else {
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
		const vectorStore = new SupabaseVectorStoreWithFilter(embeddings, {
			client: supabase,
			queryName: 'match_documents_with_filters',
			filter: {
				name: inputNodes[docsLoaderNodeIndex].data.response,
			},
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
		const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
		const res = await chain.call({
			query: parsedPrompt,
		});
		console.log('search results: ', res);

		node.data = {
			...node.data,
			// TODO: need to have a combiner node or a for loop node
			response: res.text,
			isLoading: false,
		};
	} catch (error) {
		node.data = {
			...node.data,
			isLoading: false,
		};
		throw error;
	}
};

export default search;
