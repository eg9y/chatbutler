import { FC } from 'react';

export const ChatLoader: FC = () => {
	return (
		<div className="flex flex-col flex-start">
			<div
				className={`flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-4 py-2 w-fit`}
				style={{ overflowWrap: 'anywhere' }}
			>
				<div className="flex items-center justify-center gap-1 animate-pulse">
					<div className="w-3 h-3 bg-slate-400 rounded-full animate-[bounce_1s_ease-in-out_1s_infinite]"></div>
					<div className="w-3 h-3 bg-slate-400 rounded-full animate-[bounce_1s_ease-in-out_1.25s_infinite]"></div>
					<div className="w-3 h-3 bg-slate-400 rounded-full animate-[bounce_1s_ease-in-out_1.5s_infinite]"></div>
				</div>
			</div>
		</div>
	);
};
