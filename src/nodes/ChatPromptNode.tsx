import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';
import { ChatPromptNodeDataType } from './types/NodeTypes';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import { Disclosure } from '@headlessui/react';
import { SignalIcon, ClipboardIcon } from '@heroicons/react/20/solid';
import { conditionalClassNames } from '../utils/classNames';
import ShowPromptSwitch from '../components/ShowPromptSwitch';

const ChatPrompt: FC<NodeProps<ChatPromptNodeDataType>> = (props) => {
	const { data, selected, id } = props;

	const { updateNode, openAIApiKey } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '20rem' : '5rem',
					width: '35rem',
				}}
				className={` bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-indigo-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{RunnableToolbarTemplate(data, selected, updateNode, id, openAIApiKey)}
				{/* how to spread  */}

				<div
					className={`py-1 flex justify-between items-center pr-4 border-b-1 border-slate-400 text-xl bg-indigo-300`}
				>
					<div className="flex gap-2 items-center py-2">
						<h1 className="text-start pl-4">
							<span className="font-semibold">Chat Call:</span> {data.name}
						</h1>
						{data.isLoading && (
							<svg
								className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						)}
					</div>
					{ShowPromptSwitch(showPrompt, setshowPrompt)}
				</div>
			</div>
			<Disclosure
				as="div"
				className="space-y-1 absolute w-full"
				defaultOpen={data.response.length > 0}
			>
				{({ open }) => (
					<div className="mx-3">
						<Disclosure.Button
							className={conditionalClassNames(
								open ? 'border-b-slate-300' : '',
								'flex justify-between border-1 border-slate-400 bg-slate-200 text-gray-900 group px-2 w-full items-center rounded-t-md py-2 pr-2 text-left text-md font-semibold',
							)}
							disabled={data.response.length === 0}
						>
							<p className="flex gap-1 items-center pl-2">
								<SignalIcon
									className={conditionalClassNames(
										data.response.length > 0
											? 'text-green-500'
											: 'text-slate-400',
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

							{/* expand svg */}
							{data.response.length > 0 && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={conditionalClassNames(
										open ? 'transform rotate-180' : '',
										'h-6 w-6',
									)}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 15.75l7.5-7.5 7.5 7.5"
									/>
								</svg>
							)}
						</Disclosure.Button>
						<Disclosure.Panel className="space-y-1 mb-10">
							<div
								className="p-3 bg-slate-50 border-1 border-t-0 
							border-slate-400 rounded-b-lg flex flex-col justify-between gap-4 items-end"
							>
								<p>{data.response}</p>
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
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>

			<Handle
				type="target"
				position={Position.Left}
				id="chat-prompt-messages"
				style={{
					left: '-4.5rem',
				}}
				className="top-1/2 h-7 bg-slate-50 flex gap-1 border-1 border-slate-700"
			>
				<div className=" bg-purple-300 w-5 h-full pointer-events-none"></div>
				<p className="text-xl font-bold self-center -z-10 pointer-events-none p-1">Chat</p>
			</Handle>

			<Handle type="source" position={Position.Right} id="chat-prompt" className="w-4 h-4" />
		</div>
	);
};

export default memo(ChatPrompt);
