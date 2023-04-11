import { FC } from 'react';

import { Message } from './types';

interface Props {
	message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
	return (
		<div
			className={`flex flex-col text-xs ${
				message.role === 'assistant' ? 'items-start' : 'items-end'
			}`}
		>
			<div
				className={`flex items-center ${
					message.role === 'assistant'
						? 'bg-neutral-200 text-neutral-900'
						: 'bg-blue-500 text-white '
				} rounded-2xl px-3 py-2 max-w-[95%] whitespace-pre-wrap`}
				style={{ overflowWrap: 'anywhere' }}
			>
				{message.content}
			</div>
		</div>
	);
};
