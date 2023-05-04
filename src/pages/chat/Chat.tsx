import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import ChatbotList from './ChatbotList';
import SideNav from './layout/SideNav';
import { ReactComponent as Loading } from '../../assets/loading.svg';
import useSupabase from '../../auth/supabaseClient';
import Notification from '../../components/Notification';
import RunFromStart from '../../components/RunFromStart';
import { WorkflowDbSchema } from '../../db/dbTypes';
import { useStore, useStoreSecret, selector, selectorSecret } from '../../store';
import { conditionalClassNames } from '../../utils/classNames';
import { Chat } from '../../windows/ChatPanel/Chat/Chat';
import { ChatInput } from '../../windows/ChatPanel/Chat/ChatInput';

export default function ChatMain() {
	const {
		setWaitingUserResponse,
		pauseResolver,
		chatApp,
		setChatApp,
		chatSessions,
		setChatSessions,
		nodes,
		setUiErrorMessage,
		setCurrentChatSessionIndex,
		currentChatSessionIndex,
	} = useStore(selector, shallow);
	const { setSession, setOpenAiKey } = useStoreSecret(selectorSecret, shallow);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	// const messagesEndRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const supabase = useSupabase();

	// const scrollToBottom = () => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// };

	// const handleReset = () => {};

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages]);

	useEffect(() => {
		async function init() {
			const sessionResponse = await supabase.auth.getSession();
			const currentSession = sessionResponse.data.session;
			setSession(currentSession);

			if (currentSession?.user) {
				const { data, error } = await supabase.functions.invoke('get-api-key');
				if (error) {
					setUiErrorMessage(error.message);
				}
				if (data) {
					setOpenAiKey(data);
				}
			}
		}

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [chatbots, setChatbots] = useState<
		(WorkflowDbSchema & {
			profiles:
				| {
						first_name: string | null;
				  }
				| {
						first_name: string | null;
				  }[]
				| null;
		})[]
	>([]);

	useEffect(() => {
		async function getChatbots() {
			// init supabase
			setIsLoading(true);
			const { data: chatbotsData, error } = await supabase
				.from('workflows')
				.select(
					`
			        id,
			        name,
			        user_id,
			        description,
					nodes,
					edges,
			        profiles (
			            first_name
			        )
			    `,
				)
				.eq('is_public', true);

			if (error) {
				console.log(error);
				return;
			}
			setChatbots(chatbotsData as any);
			setIsLoading(false);
		}

		getChatbots();
	}, [supabase]);

	return (
		<>
			<div className="z-5 absolute top-[6vh] right-5">
				<Notification />
			</div>
			<SideNav
				abortControllerRef={abortControllerRef}
				currentChatSessionIndex={currentChatSessionIndex}
				setCurrentChatSessionIndex={setCurrentChatSessionIndex}
				chatSessions={chatSessions}
				setChatSessions={setChatSessions}
			>
				<div className="h-full flex-1 sm:px-10">
					{chatSessions.length > 0 &&
						chatSessions[currentChatSessionIndex]?.workflow !== null && (
							<div className="flex flex-col gap-1 p-2">
								<h1 className="text-2xl">
									{chatSessions[currentChatSessionIndex]?.workflow?.name}
								</h1>
								<h2 className="text-lg">
									{chatSessions[currentChatSessionIndex]?.workflow?.description}
								</h2>
								<div className="w-50">
									<RunFromStart
										isLoading={isLoading}
										setIsLoading={setIsLoading}
										nodes={nodes}
										abortControllerRef={abortControllerRef}
									/>
								</div>
							</div>
						)}
					{chatSessions[currentChatSessionIndex]?.workflow && (
						<>
							<div className="h-[60vh]">
								<Chat messages={chatApp} loading={false} />
							</div>
							<div className="flex flex-col gap-1">
								{/* TODO: Clear graph logic */}
								<div
									className={conditionalClassNames(
										currentChatSessionIndex === -1 &&
											'pointer-events-none border-2 border-slate-300 opacity-60',
										'sticky h-40 w-full',
									)}
								>
									<ChatInput
										onSend={(userMessage) => {
											const allMessages = [...chatApp, userMessage];
											setChatApp(allMessages);
											const newChatSessions = [...chatSessions];
											newChatSessions[currentChatSessionIndex].messages = [
												...allMessages,
											];
											setWaitingUserResponse(false);
											setChatSessions(newChatSessions);
											pauseResolver(userMessage.content);
										}}
									/>
								</div>
							</div>
						</>
					)}
					{!chatSessions[currentChatSessionIndex]?.workflow && (
						<div>
							<div>
								{/* iterate over chatbots */}
								{isLoading && (
									<div className="flex items-center gap-4 p-4">
										<p>Loading chatbots</p>
										<Loading className="-ml-1 mr-3 h-5 w-5 animate-spin text-black" />
									</div>
								)}
								{chatSessions.length > 0 && (
									<ChatbotList
										chatbots={chatbots}
										onClick={(
											chatbot: WorkflowDbSchema & {
												profiles:
													| {
															first_name: string | null;
													  }
													| {
															first_name: string | null;
													  }[]
													| null;
											},
										) => {
											const newChatSessions = [...chatSessions];
											newChatSessions[currentChatSessionIndex].workflow = {
												id: chatbot.id,
												name: chatbot.name,
												description: chatbot.description,
												nodes: chatbot.nodes,
												edges: chatbot.edges,
												is_public: true,
												user_id: chatbot.user_id,
												created_at: '',
											};
											setChatSessions(newChatSessions);
										}}
									/>
								)}
							</div>
						</div>
					)}
				</div>
			</SideNav>
		</>
	);
}
