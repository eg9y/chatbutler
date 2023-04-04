import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

import Chat from './Tutorials/GptNodes/Chat';
import GptNodes from './Tutorials/GptNodes/GptNodes';
import Overview from './Tutorials/Overview';
import UseCases from './Tutorials/UseCases';
import { conditionalClassNames } from '../utils/classNames';

const navigation = [
	{ name: 'Overview', current: true },
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
			<Dialog as="div" className="relative z-10 font-tutorial text-xl" onClose={setOpen}>
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
							<Dialog.Panel
								style={{
									height: '70vh',
								}}
								className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-full sm:p-6 mx-10 flex flex-col"
							>
								<Dialog.Title
									as="h3"
									className="text-3xl pl-4  font-semibold leading-6 text-gray-900 pb-4 flex gap-2"
								>
									Tutorial: {page}
								</Dialog.Title>
								<div className="flex h-full w-full">
									<div className="w-40">
										<SideBar setPage={setPage} />
									</div>
									{page === 'Overview' && <Overview />}
									{page === 'Use Cases' && <UseCases />}
									{page === 'GPT Nodes' && <GptNodes />}
									{page === 'Chat' && <Chat />}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

function SideBar({ setPage }: { setPage: (page: string) => void }) {
	return (
		<div className="flex h-full flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
			<nav className="flex  flex-col">
				<ul role="list" className="flex flex-col gap-y-7">
					<li>
						<ul role="list" className="space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									{!item.children ? (
										<div
											className={conditionalClassNames(
												item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
												'cursor-pointer block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700',
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
															item.current
																? 'bg-gray-50'
																: 'hover:bg-gray-50',
															'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
														)}
														onClick={() => setPage(item.name)}
													>
														<ChevronRightIcon
															className={conditionalClassNames(
																open
																	? 'rotate-90 text-gray-500'
																	: 'text-gray-400',
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
																		item.current
																			? 'bg-gray-50'
																			: 'hover:bg-gray-50',
																		'cursor-pointer block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700',
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
