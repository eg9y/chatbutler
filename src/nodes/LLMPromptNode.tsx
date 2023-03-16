import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { handleChange } from '../utils/handleFormChange';
import { LLMPromptNodeDataType, CustomNode, NodeTypesEnum } from './types/NodeTypes';
import RunButton from '../components/RunButton';
import { classNames } from '../utils/classNames';

const LLMPrompt: FC<NodeProps<LLMPromptNodeDataType>> = ({ data, selected, id }) => {
	const [
		textState,
		{
			set: setText,
			// reset: resetText,
			// undo: undoText,
			// redo: redoText,
			// canUndo, canRedo
		},
	] = useUndo(data.prompt);
	const { present: presentText } = textState;

	const { updateNode, openAIApiKey } = useStore(selector, shallow);

	return (
		<div className="">
			<div
				style={{
					height: '40rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-50 shadow-lg border-2  ${
					selected ? 'border-amber-600' : 'border-slate-200'
				} flex flex-col`}
			>
				<div className="bg-yellow-200 py-1">
					<h1 className="text-start pl-4">
						<span className="font-semibold">LLM:</span> {data.name}
					</h1>
				</div>
				<div className="h-full">
					{/* list of data.inputs string Set */}
					<div className="h-full flex flex-col gap-1 p-4 text-gray-900">
						<label htmlFor="prompt" className="block font-medium leading-6 ">
							Prompt:
						</label>
						<textarea
							rows={4}
							name="prompt"
							id="prompt"
							className="nodrag flex-grow w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 sm:leading-6"
							value={presentText}
							onFocus={(e) => {
								e.target.selectionStart = 0;
								e.target.selectionEnd = 0;
							}}
							onChange={(e) => {
								setText(e.target.value);
								handleChange(e, id, data, updateNode, NodeTypesEnum.llmPrompt);
							}}
						/>
						<div className="flex gap-2 items-start pt-2">
							<p className="block font-medium leading-6 ">Inputs:</p>
							<div className="flex gap-1 flex-wrap">
								{data.inputs.inputNodes.map((inputNode: CustomNode) => {
									const colorClass = classNames(
										inputNode.type === 'textInput' &&
											'bg-emerald-600 text-emerald-50',
										inputNode.type === 'llmPrompt' &&
											'bg-amber-600 text-amber-50',
										`rounded py-1 px-2 text-xs font-semibold shadow-sm `,
									);
									return (
										<div key={inputNode.id}>
											<button
												type="button"
												// convert below to use color for both bg and text
												className={colorClass}
												onClick={() => {
													// append {{inputNode.data.name}} to textarea
													const prompt = document.getElementById(
														'prompt',
													) as HTMLTextAreaElement;
													// insert in the current text cursor position
													const start = prompt.selectionStart;
													const end = prompt.selectionEnd;
													const text = prompt.value;
													const before = text.substring(0, start);
													const after = text.substring(end, text.length);
													prompt.value = `${before}{{${inputNode.data.name}}}${after}`;
													setText(prompt.value);
													// focus on the text cursor position after the inserted text
													prompt.focus();

													prompt.selectionStart =
														start + 5 + inputNode.data.name.length;
													prompt.selectionEnd =
														start + 5 + inputNode.data.name.length;

													return updateNode(id, {
														...data,
														prompt: prompt.value,
													});
												}}
											>
												{inputNode.data.name}
											</button>
										</div>
									);
								})}
							</div>
						</div>
						<div className="flex gap-2 justify-end">
							{/* <button className="border-2 border-red-300 hover:bg-red-50 text-xs font-semibold py-1 px-2 my-2 rounded flex items-center">
								<span>Clear current response</span>
							</button> */}
							<RunButton
								apiKey={openAIApiKey}
								id={id}
								data={data}
								inputNodes={data.inputs.inputNodes}
								updateNode={updateNode}
							/>
						</div>
					</div>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="text-input"
				className="w-4 h-4"
			></Handle>
			<Handle type="source" position={Position.Right} id="text-output" className="w-4 h-4" />
		</div>
	);
};

export default memo(LLMPrompt);
