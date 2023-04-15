import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Chat } from './Chat/Chat';
import { ChatInput } from './Chat/ChatInput';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import useResize from '../../utils/useResize';

const ChatPanel: React.FC = () => {
	const { setWaitingUserResponse, waitingUserResponse, pauseResolver, chatApp, setChatApp } =
		useStore(selector, shallow);

	const chatPanel = useRef<HTMLDivElement | null>(null);
	const chatMessages = useRef<HTMLDivElement | null>(null);
	const {
		length: chatPanelHeight,
		handleMouseDown,
		setLength,
	} = useResize(
		0,
		false,
		chatPanel.current?.getBoundingClientRect().height
			? chatPanel.current?.getBoundingClientRect().height + 50
			: 0,
	);

	const adjustChatPanelHeight = () => {
		if (chatMessages.current && chatPanel.current) {
			const messageHeight = chatMessages.current.getBoundingClientRect().height;
			const chatPanelHeight = chatPanel.current.getBoundingClientRect().height + 50;
			if (messageHeight && messageHeight > chatPanelHeight) {
				setLength(chatPanelHeight + messageHeight);
			}
		}
	};

	useEffect(() => {
		adjustChatPanelHeight();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatApp]);

	return (
		<div
			style={{ height: `${chatPanelHeight}px` }}
			className="absolute bottom-0 right-0 z-4 max-h-[95vh] w-[30vw] min-h-0 flex flex-col justify-end"
		>
			<div
				className="flex items-center gap-2 cursor-pointer active:cursor-row-resize hover:bg-slate-300/90 bg-slate-300/70 pr-2 w-full rounded-t-md text-center border-1 border-r-0 border-slate-300"
				onMouseDown={(e) => {
					handleMouseDown(e);
				}}
				ref={chatPanel}
			>
				<div
					className="h-5 w-6 cursor-pointer"
					onClick={() => {
						if (chatPanelHeight === 0) {
							adjustChatPanelHeight();
						} else {
							setLength(0);
						}
					}}
				>
					<ChevronDoubleUpIcon
						className={'text-slate-500 hover:text-slate-800 h-full mx-auto'}
						aria-hidden="true"
					/>
				</div>
				<div className="grow flex justify-center gap-1 items-center">
					<span className="relative flex h-3 w-3">
						<span
							className={conditionalClassNames(
								waitingUserResponse ? `animate-ping bg-green-500` : 'bg-slate-100',
								'absolute inline-flex h-full w-full rounded-full opacity-75',
							)}
						></span>
						<span
							className={conditionalClassNames(
								waitingUserResponse ? 'bg-green-500' : 'bg-slate-500',
								'relative inline-flex rounded-full h-3 w-3',
							)}
						></span>
					</span>
					{chatPanelHeight}
					<p>Chat</p>
				</div>
			</div>
			<div className={`grow bg-slate-100/70 border-l-1 border-slate-300 px-2`}>
				<Chat ref={chatMessages} messages={chatApp} loading={false} />
			</div>
			<div className="flex flex-col gap-1">
				{/* TODO: Clear graph logic */}
				<div className="w-full">
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
		// </div>
	);
};

export default ChatPanel;
