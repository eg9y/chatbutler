import { FC } from 'react';

import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { Message } from './types';

interface Props {
	messages: Message[];
	loading: boolean;
}

export const Chat: FC<Props> = ({ messages, loading }) => {
	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col px-2 pb-2 grow justify-between">
				<div>
					{messages.map((message, index) => (
						<div key={index} className="my-1 sm:my-1.5">
							<ChatMessage message={message} />
						</div>
					))}

					{loading && (
						<div className="my-1 sm:my-1.5">
							<ChatLoader />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
