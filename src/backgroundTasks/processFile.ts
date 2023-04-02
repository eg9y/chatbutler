import { RecursiveCharacterTextSplitter } from './langChainBrowser/text_splitter';

export const processFile = async (text: string | ArrayBuffer, documentId: number) => {
	if (typeof text === 'string') {
		const splitter = new RecursiveCharacterTextSplitter();
		const documents = await splitter.createDocuments([text], [{ documentId }]);
		return documents;
	}
};
