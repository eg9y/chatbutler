import { Menu, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';

export default function Overview() {
	const { workflows, setWorkflows, setCurrentWorkflow } = useStore(selector, shallow);
	const { session } = useStoreSecret(selectorSecret, shallow);

	return (
		<main className="lg:mx-auto lg:max-w-[50vw]">
			<header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
				<h1 className="text-base font-semibold leading-7 text-slate-600">Your Chatbots</h1>

				{/* Sort dropdown */}
				<div className="flex items-center gap-2">
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
						className="group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4 hover:bg-slate-100 sm:px-6 lg:px-8"
					>
						<div className="min-w-0 grow">
							<div className="flex items-center gap-x-3">
								<div
									className={conditionalClassNames('flex-none rounded-full p-1')}
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
					<Menu.Button className="flex items-center rounded-full bg-slate-100 p-2 text-slate-500 	hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 group-hover:bg-slate-200 group-hover:text-slate-900">
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
										Edit
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
										Rename
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
										Publish
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<a
										href="#"
										className={conditionalClassNames(
											active ? 'bg-slate-100 text-red-900' : 'text-red-600',
											'block px-4 py-2 text-sm',
										)}
									>
										Remove
									</a>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
