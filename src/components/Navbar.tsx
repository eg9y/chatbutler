import { Dialog } from '@headlessui/react';
import {
	ArrowTopRightOnSquareIcon,
	Bars3Icon,
	DocumentTextIcon,
	XMarkIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { shallow } from 'zustand/shallow';

import EditableText from './EditableText';
import useSupabase from '../auth/supabaseClient';
import syncDataToSupabase from '../db/syncToSupabase';
import { useStore, useStoreSecret, selector, selectorSecret } from '../store';
import { conditionalClassNames } from '../utils/classNames';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';
import { useQueryParams } from '../utils/useQueryParams';

const NavBar = () => {
	const navigation = [
		{ name: 'Editor', href: '/' },
		// { name: 'Files', href: '/files/' },
		{ name: 'Gallery', href: '/gallery/' },
		{ name: 'Chat', href: '/chat/' },
	];
	const [location] = useLocation();
	const params = useQueryParams();

	const {
		currentWorkflow,
		setCurrentWorkflow,
		clearGraph,
		nodes,
		edges,
		setNodes,
		setEdges,
		workflows,
		setWorkflows,
		setUiErrorMessage,
		setUsername,
	} = useStore(selector, shallow);
	const { session, setSession } = useStoreSecret(selectorSecret, shallow);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const supabase = useSupabase();

	return (
		<header
			style={{
				height: '5vh',
			}}
			className="z-20 border-b-1 border-slate-400 bg-slate-100"
		>
			<nav
				className="mx-auto flex h-full items-end justify-between p-1 lg:px-2"
				aria-label="Global"
			>
				<div className=" flex h-full flex-1 items-center gap-2">
					{location === '/' && (
						<>
							<DocumentTextIcon className="h-6 w-6 text-slate-800" />
							<div className="flex items-center gap-2 text-slate-800">
								{currentWorkflow ? (
									<EditableText
										currentWorkflow={currentWorkflow}
										setCurrentWorkflow={setCurrentWorkflow}
										setWorkflows={setWorkflows}
										session={session}
									/>
								) : (
									'Untitled Sandbox'
								)}
								{!isWorkflowOwnedByUser(session, params) && (
									<p className="text-slate-500">(Read Mode)</p>
								)}
							</div>
						</>
					)}
					{location != '/' && (
						<div className="flex h-full items-end font-semibold text-slate-800">
							Promtpsandbox.io
						</div>
					)}
					<div className="flex md:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
				<div>
					<div className="hidden md:flex md:gap-x-4">
						{navigation.map((item) => (
							<a
								key={item.name}
								className={conditionalClassNames(
									location === item.href && 'underline underline-offset-4',
									`cursor-pointer text-sm font-semibold leading-6 text-blue-900`,
								)}
								onClick={async () => {
									if (location === '/' && currentWorkflow) {
										// save current workflow without blocking
										syncDataToSupabase(
											nodes,
											edges,
											currentWorkflow,
											workflows,
											setWorkflows,
											session,
											params,
											supabase,
										).catch((error) => {
											setUiErrorMessage(
												`Error saving work: ${error.message}`,
											);
										});
									} else if (location === '/chat/' && currentWorkflow) {
										setCurrentWorkflow(null);
										setNodes([]);
										setEdges([]);
									}
									window.open(item.href, '_self');
								}}
							>
								{item.name}
							</a>
						))}
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end gap-4 text-sm">
					<a
						className="flex cursor-pointer items-center gap-1 hover:font-semibold"
						href="https://github.com/eg9y/promptsandbox.io"
						target="_blank"
						rel="noreferrer"
					>
						GitHub{' '}
						<span>
							<ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
						</span>
					</a>
					<a
						href="#"
						className=" font-semibold leading-6 text-gray-900"
						onClick={() => {
							if (session) {
								supabase.auth.signOut();
								setSession(null);
								setWorkflows([]);
								setCurrentWorkflow(null);
								// clear graph;
								clearGraph();
								setUsername('');
							} else {
								window.open('/auth/', '_self');
							}
						}}
					>
						{session ? (
							<p>
								Log out <span aria-hidden="true">&larr;</span>
							</p>
						) : (
							<p>
								Log in <span aria-hidden="true">&rarr;</span>
							</p>
						)}
					</a>
				</div>
			</nav>
			<Dialog
				as="div"
				className="md:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-10" />
				<Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex flex-1">
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt=""
							/>
						</a>
						<div className="flex flex-1 justify-end">
							<a href="#" className="text-sm font-semibold leading-6 text-gray-900">
								Log in <span aria-hidden="true">&rarr;</span>
							</a>
						</div>
					</div>
					<div className="mt-6 space-y-2">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>
								{item.name}
							</a>
						))}
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default NavBar;
