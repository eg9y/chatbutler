import { SearchDataType } from '@chatbutler/shared/src/index';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ReactComponent as Loading } from '../assets/loading.svg';
import useSupabase from '../auth/supabaseClient';
import { useStore, selector } from '../store';
import { RFState } from '../store/useStore';
import { conditionalClassNames } from '../utils/classNames';

export default function DocumentSelector({
	open,
	setOpen,
	selectedDocuments,
	setSelectedDocuments,
	id,
	data,
	updateNode,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedDocuments: string[];
	setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
	id: string;
	data: SearchDataType;
	updateNode: RFState['updateNode'];
}) {
	const cancelButtonRef = useRef(null);
	const { currentWorkflow } = useStore(selector, shallow);
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
			setIsLoading(true);
			if (currentWorkflow && open && !chatbotDocuments) {
				const userSavedDocs = await supabase
					.from('user_documents')
					.select('*')
					.eq('chatbot_id', currentWorkflow.id);
				if (userSavedDocs.error) {
					throw new Error(userSavedDocs.error.message);
				}
				setChatbotDocuments(userSavedDocs.data);
			}
			setIsLoading(false);
		}
		loadSavedDocs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, currentWorkflow]);

	const handleDocumentClick = (docId: string) => {
		if (selectedDocuments.includes(docId)) {
			const newSelectedDocuments = [...selectedDocuments].filter((id) => id !== docId);
			setSelectedDocuments(newSelectedDocuments);
			updateNode(id, {
				...data,
				docs: newSelectedDocuments.join(','),
			});
		} else {
			const newSelectedDocuments = [...selectedDocuments, docId];
			setSelectedDocuments(newSelectedDocuments);
			updateNode(id, {
				...data,
				docs: newSelectedDocuments.join(','),
			});
		}
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div>
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<CheckIcon
											className="h-6 w-6 text-green-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Chatbot Documents
										</Dialog.Title>
										<div className="mt-2">
											{isLoading ? (
												<div className="flex justify-center">
													<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
												</div>
											) : (
												<ul role="list" className="divide-y divide-white/5">
													{chatbotDocuments?.map((doc) => (
														<li
															key={doc.name}
															onClick={() =>
																handleDocumentClick(doc.name)
															}
															className={conditionalClassNames(
																'group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4  sm:px-6 lg:px-8',
																selectedDocuments.includes(
																	doc.name,
																) && 'bg-green-200', // conditional class for selected document
															)}
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
															</div>
														</li>
													))}
												</ul>
											)}
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:col-start-2"
										onClick={() => setOpen(false)}
									>
										Done
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
