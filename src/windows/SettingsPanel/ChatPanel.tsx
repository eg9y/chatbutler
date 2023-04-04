import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Chat } from './Chat/Chat';
import { ChatInput } from './Chat/ChatInput';
import { CustomNode } from '../../nodes/types/NodeTypes';
import useStore, { selector } from '../../store/useStore';

export default function NodesPanel({ selectedNode }: { selectedNode: CustomNode | null }) {
	const [showPromptInOutput, setShowPromptInOutput] = useState(false);
	const {
		waitingUserResponse,
		setWaitingUserResponse,
		pauseResolver,
		setPauseResolver,
		chatApp,
		setChatApp,
	} = useStore(selector, shallow);

	return (
		<div className="py-3 flex flex-col justify-between w-full h-full">
			{/* TODO: Clear graph logic */}
			<div className="grow relative overflow-scroll">
				<div className="absolute w-full">
					<Chat messages={chatApp} loading={false} />
				</div>
			</div>
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
	);
}
