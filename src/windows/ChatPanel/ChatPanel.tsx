import { shallow } from 'zustand/shallow';

import { Chat } from './Chat/Chat';
import { ChatInput } from './Chat/ChatInput';
import useStore, { selector } from '../../store/useStore';
import useResize from '../../utils/useResize';

const ChatPanel: React.FC = () => {
	const { setWaitingUserResponse, pauseResolver, chatApp, setChatApp } = useStore(
		selector,
		shallow,
	);

	const { length: chatPanelHeight, handleMouseDown } = useResize(0, false);

	return (
		<div
			style={{ height: `${chatPanelHeight}px`, width: '30vw' }}
			className="absolute bottom-0 right-0 z-4 flex flex-col justify-end"
		>
			<div
				className=" cursor-pointer active:cursor-row-resize hover:bg-slate-300/90 bg-slate-300/70 px-2 w-full rounded-t-md text-center border-1 border-r-0 border-slate-300"
				onMouseDown={(e) => {
					handleMouseDown(e);
				}}
			>
				Chat
			</div>
			<div
				className={`grow bg-slate-100/70 overflow-y-scroll  border-l-1 border-slate-300 px-2 `}
			>
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
