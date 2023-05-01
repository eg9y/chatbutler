import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid';
import { Fragment, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ChatSessionType } from '../../../db/dbTypes';
import { updateWorkflowStates } from '../../../db/selectWorkflow';
import useStore, { RFState, selector } from '../../../store/useStore';
import { conditionalClassNames } from '../../../utils/classNames';
import { Message } from '../../../windows/ChatPanel/Chat/types';

export default function SideNav({
	children,
	abortControllerRef,
	chatSessions,
	setChatSessions,
	currentChatSessionIndex,
	setCurrentChatSessionIndex,
}: {
	children: React.ReactNode;
	abortControllerRef: React.MutableRefObject<AbortController | null>;
	chatSessions: RFState['chatSessions'];
	setChatSessions: RFState['setChatSessions'];
	currentChatSessionIndex: RFState['currentChatSessionIndex'];
	setCurrentChatSessionIndex: RFState['setCurrentChatSessionIndex'];
}) {
	const { setCurrentWorkflow, setGlobalVariables, setNodes, setEdges, setChatApp } = useStore(
		selector,
		shallow,
	);

	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div className="h-full flex">
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-slate-900/80" />
						</Transition.Child>

						<div className="fixed inset-0 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
											<button
												type="button"
												className="-m-2.5 p-2.5"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon
													className="h-6 w-6 text-white"
													aria-hidden="true"
												/>
											</button>
										</div>
									</Transition.Child>
									{/* Sidebar component, swap this element with another sidebar if you like */}
									<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
										<div className="flex h-16 shrink-0 items-center">
											<img
												className="h-8 w-auto"
												src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
												alt="Your Company"
											/>
										</div>
										<nav className="flex flex-1 flex-col">
											<ul
												role="list"
												className="flex flex-1 flex-col gap-y-2"
											>
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														<li>
															<a
																className={conditionalClassNames(
																	'bg-slate-50 text-blue-600',
																	'cursor-pointer group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																)}
															>
																<ChatBubbleLeftEllipsisIcon
																	className={conditionalClassNames(
																		'text-blue-600',
																		'h-6 w-6 shrink-0',
																	)}
																	aria-hidden="true"
																/>
																Chatbots
															</a>
														</li>
													</ul>
												</li>
												<li>
													<ul
														role="list"
														className="-mx-2 mt-2 space-y-1"
													>
														<NewChatSessionButton
															setChatSessions={setChatSessions}
															chatSessions={chatSessions}
															setCurrentChatSessionIndex={
																setCurrentChatSessionIndex
															}
															setChatApp={setChatApp}
														/>
														{chatSessions.map((session, index) => {
															return (
																<li key={session.id}>
																	<a
																		className={conditionalClassNames(
																			'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
																			'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																		)}
																	>
																		<span
																			className={conditionalClassNames(
																				'text-slate-400 border-slate-200 group-hover:border-blue-600 group-hover:text-blue-600',
																				'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
																			)}
																		>
																			{session.workflow
																				? session.workflow
																						.name[0]
																				: ''}
																		</span>
																		<span className="truncate">
																			{session.workflow
																				? session.workflow
																						.name
																				: 'New Chat'}
																		</span>
																		<span>
																			<XMarkIcon
																				className={
																					'text-slate-400 hover:text-slate-700 h-5 w-5 flex-shrink-0'
																				}
																				aria-hidden="true"
																				onClick={() => {
																					const newSessions =
																						[
																							...chatSessions,
																						];
																					if (
																						chatSessions.length ===
																						1
																					) {
																						setCurrentChatSessionIndex(
																							-1,
																						);
																					} else if (
																						index <=
																						currentChatSessionIndex
																					) {
																						setCurrentChatSessionIndex(
																							currentChatSessionIndex -
																								1,
																						);
																					}
																					newSessions.splice(
																						index,
																						1,
																					);
																					setChatSessions(
																						newSessions,
																					);
																				}}
																			/>
																		</span>
																	</a>
																</li>
															);
														})}
														{/* {chatbots.map((chatbot: any) => (
															<li key={chatbot.name}>
																<a
																	className={conditionalClassNames(
																		chatbot.current
																			? 'bg-slate-50 text-blue-600'
																			: 'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
																		'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																	)}
																>
																	<span
																		className={conditionalClassNames(
																			chatbot.current
																				? 'text-blue-600 border-blue-600'
																				: 'text-slate-400 border-slate-200 group-hover:border-blue-600 group-hover:text-blue-600',
																			'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
																		)}
																	>
																		{chatbot.initial}
																	</span>
																	<span className="truncate">
																		{chatbot.name}
																	</span>
																</a>
															</li>
														))} */}
													</ul>
												</li>
											</ul>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:sticky lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col h-[95vh] pt-4">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6">
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-2">
								<a
									className={conditionalClassNames(
										'bg-slate-50 text-blue-600',
										'group flex gap-x-3 rounded-md  text-lg leading-6 font-semibold',
									)}
								>
									<ChatBubbleLeftEllipsisIcon
										className={conditionalClassNames(
											'text-blue-600',
											'h-6 w-6 shrink-0',
										)}
										aria-hidden="true"
									/>
									Chatbots
								</a>
								{/* <div className="relative mt-2">
									<label
										htmlFor="name"
										className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-slate-900"
									>
										Search
									</label>
									<input
										type="text"
										name="name"
										id="name"
										className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div> */}
								<li>
									<ul role="list" className="-mx-2 mt-2 space-y-1">
										<NewChatSessionButton
											setChatSessions={setChatSessions}
											chatSessions={chatSessions}
											setCurrentChatSessionIndex={setCurrentChatSessionIndex}
											setChatApp={setChatApp}
										/>
										{chatSessions.map((session: ChatSessionType, index) => (
											<li key={session.id}>
												<a
													onClick={async () => {
														if (session.workflow) {
															await updateWorkflowStates(
																session.workflow,
																setNodes,
																setEdges,
																setGlobalVariables,
																setCurrentWorkflow,
															);
															abortControllerRef.current?.abort();
														}
														setCurrentChatSessionIndex(index);
														abortControllerRef.current = null;
														setChatApp(chatSessions[index].messages);
													}}
													className={conditionalClassNames(
														currentChatSessionIndex === index
															? 'bg-slate-50 text-blue-600'
															: 'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
														'cursor-pointer group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
													)}
												>
													{session.workflow && (
														<>
															<span
																className={conditionalClassNames(
																	// session.current
																	// ? 'text-blue-600 border-blue-600'
																	'text-slate-400 border-slate-200 group-hover:border-blue-600 group-hover:text-blue-600',
																	'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
																)}
															>
																{session.workflow.name[0]}
															</span>
														</>
													)}
													<span className="truncate">
														{session.workflow
															? session.workflow.name
															: 'New Chat'}
													</span>
													<span>
														<XMarkIcon
															className={
																'text-slate-400 hover:text-slate-700 h-5 w-5 flex-shrink-0'
															}
															aria-hidden="true"
															onClick={() => {
																const newSessions = [
																	...chatSessions,
																];
																if (chatSessions.length === 1) {
																	setCurrentChatSessionIndex(-1);
																	setChatSessions([]);
																	return;
																} else if (
																	index <= currentChatSessionIndex
																) {
																	setCurrentChatSessionIndex(
																		currentChatSessionIndex - 1,
																	);
																}
																newSessions.splice(index, 1);
																setChatSessions(newSessions);
															}}
														/>
													</span>
												</a>
											</li>
										))}
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
					<button
						type="button"
						className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>

				<main className="grow lg:pl-4 px-2 sm:px-1 lg:px-8">{children}</main>
			</div>
		</>
	);
}
function NewChatSessionButton({
	setChatSessions,
	chatSessions,
	setCurrentChatSessionIndex,
	setChatApp,
}: {
	setChatSessions: (chatSessions: ChatSessionType[]) => void;
	chatSessions: ChatSessionType[];
	setCurrentChatSessionIndex: (index: number) => void;
	setChatApp: (messages: Message[]) => void;
}) {
	return (
		<li>
			<a
				onClick={async () => {
					setChatSessions([
						...chatSessions,
						{
							id: nanoid(),
							workflow: null,
							messages: [],
						},
					]);
					setCurrentChatSessionIndex(chatSessions.length);
					setChatApp([]);
				}}
				className={conditionalClassNames(
					// ? 'bg-slate-50 text-blue-600'
					'cursor-pointer group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 ring-1 ring-slate-400',
				)}
			>
				<span>
					<PlusIcon
						className={'hover:text-slate-700 h-5 w-5 flex-shrink-0'}
						aria-hidden="true"
						onClick={() => {
							// placeholder
						}}
					/>
				</span>
				New Chat
			</a>
		</li>
	);
}
