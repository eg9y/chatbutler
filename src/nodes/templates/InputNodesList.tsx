import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { DefaultNodeDataType, InputNode, NodeTypesEnum } from '../types/NodeTypes';

const InputNodesList = ({
	id,
	data,
	updateNode,
	setText,
	type,
}: {
	id: string;
	updateNode: (id: string, data: any) => void;
	data: DefaultNodeDataType;
	setText: (text: string) => void;
	type: string;
}) => {
	const { getNodes } = useStore(selector, shallow);
	const inputNodes = getNodes(data.inputs.inputs);
	return (
		<div className="flex gap-2 flex-wrap  text-2xl">
			{inputNodes
				.filter((inputNode) => {
					if (
						(type === 'chatPrompt' && inputNode.type === 'chatMessage') ||
						(type === 'chatMessage' && inputNode.type === 'chatMessage')
					) {
						return false;
					}
					return true;
				})
				.map((inputNode: InputNode) => {
					const colorClass = conditionalClassNames(
						inputNode.type === NodeTypesEnum.textInput &&
							'bg-emerald-600 text-white hover:bg-emerald-700 border-l-8 border-emerald-400',
						inputNode.type === NodeTypesEnum.llmPrompt &&
							'bg-amber-600 text-white hover:bg-amber-700  border-l-8 border-amber-400',
						`rounded py-1 px-2 font-semibold shadow-sm `,
						inputNode.type === NodeTypesEnum.chatPrompt &&
							'bg-indigo-600 text-white hover:bg-indigo-700  border-l-8 border-indigo-400',
						`rounded py-1 px-2 font-semibold shadow-sm `,
						inputNode.type === NodeTypesEnum.chatMessage &&
							'bg-indigo-200 text-slate-500 hover:bg-indigo-400  border-l-8 border-indigo-300',
						`rounded py-1 px-2 font-semibold shadow-sm `,
						inputNode.type === NodeTypesEnum.classifyCategories &&
							'bg-rose-200 text-slate-500 hover:bg-rose-400  border-l-8 border-rose-300',
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
