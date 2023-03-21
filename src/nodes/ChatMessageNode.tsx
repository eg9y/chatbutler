import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { ChatMessageNodeDataType } from './types/NodeTypes';
import InputNodesList from './templates/InputNodesList';
import ShowPromptSwitch from '../components/ShowPromptSwitch';
import { handleChange } from '../utils/handleFormChange';

const ChatMessage: FC<NodeProps<ChatMessageNodeDataType>> = (props) => {
	const { data, selected, id } = props;
	const [
		textState,
		{
			set: setText,
			// reset: resetText,
			// undo: undoText,
			// redo: redoText,
			// canUndo, canRedo
		},
	] = useUndo(data.text);
	const { present: presentText } = textState;

	const { updateNode } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '40rem' : '5rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-purpose-600' : 'border-slate-300'
				} flex flex-col relative`}
			>
				{/* how to spread  */}
				<div
					className={`py-1 flex justify-between items-center pr-4 border-b-1 border-slate-400 text-xl bg-purple-300`}
				>
					<div className="flex gap-2 items-center py-2">
						<h1 className="text-start pl-4">
							<span className="font-semibold">Chat:</span> {data.name}
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
				{showPrompt && (
					<div className="h-full text-xl ">
						{/* list of data.inputs string Set */}
						<div className="h-full flex flex-col gap-1 p-4 text-slate-900">
							<div className="font-medium leading-6  p-2 relative flex items-end">
								<div
									className="bg-purple-300 rounded-lg rounded-br-none p-2 text-2xl cursor-pointer text-slate-700 font-semibold hover:font-bold hover:text-yellow-100"
									onClick={() => {
										if (data.role === 'user') {
											updateNode(id, {
												...data,
												role: 'assistant',
											});
										} else if (data.role === 'assistant') {
											updateNode(id, {
												...data,
												role: 'system',
											});
										} else {
											updateNode(id, {
												...data,
												role: 'user',
											});
										}
									}}
								>
									{data.role}
								</div>
								<div>
									<div
										className="-ml-1"
										style={{
											width: '20px',
											height: '20px',
											background:
												'linear-gradient(to bottom left, rgb(0,0,0,0) 0%, rgb(0,0,0,0) 50%, rgb(216 180 254) 50%, rgb(216 180 254) 100%)',
											content: '',
										}}
									></div>
								</div>
							</div>

							<textarea
								rows={4}
								name="text"
								id={`text-${id}`}
								className="nowheel nodrag flex-grow w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-6"
								value={presentText}
								onFocus={(e) => {
									e.target.selectionStart = 0;
									e.target.selectionEnd = 0;
								}}
								onChange={(e) => {
									setText(e.target.value);
									handleChange(e, id, data, updateNode);
								}}
							/>
							<div className="flex flex-col gap-2 text-md ">
								<InputNodesList
									data={data}
									id={id}
									setText={setText}
									updateNode={updateNode}
								/>
							</div>
						</div>
					</div>
				)}

				<Handle
					type="target"
					position={Position.Left}
					id="chat-message-input"
					className="w-4 h-4"
				></Handle>
				<Handle
					type="source"
					position={Position.Right}
					id="chat-message"
					className="w-4 h-4"
				/>
			</div>
		</div>
	);
};

export default memo(ChatMessage);
