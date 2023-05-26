import { NodeTypesEnum } from '@chatbutler/shared';
import { FC } from 'react';

import SearchMessage from './MessageTypes/SearchMessage';
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
			{message.assistantMessageType === NodeTypesEnum.search && <SearchMessage />}
			{message.assistantMessageType === NodeTypesEnum.search && (
				<div className="flex-start flex flex-col">
					<p>{message.content}</p>
					<div
						className={`flex w-fit items-center rounded-2xl bg-neutral-200 px-4 py-2 text-neutral-900`}
						style={{ overflowWrap: 'anywhere' }}
					>
						<div className="flex animate-pulse items-center justify-center gap-1">
							<div className="h-3 w-3 animate-[bounce_1s_ease-in-out_1s_infinite] rounded-full bg-slate-400"></div>
							<div className="h-3 w-3 animate-[bounce_1s_ease-in-out_1.25s_infinite] rounded-full bg-slate-400"></div>
							<div className="h-3 w-3 animate-[bounce_1s_ease-in-out_1.5s_infinite] rounded-full bg-slate-400"></div>
						</div>
					</div>
				</div>
			)}
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
