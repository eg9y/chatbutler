import { Transition } from '@headlessui/react';
import { forwardRef, useEffect, useRef } from 'react';

import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { Message } from './types';

interface Props {
	messages: Message[];
	loading: boolean;
}

export const Chat = forwardRef<HTMLDivElement, Props>(function Chat({ messages, loading }, ref) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="relative h-full overflow-y-scroll" ref={scrollRef}>
			<div className="absolute w-full">
				<div ref={ref} className="flex h-full w-full grow flex-col justify-end gap-1 py-2">
					{messages.map((message, index) => (
						<Transition
							key={index}
							show={true}
							appear={true}
							enter="transform transition duration-[400ms] ease-in-out"
							enterFrom="translate-y-4 opacity-0"
							enterTo="translate-y-0 opacity-100"
							leave="transform transition duration-[400ms] ease-in-out"
							leaveFrom="translate-y-4 opacity-100"
							leaveTo="translate-y-0 opacity-0"
						>
							<ChatMessage message={message} />
						</Transition>
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
});
