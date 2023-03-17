import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { handleChange } from '../utils/handleFormChange';
import { LLMPromptNodeDataType, CustomNode, NodeTypesEnum } from './types/NodeTypes';
import RunButton from '../components/RunButton';
import { conditionalClassNames } from '../utils/classNames';
import { Disclosure } from '@headlessui/react';
import { SignalIcon, PauseIcon } from '@heroicons/react/20/solid';

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
		<div className="relative">
			<NodeToolbar position={Position.Top}>
				<div className="flex flex-col  text-sm shadow-lg max-w-max">
					<div className="w-full px-2 bg-slate-300 rounded-t-lg border-1 border-b-0 border-slate-400">
						<p className="block font-medium leading-6 ">Inputs</p>
					</div>
					<div className="flex gap-2 bg-slate-100 p-2 border-1 border-t-0 border-slate-400 rounded-b-md">
						{data.inputs.inputNodes.map((inputNode: CustomNode) => {
							const colorClass = conditionalClassNames(
								inputNode.type === 'textInput' &&
									'bg-green-300 border-1 border-green-500 text-slate-900 ',
								inputNode.type === 'llmPrompt' &&
									'bg-amber-300  border-1 border-amber-500 text-slate-900 ',
								`rounded-md h-full px-2 font-semibold shadow-sm `,
							);
							return (
								<button
									key={inputNode.id}
									type="button"
									// convert below to use color for both bg and text
									className={colorClass}
									onClick={() => {
										// append {{inputNode.data.name}} to textarea
										const prompt = document.getElementById(
											`prompt-${id}`,
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
							);
						})}
					</div>
				</div>
			</NodeToolbar>
			<div
				style={{
					height: '40rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-50 shadow-lg border-2  ${
					selected ? 'border-amber-600' : 'border-slate-200'
				} flex flex-col `}
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
							id={`prompt-${id}`}
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
						<div className="flex gap-2 justify-end items-center">
							<button
								className="bg-red-500 hover:bg-red-600 text-white text-md font-semibold py-1 px-2 my-2 rounded flex items-center"
								// onClick={getResponse()}
							>
								<PauseIcon
									className={conditionalClassNames(
										' -ml-1 mr-1 h-5 w-5 flex-shrink-0 text-red-100',
									)}
									aria-hidden="true"
								/>
								<span>Set Breakpoint</span>
							</button>
							<RunButton
								text="Run Node"
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
								'flex justify-between border-1 border-slate-400 bg-slate-200 text-gray-900 group px-2 w-full items-center rounded-t-md py-2 pr-2 text-left text-md font-extrabold',
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
							border-slate-400 rounded-b-lg flex flex-col justify-between gap-4"
							>
								<p>{data.response}</p>
							</div>
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
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
