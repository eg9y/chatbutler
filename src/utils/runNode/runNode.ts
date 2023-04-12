import chatPrompt from './chatPrompt';
import classify from './classify';
import llmPrompt from './llmPrompt';
import search from './search';
import { Document } from '../../backgroundTasks/langChainBrowser/document';
import {
	CustomNode,
	NodeTypesEnum,
	CounterDataType,
	LoopDataType,
	SetVariableDataType,
} from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

export async function runNode(
	node: CustomNode,
	get: () => RFState,
	set: (state: Partial<RFState>) => void,
	openAiKey: string,
) {
	function pauser(): Promise<string> {
		return new Promise((resolve) => {
			const chatApp = get().chatApp;
			const parsedText = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
			get().setChatApp([
				...chatApp,
				{
					role: 'assistant',
					content: parsedText,
				},
			]);
			get().setWaitingUserResponse(true);
			get().setPauseResolver((message) => {
				node.data.response = message;
				return resolve(message);
			});
		});
	}
	if (
		node.type === NodeTypesEnum.llmPrompt ||
		node.type === NodeTypesEnum.chatPrompt ||
		node.type === NodeTypesEnum.classify ||
		node.type === NodeTypesEnum.search ||
		node.type === NodeTypesEnum.inputText
	) {
		node.data = {
			...node.data,
			isLoading: true,
			response: '',
		};
		get().updateNode(node.id, node.data);
	}

	if (node.type === NodeTypesEnum.llmPrompt) {
		await llmPrompt(node, openAiKey, get);
	} else if (node.type === NodeTypesEnum.inputText) {
		await pauser();
		node.data = {
			...node.data,
			isLoading: false,
		};
	} else if (node.type === NodeTypesEnum.setVariable) {
		// TODO: set variable logic
		node.data.response = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
		node.data = {
			...node.data,
			isLoading: false,
		};
		// get node from node.data.variableId
		// set node.data.text to node.data.response
		const globalVariableNode = get().getNodes([
			(node.data as SetVariableDataType).variableId,
		])[0];
		globalVariableNode.data.response = node.data.response;
		get().updateNode(globalVariableNode.id, globalVariableNode.data);
	} else if (node.type === NodeTypesEnum.outputText) {
		const chatApp = get().chatApp;
		const parsedText = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
		get().setChatApp([
			...chatApp,
			{
				role: 'assistant',
				content: parsedText,
			},
		]);
		node.data = {
			...node.data,
			isLoading: false,
		};
	} else if (node.type === NodeTypesEnum.search) {
		try {
			await search(node, get);
		} catch (error) {
			node.data = {
				...node.data,
				isLoading: false,
			};
			throw error;
		}
	} else if (node.type === NodeTypesEnum.counter) {
		const counterData = node.data as CounterDataType;
		counterData.response = (parseInt(counterData.response) + 1).toString();
		node.data = counterData;
	} else if (node.type === NodeTypesEnum.combine) {
		const inputs = node.data.inputs;
		if (inputs) {
			const inputNodes = get().getNodes(inputs.inputs);
			// inputNodes are guaranteed to be Documents[]
			const combined = inputNodes
				.map((n) => {
					return JSON.parse(n.data.response)
						.map((documentContent: Document) => {
							// TODO: add metadata to document_contents db, and theen add it to the response
							return `Text: ${documentContent.pageContent}\n`;
						})
						.join('\n\n');
				})
				.join('\n\n');
			node.data = {
				...node.data,
				response: combined,
				isLoading: false,
			};
		}
	} else if (node.type === NodeTypesEnum.chatPrompt) {
		await chatPrompt(node, get, openAiKey);
	} else if (node.type === NodeTypesEnum.classify) {
		await classify(node, get, openAiKey);
	} else if (node?.type === NodeTypesEnum.text) {
		node.data.response = parsePromptInputs(get, node.data.text, node.data.inputs.inputs);
	} else if (node?.type === NodeTypesEnum.loop) {
		const loopData = node.data as LoopDataType;
		loopData.loopCount += 1;
		const parsedText = parsePromptInputs(get, loopData.text, loopData.inputs.inputs);
		node.data = {
			...node.data,
			response: parsedText,
			loopCount: loopData.loopCount,
			isLoading: false,
		};
	}

	get().updateNode(node.id, node.data);
	set({
		selectedNode: null,
		unlockGraph: true,
	});

	// if (
	// 	!node.parentNode &&
	// 	node.type !== NodeTypesEnum.chatMessage
	// ) {
	// 	return;
	// }
}
