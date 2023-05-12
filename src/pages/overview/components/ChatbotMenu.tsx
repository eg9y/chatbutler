import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Session } from '@supabase/supabase-js';
import { Fragment, useState } from 'react';

import ChatbotMenuPanel from './ChatbotMenuPanel';
import { SimpleWorkflow } from '../../../db/dbTypes';
import { RFState } from '../../../store/useStore';
import { conditionalClassNames } from '../../../utils/classNames';

function ChatbotMenu({
	chatbot,
	session,
	workflows,
	setWorkflows,
	setUiErrorMessage,
}: {
	chatbot: SimpleWorkflow;
	session: Session;
	workflows: RFState['workflows'];
	setWorkflows: RFState['setWorkflows'];
	setUiErrorMessage: RFState['setUiErrorMessage'];
}) {
	const [showPanel, setShowPanel] = useState(false);
	const [propertyName, setPropertyName] = useState<keyof SimpleWorkflow>('name');

	return (
		<div
			onClick={(e) => {
				// Prevent the event from bubbling up to the parent
				e.stopPropagation();
				e.preventDefault();
			}}
			// className="cursor-pointer rounded-full p-2 hover:bg-slate-300 "
		>
			<ChatbotMenuPanel
				showPanel={showPanel}
				setShowPanel={setShowPanel}
				chatbot={chatbot}
				setUiErrorMessage={setUiErrorMessage}
				workflows={workflows}
				setWorkflows={setWorkflows}
				propertyName={propertyName}
			/>
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
										onClick={() => {
											window.open(
												`/app/?user_id=${session?.user.id}&id=${chatbot.id}`,
												'_self',
											);
										}}
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
										onClick={() => {
											setPropertyName('name');
											setShowPanel(true);
										}}
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
											active ? 'bg-slate-100 text-red-700' : 'text-red-600',
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

export default ChatbotMenu;
