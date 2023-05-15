import { TrashIcon } from '@heroicons/react/24/outline';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import useSupabase from '../../../auth/supabaseClient';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { useStore, selector } from '../../../store';
import { conditionalClassNames } from '../../../utils/classNames';
import Dropzone from '../../files/Dropzone';

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
									<h2 className="text-lg font-semibold text-slate-600">
										{chatbot.name}
									</h2>
									{chatbot.description && (
										<p className="pb-10 text-sm text-gray-500">
											{chatbot.description}
										</p>
									)}
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
								<div className="flex w-full">
									<div className="flex flex-1 flex-col gap-2">
										<h1 className="text-base font-bold text-gray-900">
											Documents
										</h1>
										<p className="max-w-md">
											Upload documents to interact with your chatbot
										</p>
										<p className="text-sm">Supported file types: txt, pdf</p>
									</div>
									<div className="flex-1">
										<Dropzone />
									</div>
								</div>

								{/* Gallery */}
								<section className="mt-8 pb-16" aria-labelledby="gallery-heading">
									<h2 id="gallery-heading" className="sr-only">
										All
									</h2>
									<ul
										role="list"
										className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
									>
										{chatbotDocuments?.map((file) => (
											<li key={file.name} className="relative">
												<div
													className={conditionalClassNames(
														'focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100',
														'group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100',
													)}
												>
													<img
														alt=""
														className={conditionalClassNames(
															'group-hover:opacity-75',
															'pointer-events-none object-cover',
														)}
													/>
													<button
														type="button"
														className="absolute inset-0 focus:outline-none"
													>
														<span className="sr-only">
															View details for {file.name}
														</span>
													</button>
												</div>
												<div className="flex items-center justify-between gap-2">
													<div>
														<p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
															{file.name}
														</p>
														{/* <p className="pointer-events-none block text-sm font-medium text-gray-500">
															{file.file_format}
														</p> */}
													</div>
													<button
														className="rounded-md bg-slate-50 p-1"
														// onClick={async () => {
														// 	await supabase.storage
														// 		.from('documents')
														// 		.remove([file.document_url]);
														// 	await supabase
														// 		.from('documents')
														// 		.delete()
														// 		.match({ id: file.id })
														// 		.select();
														// 	setDocuments(
														// 		documents.filter(
														// 			(document) =>
														// 				document.id !== file.id,
														// 		),
														// 	);
														// }}
													>
														<TrashIcon
															className={
																'mx-0 h-6 w-6 flex-shrink-0 text-red-700'
															}
															aria-hidden="true"
														/>
													</button>
												</div>
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
