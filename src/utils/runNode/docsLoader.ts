import { Node } from 'reactflow';

import { CustomNode, DocsLoaderDataType, NodeTypesEnum } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';

function pauser(node: CustomNode, get: () => RFState): Promise<string> {
	return new Promise((resolve) => {
		const chatApp = get().chatApp;
		get().setChatApp([
			...chatApp,
			{
				role: 'assistant',
				content: 'Upload the document you want to search for',
				assistantMessageType: NodeTypesEnum.docsLoader,
			},
		]);
		get().setWaitingUserResponse(true);
		get().setPauseResolver((fileName) => {
			get().setWaitingUserResponse(false);
			node.data.response = fileName;
			return resolve(fileName);
		});
	});
}

const docsLoader = async (
	node: Node<DocsLoaderDataType>,
	get: () => RFState,
	openAiKey: string,
) => {
	// try {
	if (!node.data.response) {
		await pauser(node as CustomNode, get);
	}
	// 	const docsLoaderNode = node.data as DocsLoaderDataType;

	// 	if (docsLoaderNode.text.trim() === '') {
	// 		throw new Error('No text provided');
	// 	}
	// 	const supabase = createSupabaseClient();

	// 	let embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiKey });
	// 	const session = await supabase.auth.getSession();

	// 	if (session.error) {
	// 		throw new Error(session.error.message);
	// 	}

	// 	// if no sessions found, use api key set in non-user's "session"
	// 	if (session && session.data && session.data.session && session.data.session.access_token) {
	// 		embeddings = new OpenAIEmbeddings(
	// 			{
	// 				openAIApiKey: session.data.session.access_token,
	// 			},
	// 			{
	// 				basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
	// 			},
	// 		);
	// 	}

	// 	if (docsLoaderNode.source === DocSource.pdfUrl) {
	// 		const loader = new PdfUrlLoader(docsLoaderNode.text);
	// 		const docs = await loader.load();

	// 		const splitter = new RecursiveCharacterTextSplitter();

	// 		const docOutput = await splitter.splitDocuments([docs[0]]);
	// 		console.log(docOutput);

	// 		await SupabaseVectorStoreWithFilter.fromDocuments(docOutput, embeddings, {
	// 			client: supabase,
	// 		});
	// 	}

	// 	node.data = {
	// 		...node.data,
	// 		isLoading: false,
	// 	};
	// } catch (error) {
	// 	node.data = {
	// 		...node.data,
	// 		isLoading: false,
	// 	};
	// 	throw error;
	// }
};

export default docsLoader;
