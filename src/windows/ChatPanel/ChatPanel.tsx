import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Chat } from './Chat/Chat';
import { ChatInput } from './Chat/ChatInput';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import useResize from '../../utils/useResize';

const ChatPanel: React.FC = () => {
	const { setWaitingUserResponse, waitingUserResponse, pauseResolver, chatApp, setChatApp } =
		useStore(selector, shallow);

	const { length: chatPanelHeight, handleMouseDown, setLength } = useResize(0, false);

	const [currentUncollapsedHeight, setCurrentUncollapsedHeight] = useState(chatPanelHeight);

	useEffect(() => {
		setLength(chatApp.length * 60);
	}, [chatApp, setLength]);

	return (
		<div
			style={{ height: `${chatPanelHeight}px`, width: '30vw' }}
			className="absolute bottom-0 right-0 z-4 flex flex-col justify-end max-h-[95vh]"
		>
			<div
				className="flex items-center gap-2 cursor-pointer active:cursor-row-resize hover:bg-slate-300/90 bg-slate-300/70 pr-2 w-full rounded-t-md text-center border-1 border-r-0 border-slate-300"
				onMouseDown={(e) => {
					handleMouseDown(e);
				}}
			>
				<div
					className="h-5 w-6 cursor-pointer"
					onClick={() => {
						if (chatPanelHeight === 0) {
							setLength(currentUncollapsedHeight);
						} else {
							setCurrentUncollapsedHeight(chatPanelHeight);
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
					<p>Chat</p>
				</div>
			</div>
			<div className={`grow bg-slate-100/70 border-l-1 border-slate-300 px-2`}>
				<Chat messages={chatApp} loading={false} />
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
	);
};

export default ChatPanel;
