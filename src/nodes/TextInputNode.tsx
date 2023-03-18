import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useUndo from 'use-undo';

import useStore, { selector } from '../store/useStore';
import { CustomNode, TextInputNodeDataType } from './types/NodeTypes';
import { conditionalClassNames } from '../utils/classNames';
import TextAreaTemplate from './templates/TextAreaTemplate';

const TextInput: FC<NodeProps<TextInputNodeDataType>> = (props) => {
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

	const { updateNode, getInputNodes } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);

	return (
		<div className="">
			<div
				style={{
					height: showPrompt ? '40rem' : '5rem',
					width: '35rem',
				}}
				className={`m-3 bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-emerald-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{/* how to spread  */}
				<TextAreaTemplate
					{...props}
					title="Text"
					fieldName="Text"
					bgColor="bg-emerald-200"
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
										'bg-emerald-600 text-white hover:bg-emerald-700  border-l-8 border-emerald-400',
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

export default memo(TextInput);
