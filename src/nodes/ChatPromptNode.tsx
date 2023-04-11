import { SignalIcon, ClipboardIcon } from '@heroicons/react/20/solid';
import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

import NodeTemplate from './templates/NodeTemplate';
import { ChatPromptNodeDataType } from './types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';

const ChatPrompt: FC<NodeProps<ChatPromptNodeDataType>> = (props) => {
	const { data, selected } = props;

	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div
			style={{
				height: '30rem',
				width: '35rem',
			}}
			className={` bg-slate-100 shadow-lg border-2  ${
				selected ? 'border-indigo-600' : 'border-slate-400'
			} `}
		>
			<NodeTemplate
				{...props}
				title="Chat"
				fieldName="Chat Prompt"
				bgColor="bg-purple-200"
				show={showPrompt}
				setShow={setshowPrompt}
				showFullScreen={showFullScreen}
				setShowFullScreen={setShowFullScreen}
				labelComponent={() => (
					<div className="h-14 flex justify-between items-center px-4">
						<p className="flex gap-1 items-center text-xl">
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
				className="top-1/2 h-10 flex gap-1 border-1 border-slate-700"
			>
				<div className=" bg-purple-300 w-5 h-full pointer-events-none"></div>
				<p className="bg-transparent  border-slate-700 text-xl font-bold self-center -z-10 pointer-events-none p-1">
					Chat
				</p>
			</Handle>

			<Handle type="source" position={Position.Right} id="chat-prompt" className="w-4 h-4" />
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
					`nodrag px-3 rounded-b-lg
						flex flex-col justify-between gap-4 items-end text-xl`,
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
