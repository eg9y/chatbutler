import { ArrowsPointingOutIcon, ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Chat } from './Chat/Chat';
import { ChatInput } from './Chat/ChatInput';
import FullScreenEditor from '../../components/FullScreenEditor';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import useResize from '../../utils/useResize';

const ChatPanel: React.FC = () => {
	const { setWaitingUserResponse, waitingUserResponse, pauseResolver, chatApp, setChatApp } =
		useStore(selector, shallow);

	const [showFullScreen, setShowFullScreen] = useState(false);
	const [emptyChatHeight, setEmptyChatHeight] = useState<null | number>(null);
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
			const messagesHeight = chatMessages.current.getBoundingClientRect().height;
			const chatHandleHeight = chatPanel.current.getBoundingClientRect().height + 50;

			if (emptyChatHeight === null) {
				setEmptyChatHeight(chatHandleHeight);
			}

			// if messages height plus the chat handle height is more than the (user drag adjusted) height, then set it so that all messages are seen
			if (
				emptyChatHeight &&
				messagesHeight &&
				messagesHeight + emptyChatHeight >= chatHandleHeight
			) {
				setLength(chatHandleHeight + messagesHeight);
			}
		}
	};

	useEffect(() => {
		adjustChatPanelHeight();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatApp]);

	return (
		<>
			<div
				style={{ height: `${chatPanelHeight}px` }}
				className="z-4 absolute bottom-0 right-0 flex max-h-[95vh] min-h-0 w-[30vw] flex-col justify-end"
			>
				<div
					className="flex w-full cursor-row-resize items-center gap-2 rounded-t-md border-1 border-r-0 border-slate-300 bg-slate-300/70 pr-2 text-center hover:bg-slate-300/90 active:cursor-row-resize"
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
							className={'mx-auto h-full text-slate-500 hover:text-slate-800'}
							aria-hidden="true"
						/>
					</div>
					<ArrowsPointingOutIcon
						className={
							'h-5 w-5  flex-shrink-0 cursor-pointer text-slate-500 hover:text-slate-800'
						}
						aria-hidden="true"
						onClick={() => {
							setShowFullScreen(!showFullScreen);
						}}
					/>
					<div className="flex grow items-center justify-center gap-1">
						<span className="relative flex h-3 w-3">
							<span
								className={conditionalClassNames(
									waitingUserResponse
										? `animate-ping bg-green-500`
										: 'bg-slate-100',
									'absolute inline-flex h-full w-full rounded-full opacity-75',
								)}
							></span>
							<span
								className={conditionalClassNames(
									waitingUserResponse ? 'bg-green-500' : 'bg-slate-500',
									'relative inline-flex h-3 w-3 rounded-full',
								)}
							></span>
						</span>
						<p>Chat</p>
					</div>
				</div>
				<div className={`grow border-l-1 border-slate-300 bg-slate-100/70 px-2`}>
					<Chat ref={chatMessages} messages={chatApp} loading={false} />
				</div>
				<div className="flex flex-col gap-1">
					{/* TODO: Clear graph logic */}
					<div className="min-h-[44px] w-full">
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
			<FullScreenEditor
				heading={'Chat'}
				showFullScreen={showFullScreen}
				setShowFullScreen={setShowFullScreen}
			>
				<div className={`grow border-l-1 border-slate-300 bg-slate-100/70 px-2`}>
					<Chat messages={chatApp} loading={false} />
				</div>
				<div className="flex flex-col gap-1">
					{/* TODO: Clear graph logic */}
					<div className="min-h-[100px] w-full">
						<ChatInput
							onSend={(userMessage) => {
								setChatApp([...chatApp, userMessage]);
								setWaitingUserResponse(false);
								pauseResolver(userMessage.content);
							}}
						/>
					</div>
				</div>
			</FullScreenEditor>
		</>
	);
};

export default ChatPanel;
