import { Dialog } from '@headlessui/react';
import { Bars3Icon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { shallow } from 'zustand/shallow';

import EditableText from './EditableText';
import iconImage from '../assets/icon.png';
import useSupabase from '../auth/supabaseClient';
import syncDataToSupabase from '../db/syncToSupabase';
import { useStore, useStoreSecret, selector, selectorSecret } from '../store';
import { conditionalClassNames } from '../utils/classNames';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';
import { useQueryParams } from '../utils/useQueryParams';

const NavBar = () => {
	const navigation = [
		{ name: 'Overview', href: '/' },
		{ name: 'Editor', href: '/app/' },
		// { name: 'Chat', href: '/chat/' },
		// { name: 'Gallery', href: '/gallery/' },
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
		setNotificationMessage,
		setUsername,
	} = useStore(selector, shallow);
	const { session, setSession, userCredits } = useStoreSecret(selectorSecret, shallow);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const supabase = useSupabase();

	return (
		<header
			style={{
				height: '5vh',
			}}
			className="z-20 border-b-1 border-slate-400/20 bg-slate-200/40"
		>
			<nav
				className="mx-auto flex h-full items-center justify-between p-1 lg:px-2"
				aria-label="Global"
			>
				<div className="flex h-full flex-1 items-center gap-2">
					{location === '/app/' && (
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
					{location != '/app/' && (
						<div className="flex h-full items-center gap-1 font-medium text-slate-800">
							<img src={iconImage} className="h-14 w-14" />
							<p className="text-xl">Chatbutler.ai</p>
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
									location === item.href
										? 'underline underline-offset-4'
										: 'font-normal',
									`text-md cursor-pointer leading-6 text-slate-900`,
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
											setNotificationMessage(
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

				<div className="flex flex-1 items-center justify-end gap-4">
					{session && userCredits.credits > 0 && (
						<a
							className="flex cursor-pointer items-center gap-1 hover:font-semibold"
							rel="noreferrer"
						>
							credits: {userCredits.credits}
						</a>
					)}
					<a
						className="flex cursor-pointer items-center gap-1 hover:font-semibold"
						onClick={() => {
							// if authenticated, go to /settings/. else, go to /auth/
							if (session) {
								window.open('/settings/', '_self');
							} else {
								window.open('/auth/', '_self');
							}
						}}
						rel="noreferrer"
					>
						Settings
					</a>
					<a
						href="#"
						className=" leading-6 text-gray-900"
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
								className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
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
