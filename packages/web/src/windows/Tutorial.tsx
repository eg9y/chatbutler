import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { MDXProvider } from '@mdx-js/react';
import { Fragment, useState } from 'react';

import Search from './Tutorials/Files/Search.mdx';
import Chat from './Tutorials/GptNodes/Chat.mdx';
import GptNodes from './Tutorials/GptNodes/GptNodes.mdx';
import Nodes from './Tutorials/Nodes.mdx';
import Overview from './Tutorials/Overview.mdx';
import UseCases from './Tutorials/UseCases.mdx';
import { conditionalClassNames } from '../utils/classNames';

const navigation = [
	{ name: 'Overview', current: true },
	{ name: 'Nodes', current: false },
	{ name: 'Use Cases', current: false },
	{
		name: 'GPT Nodes',
		current: false,
		children: [{ name: 'Chat' }, { name: 'Completion' }],
	},
	{
		name: 'Helper Nodes',
		current: false,
		children: [{ name: 'Text' }, { name: 'Classify' }],
	},
	{
		name: 'File Nodes',
		current: false,
		children: [{ name: 'File Text' }, { name: 'Search' }, { name: 'Combine' }],
	},
];

export default function Tutorial({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [page, setPage] = useState<string>('Overview');

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="font-tutorial relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-slate-300 bg-opacity-75 transition-opacity" />
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
							<Dialog.Panel
								style={{
									height: '90vh',
								}}
								className="relative mx-10 flex max-w-full transform flex-col rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
							>
								<Dialog.Title
									as="div"
									className="flex gap-12  pb-4 pl-4 text-3xl font-semibold leading-6 text-slate-900"
								>
									<h1>Tutorial</h1>
									<h2>{page}</h2>
								</Dialog.Title>
								<div className="flex h-full w-full">
									<div className="w-40">
										<SideBar page={page} setPage={setPage} />
									</div>
									<div className="relative w-full overflow-y-scroll">
										<div className="prose absolute w-full px-6 py-4 prose-h2:m-1">
											<MDXProvider>
												{page === 'Overview' && (
													<Overview setPage={setPage} />
												)}
												{page === 'Search' && <Search />}
												{page === 'Nodes' && <Nodes />}
												{page === 'Use Cases' && <UseCases />}
												{page === 'GPT Nodes' && <GptNodes />}
												{page === 'Chat' && <Chat />}
											</MDXProvider>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

function SideBar({ page, setPage }: { page: string; setPage: (page: string) => void }) {
	return (
		<div className="flex h-full flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white">
			<nav className="flex  flex-col">
				<ul role="list" className="flex flex-col gap-y-7">
					<li>
						<ul role="list" className="space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									{!item.children ? (
										<div
											className={conditionalClassNames(
												page === item.name
													? 'bg-slate-300'
													: 'hover:bg-slate-50',
												'block cursor-pointer rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6 text-slate-700',
											)}
											onClick={() => setPage(item.name)}
										>
											{item.name}
										</div>
									) : (
										<Disclosure as="div">
											{({ open }) => (
												<>
													<Disclosure.Button
														className={conditionalClassNames(
															page === item.name
																? 'bg-slate-300'
																: 'hover:bg-slate-50',
															'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-slate-700',
														)}
														onClick={() => setPage(item.name)}
													>
														<ChevronRightIcon
															className={conditionalClassNames(
																open
																	? 'rotate-90 text-slate-500'
																	: 'text-slate-400',
																'h-5 w-5 shrink-0',
															)}
															aria-hidden="true"
														/>
														{item.name}
													</Disclosure.Button>
													<Disclosure.Panel as="ul" className="mt-1 px-2">
														{item.children.map((subItem) => (
															<li key={subItem.name}>
																<a
																	className={conditionalClassNames(
																		page === subItem.name
																			? 'bg-slate-300'
																			: 'hover:bg-slate-50',
																		'block cursor-pointer rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-slate-700',
																	)}
																	onClick={() =>
																		setPage(subItem.name)
																	}
																>
																	{subItem.name}
																</a>
															</li>
														))}
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									)}
								</li>
							))}
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	);
}
