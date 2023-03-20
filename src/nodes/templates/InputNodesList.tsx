import { shallow } from 'zustand/shallow';
import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { CustomNode, DefaultNodeDataType } from '../types/NodeTypes';

const InputNodesList = ({
	id,
	data,
	updateNode,
	setText,
}: {
	id: string;
	updateNode: (id: string, data: any) => void;
	data: DefaultNodeDataType;
	setText: (text: string) => void;
}) => {
	const { getInputNodes } = useStore(selector, shallow);
	const inputNodes = getInputNodes(data.inputs.inputs);
	return (
		<div className="flex gap-2 flex-wrap">
			{inputNodes
				.filter((inputNode) => {
					if (inputNode.type === 'chatMessage' || inputNode.type === 'chatPrompt') {
						return false;
					}
					return true;
				})
				.map((inputNode: CustomNode) => {
					const colorClass = conditionalClassNames(
						inputNode.type === 'textInput' &&
							'bg-emerald-600 text-white hover:bg-emerald-700 border-l-8 border-emerald-400',
						inputNode.type === 'llmPrompt' &&
							'bg-amber-600 text-white hover:bg-amber-700  border-l-8 border-amber-400',
						`rounded py-1 px-2 font-semibold shadow-sm `,
						inputNode.type === 'chatPrompt' &&
							'bg-indigo-600 text-white hover:bg-indigo-700  border-l-8 border-indigo-400',
						`rounded py-1 px-2 font-semibold shadow-sm `,
						inputNode.type === 'chatMessage' &&
							'bg-indigo-200 text-slate-500 hover:bg-indigo-400  border-l-8 border-indigo-300',
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
									const text = document.getElementById(
										`text-${id}`,
									) as HTMLTextAreaElement;
									// insert in the current text cursor position
									const start = text.selectionStart;
									const end = text.selectionEnd;
									const textValue = text.value;
									const before = textValue.substring(0, start);
									const after = textValue.substring(end, textValue.length);
									text.value = `${before}{{${inputNode.data.name}}}${after}`;

									setText(text.value);
									// focus on the text cursor position after the inserted text
									text.focus();

									text.selectionStart = start + 4 + inputNode.data.name.length;
									text.selectionEnd = start + 4 + inputNode.data.name.length;

									return updateNode(id, {
										...data,
										text: text.value,
									});
								}}
							>
								{inputNode.data.name}
							</button>
						</div>
					);
				})}
		</div>
	);
};

export default InputNodesList;
