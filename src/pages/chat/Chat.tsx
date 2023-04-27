import { useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import SideNav from './layout/SideNav';
import { SimpleWorkflow } from '../../db/dbTypes';
import useStore, { selector } from '../../store/useStore';
import { Chat } from '../../windows/ChatPanel/Chat/Chat';
import { ChatInput } from '../../windows/ChatPanel/Chat/ChatInput';

export default function ChatMain() {
	const { setWaitingUserResponse, pauseResolver, chatApp, setChatApp } = useStore(
		selector,
		shallow,
	);

	const [selectedChatbot, setSelectedChatbot] = useState<SimpleWorkflow>();
	const [loading, setLoading] = useState<boolean>(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// const handleReset = () => {};

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages]);

	return (
		<div className="h-[95vh]">
			<SideNav>
				<div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10 h-full">
					<div className="mx-auto mt-4 sm:mt-12 h-[75vh]">
						<Chat messages={chatApp} loading={false} />
						<div className="flex flex-col gap-1">
							{/* TODO: Clear graph logic */}
							<div className="w-full h-40 sticky">
								<ChatInput
									onSend={(userMessage) => {
										setChatApp([...chatApp, userMessage]);
										setWaitingUserResponse(false);
										pauseResolver(userMessage.content);
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</SideNav>
		</div>
	);
}
