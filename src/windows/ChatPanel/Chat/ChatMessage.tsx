import { FC } from 'react';

import DocsLoaderMessage from './MessageTypes/DocsLoaderMessage';
import { Message } from './types';
import { NodeTypesEnum } from '../../../nodes/types/NodeTypes';

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
			{message.assistantMessageType === NodeTypesEnum.docsLoader && <DocsLoaderMessage />}
			{(!message.assistantMessageType ||
				message.assistantMessageType === NodeTypesEnum.outputText) && (
				<div
					className={`flex items-center ${
						message.role === 'assistant'
							? 'bg-neutral-200 text-neutral-900'
							: 'bg-blue-500 text-white '
					} max-w-[95%] whitespace-pre-wrap rounded-2xl px-3 py-2`}
					style={{ overflowWrap: 'anywhere' }}
				>
					{message.content}
				</div>
			)}
		</div>
	);
};
