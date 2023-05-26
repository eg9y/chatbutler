import { TrashIcon } from '@heroicons/react/24/outline';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import ChatbotDetailsTabs from './ChatbotDetailsTabs';
import DocumentUploader from './DocumentUploader';
import { ReactComponent as Loading } from '../../../assets/loading.svg';
import useSupabase from '../../../auth/supabaseClient';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { conditionalClassNames } from '../../../utils/classNames';

export default function ChatbotDetails({
	session,
	chatbot,
}: {
	session: Session | null;
	chatbot: SimpleWorkflow;
}) {
	const [chatbotDocuments, setChatbotDocuments] = useState<
		| {
				[x: string]: any;
		  }[]
		| null
	>(null);

	const [isLoading, setIsLoading] = useState(false);

	const [currentTab, setCurrentTab] = useState('Documents');

	const supabase = useSupabase();

	useEffect(() => {
		async function loadSavedDocs() {
			const userSavedDocs = await supabase
				.from('user_documents')
				.select('*')
				.eq('chatbot_id', chatbot.id);
			if (userSavedDocs.error) {
				throw new Error(userSavedDocs.error.message);
			}
			setChatbotDocuments(userSavedDocs.data);
		}
		loadSavedDocs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="flex h-full">
				{/* Content area */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Main content */}
					<main className="flex flex-1 grow items-stretch overflow-hidden">
						<div className="mx-auto flex max-w-7xl grow flex-col px-4 pt-8 sm:px-6 lg:px-8">
							<div className="pb-5 ">
								<div className="flex flex-1 flex-col gap-2">
									<h2 className="text-lg font-semibold ">{chatbot.name}</h2>
									<p className="max-w-md">
										{chatbot.description.length > 0 ? (
											chatbot.description
										) : (
											<span className="italic text-slate-500">
												No description
											</span>
										)}
									</p>
								</div>
							</div>
							<ChatbotDetailsTabs
								currentTab={currentTab}
								setCurrentTab={setCurrentTab}
							/>

							<div className="grow pb-4">
								{currentTab === 'Documents' && (
									<ChatDetailsDocumentsTab
										chatbot={chatbot}
										setChatbotDocuments={setChatbotDocuments}
										chatbotDocuments={chatbotDocuments}
										setIsLoading={setIsLoading}
										supabase={supabase}
										isLoading={isLoading}
									/>
								)}
								{currentTab === 'Publish' && <PublishComponent chatbot={chatbot} />}
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
function PublishComponent({ chatbot }: { chatbot: SimpleWorkflow }) {
	const codeSnippets = [
		'<link rel="stylesheet" href="https://dd8pg4gc3k1pj.cloudfront.net/style.css">',
		'<script src="https://dd8pg4gc3k1pj.cloudfront.net/chat-widget.iife.js"></script>',
		`<script>
		  document.addEventListener("DOMContentLoaded", function() {
			  if (window.initializeChatbot) {
				  window.initializeChatbot({
					  chatBotId: '${chatbot.id}',
				  });
			  }
		  });
		  </script>
		`,
	];

	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(codeSnippets.join(''));
		setCopied(true);
	};

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => setCopied(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [copied]);

	return (
		<div className="flex  flex-col  pb-10">
			<div className="flex grow flex-col gap-2">
				<h1 className="text-base font-bold text-gray-900">Publish</h1>
				<p className="max-w-md">Embed your chatbot on your website</p>
			</div>
			<div className="rounded-lg bg-slate-700 shadow">
				<div className="flex flex-col px-4 py-5 sm:p-6">
					<div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-inner">
						<code className="text-sm text-yellow-100">{codeSnippets.join('\n')}</code>
						<button
							onClick={copyToClipboard}
							className="max-w-[200px] self-start rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-yellow-700 hover:bg-yellow-300"
						>
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ChatDetailsDocumentsTab({
	chatbot,
	setChatbotDocuments,
	chatbotDocuments,
	setIsLoading,
	supabase,
	isLoading,
}: {
	chatbot: SimpleWorkflow;
	setChatbotDocuments: React.Dispatch<
		React.SetStateAction<
			| {
					[x: string]: any;
			  }[]
			| null
		>
	>;
	chatbotDocuments: { [x: string]: any }[] | null;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	supabase: ReturnType<typeof useSupabase>;
	isLoading: boolean;
}) {
	return (
		<div>
			<div className="flex  flex-col  pb-10">
				<div className="flex grow flex-col gap-2">
					<h1 className="text-base font-bold text-gray-900">Documents</h1>
					<p className="max-w-md">Upload documents to interact with your chatbot</p>
				</div>
				<DocumentUploader chatbot={chatbot} setChatbotDocuments={setChatbotDocuments} />
			</div>
			<div className="flex flex-col gap-2">
				{chatbotDocuments === null && (
					<div className="flex grow items-baseline justify-center gap-2">
						Loading Documents{' '}
						<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
					</div>
				)}
				<section className="pb-16" aria-labelledby="gallery-heading">
					<ul role="list" className="divide-y divide-white/5">
						{chatbotDocuments?.map((doc) => (
							<li
								key={doc.name}
								onClick={() => {
									// dfd
								}}
								className="group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-1 hover:bg-slate-100 sm:px-6 lg:px-8"
							>
								<div className="min-w-0 grow">
									<div className="flex items-center gap-x-3">
										<div
											className={conditionalClassNames(
												'flex-none rounded-full p-1',
											)}
										>
											<div className="h-2 w-2 rounded-full bg-current" />
										</div>
										<h2 className="flex min-w-0 gap-x-2 text-sm font-semibold leading-6 text-slate-600">
											<span className="truncate">
												{doc.name.length > 55
													? `${doc.name.slice(0, 55)}...`
													: doc.name}
											</span>
										</h2>
									</div>
									<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-slate-400">
										<p className="truncate">{doc.description}</p>
										<svg
											viewBox="0 0 2 2"
											className="h-0.5 w-0.5 flex-none fill-slate-300"
										>
											<circle cx={1} cy={1} r={1} />
										</svg>
									</div>
								</div>

								<div className="flex flex-none items-center gap-x-4">
									<TrashIcon
										className="h-5 w-5 text-red-400 hover:scale-110 group-hover:text-red-500"
										onClick={async () => {
											setIsLoading(true);
											console.log('deleting doc', doc);
											const { data, error } = await supabase
												.from('documents')
												.delete()
												.eq('name', doc.name)
												.eq('chatbot_id', chatbot.id);
											if (error) {
												throw new Error(error.message);
											}
											setChatbotDocuments((prev) => {
												if (!prev) return [];
												return prev.filter((d) => d.name !== doc.name);
											});
											setIsLoading(false);
										}}
									/>
								</div>
								{isLoading && (
									<Loading className="h-5 w-5 animate-spin text-black" />
								)}
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
