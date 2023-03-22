import {
	CustomNode,
	NodeTypesEnum,
	LLMPromptNodeDataType,
	ChatMessageNodeDataType,
	ChatPromptNodeDataType,
} from '../nodes/types/NodeTypes';
import { getOpenAIChatResponse, getOpenAIResponse, parsePromptInputs } from '../openai/openai';
import { RFState, UseStoreSetType } from './useStore';

const runGraph = async (
	get: () => RFState,
	set: UseStoreSetType,
	sortedNodes: CustomNode[],
	sortedNodeIndex: number,
	chatPromptSequence: {
		[chatPrompt: string]: string[];
	},
) => {
	set({
		unlockGraph: false,
	});
	try {
		if (
			sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.llmPrompt ||
			sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.chatPrompt
		) {
			sortedNodes[sortedNodeIndex].data = {
				...sortedNodes[sortedNodeIndex].data,
				isLoading: true,
				response: '',
			};
			set({
				nodes: [...sortedNodes],
			});
		}
		if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.llmPrompt) {
			const inputs = sortedNodes[sortedNodeIndex].data.inputs;
			if (inputs) {
				const response = await getOpenAIResponse(
					get().openAIApiKey,
					sortedNodes[sortedNodeIndex].data as LLMPromptNodeDataType,
					get().getInputNodes(inputs.inputs),
				);
				// const mockResponse = {
				// 	data: {
				// 		choices: [
				// 			{
				// 				text:
				// 					Math.random().toString(36).substring(2, 15) +
				// 					Math.random().toString(36).substring(2, 15),
				// 			},
				// 		],
				// 	},
				// };
				// const completion = mockResponse.data.choices[0].text;
				const completion = response.data.choices[0].text;
				if (completion) {
					sortedNodes[sortedNodeIndex].data = {
						...sortedNodes[sortedNodeIndex].data,
						response: completion,
						isLoading: false,
					};
				}
			}
		} else if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.chatPrompt) {
			const chatSequenceIds = chatPromptSequence[sortedNodes[sortedNodeIndex].id];
			const chatSequence = chatSequenceIds.map((chatId) => {
				const node = sortedNodes.find((node) => node.id === chatId) as CustomNode;
				const data = node.data as ChatMessageNodeDataType;
				return {
					role: data.role,
					content: data.response,
				};
			});
			try {
				const response = await getOpenAIChatResponse(
					get().openAIApiKey,
					sortedNodes[sortedNodeIndex].data as ChatPromptNodeDataType,
					chatSequence,
				);
				const completion = response.data.choices[0].message?.content;
				if (completion) {
					sortedNodes[sortedNodeIndex].data = {
						...sortedNodes[sortedNodeIndex].data,
						response: completion,
						isLoading: false,
					};
				}
			} catch (error: any) {
				console.error('OpenAI Chat API Error:', error);
				console.error('Error cause:', error.message);
			}
		} else if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.chatMessage) {
			sortedNodes[sortedNodeIndex].data.response = parsePromptInputs(
				sortedNodes[sortedNodeIndex].data.text,
				get().getInputNodes(sortedNodes[sortedNodeIndex].data.inputs.inputs),
			);
		} else if (sortedNodes[sortedNodeIndex]?.type === NodeTypesEnum.textInput) {
			sortedNodes[sortedNodeIndex].data.response = parsePromptInputs(
				sortedNodes[sortedNodeIndex].data.text,
				get().getInputNodes(sortedNodes[sortedNodeIndex].data.inputs.inputs),
			);
		}
		set({
			nodes: [...sortedNodes],
			selectedNode: null,
			unlockGraph: true,
		});

		if (
			!sortedNodes[sortedNodeIndex].parentNode &&
			sortedNodes[sortedNodeIndex].type !== NodeTypesEnum.chatMessage
		) {
			return;
		}
		// if current node is not of type chatMessage and has a parentNode
	} finally {
		sortedNodes[sortedNodeIndex].data.isLoading = false;
		set({
			nodes: [...sortedNodes],
			unlockGraph: true,
		});
	}
};
export default runGraph;
