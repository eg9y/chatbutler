import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { LLMPromptNodeDataType, CustomNode } from './types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';
import { Disclosure } from '@headlessui/react';
import { SignalIcon } from '@heroicons/react/20/solid';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';

const LLMPrompt: FC<NodeProps<LLMPromptNodeDataType>> = (props) => {
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

	const { updateNode, openAIApiKey, getInputNodes } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '40rem' : '5rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-amber-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{RunnableToolbarTemplate(data, selected, updateNode, id, openAIApiKey)}
				{/* how to spread  */}
				<TextAreaTemplate
					{...props}
					title="LLM"
					fieldName="Prompt"
					show={showPrompt}
					setShow={setshowPrompt}
					presentText={presentText}
					setText={setText}
				>
					<div className="flex flex-col gap-2 text-md ">
						<div className="flex gap-2 flex-wrap">
							{getInputNodes(data.inputs.inputs).map((inputNode: CustomNode) => {
								const colorClass = conditionalClassNames(
									inputNode.type === 'textInput' &&
										'bg-emerald-600 text-white hover:bg-emerald-700 border-l-8 border-emerald-400',
									inputNode.type === 'llmPrompt' &&
										'bg-amber-600 text-white hover:bg-amber-700  border-l-8 border-amber-400',
									`rounded py-1 px-2 font-semibold shadow-sm `,
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
													start + 4 + inputNode.data.name.length;
												prompt.selectionEnd =
													start + 4 + inputNode.data.name.length;

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
				</TextAreaTemplate>
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
