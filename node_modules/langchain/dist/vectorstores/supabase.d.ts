import type { SupabaseClient } from "@supabase/supabase-js";
import { VectorStore } from "./base.js";
import { Embeddings } from "../embeddings/base.js";
import { Document } from "../document.js";
export interface SupabaseLibArgs {
    client: SupabaseClient;
    tableName?: string;
    queryName?: string;
}
export declare class SupabaseVectorStore extends VectorStore {
    client: SupabaseClient;
    tableName: string;
    queryName: string;
    constructor(embeddings: Embeddings, args: SupabaseLibArgs);
    addDocuments(documents: Document[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number): Promise<[Document, number][]>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig: SupabaseLibArgs): Promise<SupabaseVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: SupabaseLibArgs): Promise<SupabaseVectorStore>;
    static fromExistingIndex(embeddings: Embeddings, dbConfig: SupabaseLibArgs): Promise<SupabaseVectorStore>;
}
