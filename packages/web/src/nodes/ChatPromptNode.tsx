import { ChatPromptNodeDataType } from '@chatbutler/shared';
import { SignalIcon, ClipboardIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import NodeTemplate from './templates/NodeTemplate';
import { conditionalClassNames } from '../utils/classNames';

const ChatPrompt: FC<NodeProps<ChatPromptNodeDataType>> = (props) => {
	const { data, selected } = props;

	const [showFullScreen, setShowFullScreen] = useState(false);

	return (
		<div
			className={conditionalClassNames(
				data.isDetailMode && 'h-[40rem] w-[35rem]',
				`m-3 shadow-lg`,
			)}
		>
			<NodeTemplate
				{...props}
				title="Chat"
				fieldName="Chat Prompt"
				color="purple"
				showFullScreen={showFullScreen}
				setShowFullScreen={setShowFullScreen}
				selected={selected}
				labelComponent={() => (
					<div className="flex h-14 items-center justify-between px-4">
						<p className="flex items-center gap-1 text-xl">
							<SignalIcon
								className={conditionalClassNames(
									data.response.length > 0 ? 'text-green-500' : 'text-slate-400',
									' -ml-1 mr-1 h-7 w-7 flex-shrink-0',
								)}
								aria-hidden="true"
							/>
							<span
								className={conditionalClassNames(
									data.response.length === 0 && 'text-slate-400',
								)}
							>
								Current results:
							</span>
						</p>
					</div>
				)}
			>
				{() => <Content data={data} showFullScreen={showFullScreen} />}
			</NodeTemplate>
			<Handle
				type="target"
				position={Position.Left}
				id="chat-prompt-messages"
				style={{
					left: '-4.5rem',
					backgroundColor: 'rgb(248 250 252)',
				}}
				className="top-1/2 flex h-10 gap-1 border-1 border-slate-700"
			>
				<div className=" pointer-events-none h-full w-5 bg-purple-300"></div>
				<p className="pointer-events-none  -z-10 self-center border-slate-700 bg-transparent p-1 text-xl font-bold">
					Chat
				</p>
			</Handle>

			<Handle type="source" position={Position.Right} id="chat-prompt" className="h-4 w-4" />
		</div>
	);
};

const Content: FC<{
	data: ChatPromptNodeDataType;
	showFullScreen: boolean;
}> = ({ data, showFullScreen }) => {
	return (
		<>
			<div
				className={conditionalClassNames(
					showFullScreen && 'overflow-y-scroll',
					`nodrag flex flex-col
						items-end justify-between gap-4 rounded-b-lg px-3 text-xl`,
				)}
			>
				{!showFullScreen ? (
					<p
						style={{
							display: '-webkit-box',
							WebkitLineClamp: 10, // Set the desired number of lines before truncating
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
						className="whitespace-pre-wrap"
					>
						{data.response}
					</p>
				) : (
					<p>{data.response}</p>
				)}
			</div>
			<div className="flex justify-end">
				<ClipboardIcon
					className={conditionalClassNames(
						' -ml-1 mr-1 h-7 w-7 flex-shrink-0 cursor-pointer text-slate-500 hover:text-slate-900 active:scale-50',
					)}
					aria-hidden="true"
					onClick={() => {
						navigator.clipboard.writeText(data.response);
					}}
				/>
			</div>
		</>
	);
};

export default memo(ChatPrompt);
