import { SupabaseClient } from '@supabase/supabase-js';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { DocSource } from '../../../../../nodes/types/NodeTypes';
import { PdfLoader } from '../../../../../utils/docLoaders/pdfLoader';
import { PdfUrlLoader } from '../../../../../utils/docLoaders/pdfUrlLoader';
import { SupabaseVectorStoreWithFilter } from '../../../../../utils/vectorStores/SupabaseVectorStoreWithFilter';

export default async function loadDoc(
	source: DocSource,
	text: string,
	arrayBuffer: Uint8Array | null,
	openAiKey: string,
	supabase: SupabaseClient<any>,
	setIsDone: (isDone: boolean) => void,
	setIsLoading: (isLoading: boolean) => void,
	pauseResolver: (message: any) => void,
) {
	setIsLoading(true);

	let embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiKey });
	const session = await supabase.auth.getSession();

	if (session.error) {
		throw new Error(session.error.message);
	}

	let fileName = '';

	// if no sessions found, use api key set in non-user's "session"
	if (session && session.data && session.data.session && session.data.session.access_token) {
		embeddings = new OpenAIEmbeddings(
			{
				openAIApiKey: session.data.session.access_token,
			},
			{
				basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
			},
		);
	}

	if (source === DocSource.pdfUrl) {
		const loader = new PdfUrlLoader(text);

		const docs = await loader.load();

		const splitter = new RecursiveCharacterTextSplitter();

		const docOutput = await await splitter.splitDocuments(docs);
		fileName =
			docOutput[0].metadata.pdf?.info?.Title.trim().length > 0
				? docOutput[0].metadata.pdf?.info?.Title
				: `${docOutput[0].pageContent.slice(0, 20)}.pdf`;
		docOutput.map((doc) => {
			doc.metadata.name = fileName;
			return doc;
		});
		await SupabaseVectorStoreWithFilter.fromDocuments(
			docOutput,
			embeddings,
			{
				client: supabase,
			},
			{
				name: fileName,
			},
		);
	} else if (source === DocSource.github) {
		const loader = new GithubRepoLoader(text, {
			branch: 'main',
			recursive: true,
			ignoreFiles: [
				'package-lock.json',
				'.vercel',
				'.vscode',
				'dist',
				'yarn.lock',
				'LICENSE.md',
			],
			unknown: 'warn',
		});
		const docs = await loader.load();

		const splitter = new RecursiveCharacterTextSplitter();

		const docOutput = await await splitter.splitDocuments(docs);
		fileName = text.split('/').slice(-2).join('_');
		docOutput.map((doc) => {
			doc.metadata.name = fileName;
			return doc;
		});
		await SupabaseVectorStoreWithFilter.fromDocuments(
			docOutput,
			embeddings,
			{
				client: supabase,
			},
			{
				name: fileName,
			},
		);
	} else if (source === DocSource.pdf && arrayBuffer) {
		const loader = new PdfLoader(arrayBuffer);
		const docs = await loader.load();
		const splitter = new RecursiveCharacterTextSplitter();
		const docOutput = await await splitter.splitDocuments(docs);
		fileName =
			docOutput[0].metadata.pdf?.info?.Title.trim().length > 0
				? docOutput[0].metadata.pdf?.info?.Title
				: `${docOutput[0].pageContent.slice(0, 20)}.pdf`;
		docOutput.map((doc) => {
			doc.metadata.name = fileName;
			return doc;
		});
		await SupabaseVectorStoreWithFilter.fromDocuments(
			docOutput,
			embeddings,
			{
				client: supabase,
			},
			{
				name: fileName,
			},
		);
	}
	setIsLoading(false);
	pauseResolver(fileName);
	setIsDone(true);
}
