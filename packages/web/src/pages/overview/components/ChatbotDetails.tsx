import { TrashIcon } from '@heroicons/react/24/outline';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import DocumentUploader from './DocumentUploader';
import { ReactComponent as Loading } from '../../../assets/loading.svg';
import useSupabase from '../../../auth/supabaseClient';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { useStore, selector } from '../../../store';
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
					<div className="flex flex-1 items-stretch overflow-hidden">
						<main className="flex-1 overflow-y-auto">
							<div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
								<div className="pb-10 ">
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

									<div className="flex w-full flex-col pt-10">
										<div className="flex flex-1 flex-col gap-2">
											<h1 className="text-base font-bold text-gray-900">
												Editor
											</h1>
											<p className="max-w-md">Edit your chatbot logic</p>
										</div>
										<div className="flex-1">
											<button
												type="button"
												onClick={() => {
													window.open(
														`/app/?user_id=${session?.user.id}&id=${chatbot.id}`,
														'_self',
													);
												}}
												className="rounded-md bg-slate-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
											>
												Go to Editor
											</button>
										</div>
									</div>
								</div>
								<div className="flex w-full flex-col">
									<div className="flex flex-1 flex-col gap-2">
										<h1 className="text-base font-bold text-gray-900">
											Documents
										</h1>
										<p className="max-w-md">
											Upload documents to interact with your chatbot
										</p>
									</div>
									<div className="flex-1">
										<DocumentUploader
											chatbot={chatbot}
											setChatbotDocuments={setChatbotDocuments}
										/>
									</div>
								</div>

								<section className="mt-8 pb-16" aria-labelledby="gallery-heading">
									<h2 id="gallery-heading" className="sr-only">
										All
									</h2>
									<ul role="list" className="divide-y divide-white/5">
										{chatbotDocuments?.map((doc) => (
											<li
												key={doc.name}
												onClick={() => {
													// dfd
												}}
												className="group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4 hover:bg-slate-100 sm:px-6 lg:px-8"
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
																{doc.name}
															</span>
														</h2>
													</div>
													<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-slate-400">
														<p className="truncate">
															{doc.description}
														</p>
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
																return prev.filter(
																	(d) => d.name !== doc.name,
																);
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
						</main>
					</div>
				</div>
			</div>
		</>
	);
}
