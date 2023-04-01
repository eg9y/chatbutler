import * as tf from '@tensorflow/tfjs';

import { VectorStore } from './base.js';
import { DocumentCollections, MySubClassedDexie } from '../../dexieDb/db.js';
import { Document } from '../document.js';
import { Embeddings } from '../embeddings/base.js';

async function cosineSimilarity(a: number[], b: number[]): Promise<number> {
	const aTensor = tf.tensor1d(a);
	const bTensor = tf.tensor1d(b);

	const dotProduct = tf.sum(tf.mul(aTensor, bTensor));
	const normA = tf.norm(aTensor);
	const normB = tf.norm(bTensor);

	const cosineSimilarity = dotProduct.div(normA.mul(normB));
	return await cosineSimilarity.dataSync()[0];
}

async function similaritySearch(
	queryEmbedding: number[],
	embeddings: Nearests[],
	topK: number,
): Promise<Nearests[]> {
	const similarityScores: Array<{ score: number; document: Nearests }> = [];

	for (const document of embeddings) {
		const similarity = await cosineSimilarity(queryEmbedding, document.embeddings);
		similarityScores.push({ score: similarity, document });
	}

	similarityScores.sort((a, b) => b.score - a.score);

	return similarityScores.slice(0, topK).map((item) => item.document);
}

type Nearests = {
	id: string; // id of the nearest resource
	title: string; // title of the nearest resource
	url: string; // path of the nearest resource
	body: string; // body of the nearest resource
	embeddings: number[]; // embeddings of the nearest resource
};

export interface DexieArgs {
	numDimensions?: number;
	collection: DocumentCollections;
	index?: MySubClassedDexie;
}

export class Dexie extends VectorStore {
	index?: MySubClassedDexie;

	collection: DocumentCollections;

	numDimensions?: number;

	constructor(embeddings: Embeddings, args: DexieArgs) {
		super(embeddings, args);
		this.index = args.index;
		this.embeddings = embeddings;
		this.collection = args.collection;
	}

	async addDocuments(documents: Document[]): Promise<void> {
		const texts = documents.map(({ pageContent }) => pageContent);
		await this.addVectors(await this.embeddings.embedDocuments(texts), documents);
	}

	async addVectors(vectors: number[][], documents: Document[]) {
		if (vectors.length === 0) {
			return;
		}
		if (vectors.length !== documents.length) {
			throw new Error(`Vectors and metadatas must have the same length`);
		}
		if (this.numDimensions === undefined) {
			this.numDimensions = vectors[0].length;
		}
		if (vectors[0].length !== this.numDimensions) {
			throw new Error(
				`Vectors must have the same length as the number of dimensions (${this.numDimensions})`,
			);
		}

		const documentEmbeddings = await vectors.map((vector, i) => {
			return {
				document_id: documents[i].metadata.documentId,
				title: documents[i].pageContent,
				embeddings: vector,
			};
		});

		this.index?.DocumentEmbeddings.bulkAdd(documentEmbeddings);
	}

	async similaritySearchVectorWithScore(query: number[], k: number) {
		if (!this.index) {
			throw new Error('Vector store not initialised yet. Try calling `addTexts` first.');
		}

		let data: any = await this.index?.DocumentEmbeddings.filter((doc) => {
			// return this.collection.documents.has(doc.document_id);
			return true;
		}).toArray();

		data = data.map((doc: any) => {
			return {
				id: doc.document_id ? doc.document_id.toString() : '',
				title: doc.title,
				embeddings: doc.embeddings,
				url: '',
			};
		});

		const results = await similaritySearch(query, data, 3);

		const foo = results.map((result) => {
			return [new Document({ pageContent: result.title, metadata: { id: result.id } }), 0];
		}) as [Document, number][];

		return foo;
		// return [];
	}

	static async fromTexts(
		texts: string[],
		metadatas: object[] | object,
		embeddings: Embeddings,
		dbConfig: DexieArgs,
	): Promise<Dexie> {
		const docs: Document[] = [];
		for (let i = 0; i < texts.length; i += 1) {
			const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
			const newDoc = new Document({
				pageContent: texts[i],
				metadata,
			});
			docs.push(newDoc);
		}
		return Dexie.fromDocuments(docs, embeddings, dbConfig);
	}

	static async fromDocuments(
		docs: Document[],
		embeddings: Embeddings,
		dbConfig: DexieArgs,
	): Promise<Dexie> {
		const instance = new this(embeddings, dbConfig);
		await instance.addDocuments(docs);
		return instance;
	}

	static async fromExistingCollection(
		embeddings: Embeddings,
		dbConfig: DexieArgs,
	): Promise<Dexie> {
		const instance = new this(embeddings, dbConfig);
		return instance;
	}
}
