import { FC } from 'react';

export const ChatLoader: FC = () => {
	return (
		<div className="flex-start flex flex-col">
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
	);
};
