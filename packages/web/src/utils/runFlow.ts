import {
	runNode,
	runConditional,
	FlowEdgeType,
	getNextNode,
	initializeFlowState,
	getNodes,
	SearchDataType,
} from '@chatbutler/shared/src/index';
import { CustomNode, NodeTypesEnum } from '@chatbutler/shared/src/index';
import { Edge } from 'reactflow';

import { RFState } from '../store/useStore';

function inputTextPauser(node: CustomNode, get: () => RFState): Promise<string> {
	return new Promise((resolve) => {
		get().setWaitingUserResponse(true);
		get().setPauseResolver((message) => {
			node.data.response = message;
			return resolve(message);
		});
	});
}

function docsLoaderPauser(node: CustomNode, get: () => RFState): Promise<string> {
	return new Promise((resolve) => {
		const chatApp = get().chatApp;
		get().setChatApp([
			...chatApp,
			{
				role: 'assistant',
				content: 'Upload the document you want to search for',
				assistantMessageType: NodeTypesEnum.search,
			},
		]);
		get().setWaitingUserResponse(true);
		get().setPauseResolver((fileName) => {
			get().setWaitingUserResponse(false);
			node.data.response = fileName;
			return resolve(fileName);
		});
	});
}

export async function runFlow(
	get: () => RFState,
	nodes: CustomNode[],
	edges: Edge[],
	openAiKey: string,
) {
	const state = initializeFlowState(nodes, edges);
	while (state.stack.length > 0) {
		const nodeId = getNextNode(state, nodes); // nodeId is now redefined in each iteration
		if (nodeId !== null) {
			const node = getNodes(nodes, [nodeId])[0];
			if (node.data.isBreakpoint) {
				// Handle breakpoint here
				return;
			}

			if (
				node.type === NodeTypesEnum.llmPrompt ||
				node.type === NodeTypesEnum.chatPrompt ||
				node.type === NodeTypesEnum.classify ||
				node.type === NodeTypesEnum.search ||
				node.type === NodeTypesEnum.singleChatPrompt ||
				node.type === NodeTypesEnum.inputText
			) {
				get().updateNode(nodeId, {
					...node.data,
					isLoading: true,
					response: '',
				});
			}

			if (node.type === NodeTypesEnum.search && !get().currentWorkflow) {
				get().setNotificationMessage('Search block can only be used in existing chatbots');
				return;
			}
			await runNode(state, get().currentWorkflow?.id, nodes, nodeId, openAiKey, {
				url: import.meta.env.VITE_SUPABASE_URL,
				key: import.meta.env.VITE_SUPABASE_PUBLIC_API,
				functionUrl: import.meta.env.VITE_SUPABASE_FUNCTION_URL,
			});
			get().setChatApp([...state.chatHistory]);
			if (node.type === NodeTypesEnum.inputText) {
				await inputTextPauser(node, get);
				state.chatHistory = [...get().chatApp];
			} else if (
				node.type === NodeTypesEnum.search &&
				(node.data as SearchDataType).askUser
			) {
				await docsLoaderPauser(node, get);
				state.chatHistory = [...get().chatApp];
			}

			node.data.isLoading = false;

			get().setNodes([...nodes]);

			state.visited.add(nodeId);
			runConditional(nodes, edges as FlowEdgeType[], nodeId, state);
		}
	}
}
