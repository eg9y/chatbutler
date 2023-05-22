import { Document } from 'langchain/document';
import { BaseDocumentLoader, DocumentLoader } from 'langchain/document_loaders/base';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

export class PdfWebBaseLoader extends BaseDocumentLoader implements DocumentLoader {
	private pdfData: Uint8Array;

	constructor(pdfData: Uint8Array) {
		super();
		this.pdfData = pdfData;
	}

	async processPage(
		pdf: PDFDocumentProxy,
		pageIndex: number,
		meta: {
			info: object;
			metadata: Metadata;
		} | null,
	): Promise<Document> {
		const page = await pdf.getPage(pageIndex);
		const pageContent = await page.getTextContent();
		const text = pageContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');

		return new Document({
			pageContent: text,
			metadata: {
				pdf: {
					info: meta?.info,
					metadata: meta?.metadata,
					totalPages: pdf.numPages,
				},
				loc: {
					pageNumber: pageIndex,
				},
			},
		});
	}

	async load(): Promise<Document[]> {
		try {
			const { getDocument } = await PDFLoaderImports();
			const pdf = await getDocument(this.pdfData).promise;
			const { numPages } = pdf;
			const meta = await pdf.getMetadata().catch(() => null);

			const pagePromises = Array.from({ length: numPages }, (_, i) =>
				this.processPage(pdf, i + 1, meta),
			);

			return await Promise.all(pagePromises);
		} catch (error) {
			throw new Error(`Could not load PDF from data: ${error}`);
		}
	}
}

async function PDFLoaderImports() {
	try {
		const { default: mod } = await import('pdfjs-dist');
		const { getDocument, version, GlobalWorkerOptions } = mod;
		const workerSrc = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url);
		GlobalWorkerOptions.workerSrc = workerSrc.toString();

		return { getDocument, version };
	} catch (e) {
		console.error(e);
		throw new Error(
			'Failed to load pdfjs-dist. Please install it with eg. `npm install pdfjs-dist`.',
		);
	}
}
