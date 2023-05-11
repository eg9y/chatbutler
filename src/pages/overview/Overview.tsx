import { Dialog, Menu, Transition } from '@headlessui/react';
import {
	Bars3Icon,
	ChevronRightIcon,
	ChevronUpDownIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import {
	ChartBarSquareIcon,
	Cog6ToothIcon,
	EllipsisVerticalIcon,
	FolderIcon,
	GlobeAltIcon,
	ServerIcon,
	SignalIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';

const navigation = [
	{ name: 'Projects', href: '#', icon: FolderIcon, current: false },
	{ name: 'Deployments', href: '#', icon: ServerIcon, current: true },
	{ name: 'Activity', href: '#', icon: SignalIcon, current: false },
	{ name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
	{ name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
	{ name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
];
const teams = [
	{ id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
	{ id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
	{ id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
];
const statuses = {
	offline: 'text-slate-500 bg-slate-100/10',
	online: 'text-green-400 bg-green-400/10',
	error: 'text-rose-400 bg-rose-400/10',
};
const environments = {
	Preview: 'text-slate-400 bg-slate-400/10 ring-slate-400/20',
	Production: 'text-slate-400 bg-slate-400/10 ring-slate-400/30',
};
const deployments = [
	{
		id: 1,
		href: '#',
		projectName: 'ios-app',
		teamName: 'Planetaria',
		status: 'offline',
		statusText: 'Initiated 1m 32s ago',
		description: 'Deploys from GitHub',
		environment: 'Published',
	},
	// More deployments...
];
const activityItems = [
	{
		user: {
			name: 'Michael Foster',
			imageUrl:
				'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		projectName: 'ios-app',
		commit: '2d89f0c8',
		branch: 'main',
		date: '1h',
		dateTime: '2023-01-23T11:00',
	},
	// More items...
];

export default function Overview() {
	const { setUiErrorMessage, setGlobalVariables, workflows, setNodes, setEdges, nodes, edges } =
		useStore(selector, shallow);
	const { session, setSession } = useStoreSecret(selectorSecret, shallow);

	return (
		<>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-slate-900">
        <body class="h-full">
        ```
      */}
			<div>
				<div className="">
					<main className="lg:mx-auto lg:max-w-[50vw]">
						<header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
							<h1 className="text-base font-semibold leading-7 text-slate-600">
								Your Chatbots
							</h1>

							{/* Sort dropdown */}
							<div className="flex gap-2">
								<Menu as="div" className="relative">
									<Menu.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-slate-600">
										Sort by
										<ChevronUpDownIcon
											className="h-5 w-5 text-slate-500"
											aria-hidden="true"
										/>
									</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={conditionalClassNames(
															active ? 'bg-slate-50' : '',
															'block px-3 py-1 text-sm leading-6 text-slate-900',
														)}
													>
														Name
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={conditionalClassNames(
															active ? 'bg-slate-50' : '',
															'block px-3 py-1 text-sm leading-6 text-slate-900',
														)}
													>
														Date updated
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={conditionalClassNames(
															active ? 'bg-slate-50' : '',
															'block px-3 py-1 text-sm leading-6 text-slate-900',
														)}
													>
														Environment
													</a>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
								<button
									type="button"
									className="rounded-md bg-slate-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
								>
									New Chatbot
								</button>
							</div>
						</header>

						{/* Deployment list */}
						<ul role="list" className="divide-y divide-white/5">
							{workflows.map((chatbot) => (
								<li
									key={chatbot.id}
									onClick={(e) => {
										window.open(
											`/app/?user_id=${session?.user.id}&id=${chatbot.id}`,
											'_blank',
										);
									}}
									className="group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4 hover:bg-slate-200 sm:px-6 lg:px-8"
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
												<span className="truncate">{chatbot.name}</span>
											</h2>
										</div>
										<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-slate-400">
											<p className="truncate">{chatbot.description}</p>
											<svg
												viewBox="0 0 2 2"
												className="h-0.5 w-0.5 flex-none fill-slate-300"
											>
												<circle cx={1} cy={1} r={1} />
											</svg>
										</div>
									</div>
									<div
										className={conditionalClassNames(
											'flex-none rounded-full py-1 px-2 text-xs font-medium ring-1 ring-inset',
										)}
									>
										Draft
										{/* {chatbot.environment} */}
									</div>
									<ChatbotMenu />
								</li>
							))}
						</ul>
					</main>
				</div>
			</div>
		</>
	);
}

function ChatbotMenu() {
	return (
		<div
			onClick={(e) => {
				// Prevent the event from bubbling up to the parent
				console.log('foo');
				e.stopPropagation();
				e.preventDefault();
			}}
			// className="cursor-pointer rounded-full p-2 hover:bg-slate-300 "
		>
			<Menu
				as="div"
				className="text-le ft relative
		inline-block"
			>
				<div>
					<Menu.Button className="flex items-center rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-600 hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 group-hover:bg-slate-300">
						<span className="sr-only">Open options</span>
						<EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<a
										href="#"
										className={conditionalClassNames(
											active
												? 'bg-slate-100 text-slate-900'
												: 'text-slate-700',
											'block px-4 py-2 text-sm',
										)}
									>
										Account settings
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<a
										href="#"
										className={conditionalClassNames(
											active
												? 'bg-slate-100 text-slate-900'
												: 'text-slate-700',
											'block px-4 py-2 text-sm',
										)}
									>
										Support
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<a
										href="#"
										className={conditionalClassNames(
											active
												? 'bg-slate-100 text-slate-900'
												: 'text-slate-700',
											'block px-4 py-2 text-sm',
										)}
									>
										License
									</a>
								)}
							</Menu.Item>
							<form method="POST" action="#">
								<Menu.Item>
									{({ active }) => (
										<button
											type="submit"
											className={conditionalClassNames(
												active
													? 'bg-slate-100 text-slate-900'
													: 'text-slate-700',
												'block w-full px-4 py-2 text-left text-sm',
											)}
										>
											Sign out
										</button>
									)}
								</Menu.Item>
							</form>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
