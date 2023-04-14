import { createSupabaseClient } from '../../auth/supabaseClient';
import { Document } from '../../backgroundTasks/langChainBrowser/document';
import { OpenAIEmbeddings } from '../../backgroundTasks/langChainBrowser/embeddings';
import { SupabaseVectorStore } from '../../backgroundTasks/langChainBrowser/vectorstores/supabase';
import { processFile } from '../../backgroundTasks/processFile';
import { CustomNode, SearchDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

const search = async (node: CustomNode, get: () => RFState) => {
	try {
		const inputs = node.data.inputs;
		const searchNode = node.data as SearchDataType;
		const document = searchNode?.document;
		if (!document) {
			throw new Error('Document is not defined');
		}
		const document_url = document.document_url;
		const supabase = createSupabaseClient();
		const { data: isDocumentProcessed, error: isDocumentProcessedError } = await supabase
			.from('document_contents')
			.select('document_id')
			.eq('document_id', document.id)
			.limit(1);
		if (isDocumentProcessedError) {
			throw new Error('Error checking if document is processed');
		}
		let searchResults: Document[] = [];
		if (isDocumentProcessed?.length === 0) {
			// Document is not processed
			// get document from store
			const { data, error } = await supabase.storage
				.from('documents')
				.createSignedUrl(document_url, 60);

			if (error) {
				throw new Error('Error getting document from store');
			}
			if (!data) {
				throw new Error('Error getting document from store');
			}
			const signedUrl = data.signedUrl;
			// use fetch to get the document
			const response = await fetch(signedUrl);
			const documentContents = await response.text();
			const chunkedUpDocuments = await processFile(documentContents, document.id);

			if (!chunkedUpDocuments) {
				throw new Error('Error processing file');
			}

			const vectorStore = await SupabaseVectorStore.fromTexts(
				chunkedUpDocuments?.map((doc) => doc.pageContent),
				chunkedUpDocuments?.map((doc) => doc.metadata),
				new OpenAIEmbeddings(),
				{
					client: supabase,
					tableName: 'document_contents',
					queryName: 'match_document_contents',
				},
			);
			const parsedPrompt = parsePromptInputs(get, searchNode.text, inputs.inputs);
			searchResults = await vectorStore.similaritySearch(parsedPrompt, searchNode.results);
		} else {
			const vectorStore = await SupabaseVectorStore.fromExistingIndex(
				new OpenAIEmbeddings(),
				{
					client: supabase,
					tableName: 'document_contents',
					queryName: 'match_document_contents',
				},
			);
			const parsedPrompt = parsePromptInputs(get, searchNode.text, inputs.inputs);
			searchResults = await vectorStore.similaritySearch(parsedPrompt, searchNode.results);
		}
		node.data = {
			...node.data,
			// TODO: need to have a combiner node or a for loop node
			response: JSON.stringify(searchResults),
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
