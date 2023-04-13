import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../../store/useStore';
import { conditionalClassNames } from '../../utils/classNames';
import { CustomNode, DefaultNodeDataType, InputNode, NodeTypesEnum } from '../types/NodeTypes';

const InputNodesList = ({
	id,
	data,
	updateNode,
	dataFieldName = 'text',
	setText,
	type,
}: {
	id: string;
	updateNode: (id: string, data: any) => void;
	data: DefaultNodeDataType;
	dataFieldName?: string;
	setText: (text: string) => void;
	type: string;
}) => {
	const { getNodes, globalVariables } = useStore(selector, shallow);
	const inputNodes = getNodes(data.inputs.inputs);
	const globalVariableNodes = getNodes(Object.keys(globalVariables));

	function addInputToTextBox(
		id: string,
		dataFieldName: string,
		inputNode: InputNode,
		setText: (text: string) => void,
		updateNode: (id: string, data: any) => void,
		data: DefaultNodeDataType,
	) {
		return () => {
			// append {{inputNode.data.name}} to textarea
			let text: HTMLTextAreaElement | null = document.getElementById(
				`text-${id}`,
			) as HTMLTextAreaElement | null;
			if (!text) {
				text = document.getElementsByName(dataFieldName)[0] as HTMLTextAreaElement | null;
				if (!text) {
					return;
				}
			}

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
				[dataFieldName]: text.value,
			});
		};
	}

	return (
		<div className="flex gap-2 flex-wrap text-2xl">
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
						(inputNode.type === NodeTypesEnum.text ||
							inputNode.type === NodeTypesEnum.inputText ||
							inputNode.type === NodeTypesEnum.loop ||
							inputNode.type === NodeTypesEnum.outputText) &&
							'bg-emerald-600 text-white hover:bg-emerald-700',
						inputNode.type === NodeTypesEnum.llmPrompt &&
							'bg-amber-600 text-white hover:bg-amber-700',
						inputNode.type === NodeTypesEnum.chatPrompt &&
							'bg-purple-600 text-white hover:bg-purple-700',
						inputNode.type === NodeTypesEnum.singleChatPrompt &&
							'bg-purple-600 text-white hover:bg-purple-700',
						inputNode.type === NodeTypesEnum.chatMessage &&
							'bg-purple-200 text-slate-500 hover:bg-purple-400',
						inputNode.type === NodeTypesEnum.classifyCategories &&
							'bg-rose-200 text-slate-500 hover:bg-rose-400',
						inputNode.type === NodeTypesEnum.fileText &&
							'bg-sky-200  hover:bg-sky-400 ',
						inputNode.type === NodeTypesEnum.search && 'bg-sky-200  hover:bg-sky-400',
						inputNode.type === NodeTypesEnum.combine && 'bg-sky-200  hover:bg-sky-400 ',
						'rounded font-semibold shadow-sm flex items-center gap-2 h-full',
					);

					const borderClass = conditionalClassNames(
						(inputNode.type === NodeTypesEnum.text ||
							inputNode.type === NodeTypesEnum.inputText ||
							inputNode.type === NodeTypesEnum.loop ||
							inputNode.type === NodeTypesEnum.outputText) &&
							'bg-emerald-400',
						inputNode.type === NodeTypesEnum.llmPrompt && 'bg-amber-400',
						inputNode.type === NodeTypesEnum.chatPrompt && 'bg-purple-400',
						inputNode.type === NodeTypesEnum.singleChatPrompt && 'bg-purple-400',
						inputNode.type === NodeTypesEnum.chatMessage && 'bg-purple-300',
						inputNode.type === NodeTypesEnum.classifyCategories && 'bg-rose-300',
						inputNode.type === NodeTypesEnum.fileText && 'bg-sky-300',
						inputNode.type === NodeTypesEnum.search && 'bg-sky-300',
						inputNode.type === NodeTypesEnum.combine && 'bg-sky-300',
						!(inputNode.data.loopId && type === 'loop') && 'w-5',
						'h-full',
					);
					return (
						<div key={inputNode.id}>
							<button
								type="button"
								// convert below to use color for both bg and text
								className={colorClass}
								onClick={addInputToTextBox(
									id,
									dataFieldName,
									inputNode,
									setText,
									updateNode,
									data,
								)}
							>
								<div className={borderClass}>
									{inputNode.data.loopId && type === 'loop' && (
										<ArrowPathIcon className="w-8 h-8 inline-block text-slate-50" />
									)}
								</div>
								<div className="p-1">{inputNode.data.name}</div>
							</button>
						</div>
					);
				})}
			{globalVariableNodes.map((variableNode: CustomNode) => {
				const colorClass = conditionalClassNames(
					'bg-slate-300 p-1 rounded font-semibold shadow-sm flex items-center h-full',
				);

				return (
					<div key={variableNode.id}>
						<button
							type="button"
							// convert below to use color for both bg and text
							className={colorClass}
							onClick={addInputToTextBox(
								id,
								dataFieldName,
								variableNode,
								setText,
								updateNode,
								data,
							)}
						>
							<div className="p-1">{variableNode.data.name}</div>
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default InputNodesList;
