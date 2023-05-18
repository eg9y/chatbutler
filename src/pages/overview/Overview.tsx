import { Session } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import Breadcrumbs from './components/Breadcrumbs';
import ChatbotDetails from './components/ChatbotDetails';
import ChatbotMenu from './components/ChatbotMenu';
import ChatbotMenuPanel from './components/ChatbotMenuPanel';
import useSupabase from '../../auth/supabaseClient';
import Notification from '../../components/Notification';
import { SimpleWorkflow } from '../../db/dbTypes';
import populateUserWorkflows from '../../db/populateUserWorkflows';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';
import UsernamePrompt from '../app/UsernamePrompt';

export default function Overview() {
	const { workflows, setUiErrorMessage, setUsername, setWorkflows, setCurrentWorkflow } =
		useStore(selector, shallow);
	const { session, setSession, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);

	const supabase = useSupabase();

	const [isLoading, setIsLoading] = useState(false);
	const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

	const [showPanel, setShowPanel] = useState(false);
	const [propertyName, setPropertyName] = useState<keyof SimpleWorkflow>('name');

	const [chatbot, setChatbot] = useState<SimpleWorkflow>();

	const [currentPage, setCurrentPage] = useState('home');

	useEffect(() => {
		// get user profile from profile tablee where user id = current user id
		// if first_name is null and profile exists, ask user for firstname
		const getProfile = async (session: Session) => {
			const { data: profile, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', session?.user?.id)
				.single();
			if (error) {
				setUiErrorMessage(error.message);
			}
			if (profile) {
				if (!profile.first_name) {
					setShowUsernamePrompt(true);
				} else {
					setUsername(profile.first_name);
				}
			}
		};

		if (session) {
			getProfile(session);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const sessionResponse = await supabase.auth.getSession();
			const currentSession = sessionResponse.data.session;
			setSession(currentSession);
			if (workflows.length > 0) {
				setIsLoading(false);
				return;
			}

			// // TODO: don't need to null workflow.
			// setCurrentWorkflow(null);

			await populateUserWorkflows(setWorkflows, setUiErrorMessage, currentSession, supabase);
			setIsLoading(false);
			// await populateUserDocuments(setDocuments, setUiErrorMessage, currentSession, supabase);
			if (currentSession?.user) {
				const { data, error } = await supabase.functions.invoke('get-api-key');
				if (error) {
					setUiErrorMessage(error.message);
				}
				if (data) {
					setOpenAiKey(data);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className="lg:mx-auto lg:max-w-[50vw]">
			<div className="z-5 absolute top-[6vh] right-5">
				<Notification />
			</div>
			<UsernamePrompt
				open={showUsernamePrompt}
				setShowUsernamePrompt={setShowUsernamePrompt}
				supabase={supabase}
				session={session}
				setUsername={setUsername}
			/>
			<ChatbotMenuPanel
				showPanel={showPanel}
				setShowPanel={setShowPanel}
				chatbot={chatbot}
				setUiErrorMessage={setUiErrorMessage}
				workflows={workflows}
				setWorkflows={setWorkflows}
				propertyName={propertyName}
			/>
			<header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
				<Breadcrumbs
					chatbot={chatbot}
					setChatbot={setChatbot}
					setCurrentPage={setCurrentPage}
				/>

				{/* Sort dropdown */}
				<div className="flex items-center gap-2">
					{/* <Menu as="div" className="relative">
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
					</Menu> */}
					<button
						type="button"
						onClick={async () => {
							const id = nanoid();
							const { data, error } = await supabase
								.from('workflows')
								.insert({
									name: `New ${id}`,
									id,
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									user_id: session!.user.id,
								})
								.select()
								.single();
							if (data) {
								const newChatbot = {
									id: data.id,
									name: data.name,
									description: '',
									is_public: true,
									user_id: data.user_id,
									updated_at: data.updated_at,
								};
								setWorkflows([newChatbot, ...workflows]);
								setCurrentPage('chatbot');
								setChatbot(newChatbot);
								setShowPanel(true);
							} else if (error) {
								setUiErrorMessage(error.message);
							}
						}}
						className="rounded-md bg-slate-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
					>
						New Chatbot
					</button>
				</div>
			</header>
			{isLoading && <div className=" px-4 sm:px-6 lg:px-8">Loading chatbots...</div>}

			{currentPage === 'chatbot' && chatbot && (
				<div className="py-4sm:px-6 group relative flex flex-col justify-center space-x-4 px-4 leading-7 lg:px-8">
					<ChatbotDetails session={session} chatbot={chatbot} />
				</div>
			)}

			{currentPage === 'home' && (
				<ul role="list" className="divide-y divide-white/5">
					{workflows.map((currentChatbot) => (
						<li
							key={currentChatbot.id}
							onClick={() => {
								// window.open(
								// 	`/app/?user_id=${session?.user.id}&id=${currentChatbot.id}`,
								// 	'_self',
								// );
								setChatbot(currentChatbot);
								setCurrentPage('chatbot');
							}}
							className="group relative flex flex-grow cursor-pointer items-center space-x-4 px-4 py-4 hover:bg-slate-100 sm:px-6 lg:px-8"
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
										<span className="truncate">{currentChatbot.name}</span>
									</h2>
								</div>
								<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-slate-400">
									<p className="truncate">{currentChatbot.description}</p>
									<svg
										viewBox="0 0 2 2"
										className="h-0.5 w-0.5 flex-none fill-slate-300"
									>
										<circle cx={1} cy={1} r={1} />
									</svg>
								</div>
							</div>

							<div className="flex flex-none items-center gap-x-4">
								<div
									className={conditionalClassNames(
										'flex-none rounded-full py-1 px-2 text-xs font-medium ring-1 ring-inset',
									)}
								>
									Draft
									{/* {chatbot.environment} */}
								</div>
								{/* <a
							href={'#'}
							className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
						>
							Publish
						</a> */}
								<ChatbotMenu
									chatbot={currentChatbot}
									setChatbot={setChatbot}
									session={session as Session}
									workflows={workflows}
									setWorkflows={setWorkflows}
									setShowPanel={setShowPanel}
									setPropertyName={setPropertyName}
								/>
							</div>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
