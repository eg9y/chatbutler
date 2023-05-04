import { Node } from 'reactflow';

import docsLoader from './docsLoader';
import {
	chatPrompt,
	classify,
	combine,
	llmPrompt,
	loop,
	outputText,
	search,
	setVariable,
	singleChatPrompt,
	inputText,
	counter,
} from './index';
import {
	CustomNode,
	DocsLoaderDataType,
	GlobalVariableDataType,
	NodeTypesEnum,
	SearchDataType,
} from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

export async function runNode(
	node: CustomNode,
	get: () => RFState,
	set: (state: Partial<RFState>) => void,
	openAiKey: string,
) {
	if (
		node.type === NodeTypesEnum.llmPrompt ||
		node.type === NodeTypesEnum.chatPrompt ||
		node.type === NodeTypesEnum.classify ||
		node.type === NodeTypesEnum.search ||
		node.type === NodeTypesEnum.singleChatPrompt ||
		node.type === NodeTypesEnum.inputText
	) {
		node.data = {
			...node.data,
			isLoading: true,
			response: '',
		};
		get().updateNode(node.id, node.data);
	}

	switch (node.type) {
		case NodeTypesEnum.llmPrompt:
			await llmPrompt(node, openAiKey, get);
			break;
		case NodeTypesEnum.inputText:
			await inputText(node, get);
			break;
		case NodeTypesEnum.globalVariable:
			// set node.data.value to initialValue
			(node.data as GlobalVariableDataType).value = [
				...((node.data as GlobalVariableDataType).initialValue as {
					id: string;
					value: string;
				}[]),
			];
			break;
		case NodeTypesEnum.conditional:
			node.data = {
				...node.data,
				response: node.data.text,
				isLoading: false,
			};
			break;
		case NodeTypesEnum.setVariable:
			setVariable(node, get);
			break;
		case NodeTypesEnum.outputText:
			outputText(get, node);
			break;
		case NodeTypesEnum.search:
			await search(node as Node<SearchDataType>, get, openAiKey);
			break;
		case NodeTypesEnum.docsLoader:
			await docsLoader(node as Node<DocsLoaderDataType>, get, openAiKey);
			break;
		case NodeTypesEnum.counter:
			counter(node);
			break;
		case NodeTypesEnum.combine:
			combine(node, get);
			break;
		case NodeTypesEnum.chatPrompt:
			await chatPrompt(node, get, openAiKey);
			break;
		case NodeTypesEnum.singleChatPrompt:
			await singleChatPrompt(openAiKey, node, get);
			break;
		case NodeTypesEnum.classify:
			await classify(node, get, openAiKey);
			break;
		case NodeTypesEnum.text:
			node.data.response = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
			break;
		case NodeTypesEnum.loop:
			loop(node, get);
			break;
		default:
		// do nothing
	}

	get().updateNode(node.id, node.data);
	set({
		selectedNode: null,
	});
}
