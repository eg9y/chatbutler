import { db } from './dexieDb/db';
import { OpenAIEmbeddings } from './langChainBrowser/embeddings';
import { RecursiveCharacterTextSplitter } from './langChainBrowser/text_splitter';
import { Dexie } from './langChainBrowser/vectorstores/dexie';

export const processFile = async (
	text: string | ArrayBuffer,
	documentId: number,
	openAIApiKey: string,
) => {
	if (typeof text === 'string') {
		const splitter = new RecursiveCharacterTextSplitter();
		const documents = await splitter.createDocuments([text], [{ documentId }]);
		const newCollectionId = await db.DocumentCollections.add({
			name: documentId.toString(),
			documents: new Set([documentId]),
		});

		const newCollection = await db.DocumentCollections.get(newCollectionId);

		const dexieVector = new Dexie(
			new OpenAIEmbeddings({
				openAIApiKey: openAIApiKey,
			}),
			{
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				collection: newCollection!,
				index: db,
			},
		);

		dexieVector.addDocuments(documents);
	}
};
