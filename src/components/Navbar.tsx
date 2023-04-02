import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { nanoid } from 'nanoid';
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
		{ name: 'Sandbox', href: '/' },
		{ name: 'Files', href: '/files/' },
		{ name: 'Gallery', href: '/gallery/' },
	];
	const [location] = useLocation();
	const params = useQueryParams();

	const {
		currentWorkflow,
		setCurrentWorkflow,
		clearGraph,
		nodes,
		edges,
		workflows,
		setWorkflows,
		setUiErrorMessage,
	} = useStore(selector, shallow);
	const { session, setSession } = useStoreSecret(selectorSecret, shallow);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const supabase = useSupabase();

	return (
		<header
			style={{
				height: '5vh',
			}}
			className="bg-slate-100 border-b-1 border-slate-400 z-20"
		>
			<nav
				className="mx-auto flex items-center justify-between p-2 lg:px-2 h-full"
				aria-label="Global"
			>
				<div className="-m-1.5 p-1.5 flex-1 flex gap-10 items-center">
					<div className="text-xl font-bold">PromptSandbox.io</div>
					<div className="flex">
						<div className="hidden lg:flex lg:gap-x-4">
							{navigation.map((item) => (
								<a
									key={item.name}
									className={conditionalClassNames(
										location === item.href && 'underline underline-offset-4',
										`text-sm font-semibold leading-6 text-blue-900 cursor-pointer`,
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
										}
										window.open(item.href, '_self');
									}}
								>
									{item.name}
								</a>
							))}
						</div>
						<div className="flex lg:hidden">
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
				</div>
				<div>
					{location === '/' && (
						<div className="text-slate-800 flex gap-2 items-center">
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
					)}
				</div>

				<div className="flex flex-1 justify-end">
					<a
						href="#"
						className="text-sm font-semibold leading-6 text-gray-900"
						onClick={() => {
							if (session) {
								supabase.auth.signOut();
								setSession(null);
								setWorkflows([]);
								// clear graph;
								clearGraph();
								// set new workflowId;
								setCurrentWorkflow({
									id: nanoid(),
									name: `Untitled Sandbox`,
									user_id: session.user.id,
								});
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
				className="lg:hidden"
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
