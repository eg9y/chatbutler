import { Document } from 'langchain/document';
import { BaseDocumentLoader, DocumentLoader } from 'langchain/document_loaders/base';
import * as PDFJS from 'pdfjs-dist';

export class PdfLoader extends BaseDocumentLoader implements DocumentLoader {
	private pdfData: Uint8Array;

	constructor(pdfData: Uint8Array) {
		super();
		this.pdfData = pdfData;
		PDFJS.GlobalWorkerOptions.workerSrc = new URL(
			'pdfjs-dist/build/pdf.worker.js',
			import.meta.url,
		).toString();
	}

	async load(): Promise<Document[]> {
		try {
			const pdf = await PDFJS.getDocument(this.pdfData).promise;
			const numPages = pdf.numPages;
			const documents: Document[] = [];

			for (let i = 1; i <= numPages; i++) {
				const page = await pdf.getPage(i);
				const pageContent = await page.getTextContent();
				const text = pageContent.items
					.map((item) => {
						if ('str' in item) {
							return item.str;
						}
					})
					.join(' ');
				const meta = await pdf.getMetadata().catch(() => null);
				documents.push(
					new Document({
						pageContent: text,
						metadata: {
							pdf: {
								info: meta?.info,
								metadata: meta?.metadata,
								totalPages: pdf.numPages,
							},
							loc: {
								pageNumber: i,
							},
						},
					}),
				);
			}
			return documents;
		} catch (error) {
			throw new Error(`Could not load PDF from data: ${error}`);
		}
	}
}
