// db.ts
import Dexie, { Table } from 'dexie';

interface Identifier {
	id?: number;
}

export interface DocumentMetadata {
	created_at: string;
	name: string;
	file_format: string;
	size: number;
	content: string;
}

export interface DocumentCollections {
	name: string;
	documents: Set<number>;
}

export interface DocumentEmbeddings {
	document_id: number;
	title: string; // the document chunk content
	embeddings: number[];
}

export class MySubClassedDexie extends Dexie {
	DocumentMetadata!: Table<DocumentMetadata & Identifier>;
	DocumentEmbeddings!: Table<DocumentEmbeddings & Identifier>;
	DocumentCollections!: Table<DocumentCollections & Identifier>;

	constructor() {
		super('documents');
		this.version(3).stores({
			DocumentMetadata: '++id, name, file_format, content',
			DocumentEmbeddings: '++id, document_id, title, embeddings',
			DocumentCollections: '++id,name,documents',
		});
	}
}

export const db = new MySubClassedDexie();
