import {
	runNode,
	runConditional,
	FlowEdgeType,
	getNextNode,
	initializeFlowState,
	getNodes,
	SearchDataType,
	DefaultNodeDataType,
	OpenAIAPIRequest,
	Database,
} from '@chatbutler/shared/src/index';
import { CustomNode, NodeTypesEnum } from '@chatbutler/shared/src/index';
import { SupabaseClient } from '@supabase/supabase-js';
import { Edge } from 'reactflow';
import { RFStateSecret } from 'src/store/useStoreSecret';

import { calculateCreditsRequired, isNodeDoOpenAICall, isUserCreditsEnough } from './userCredits';
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
	getSecret: () => RFStateSecret,
	nodes: CustomNode[],
	edges: Edge[],
	supabase: SupabaseClient<Database>,
) {
	const state = initializeFlowState(nodes, edges);

	const userCredits = getSecret().userCredits;
	const setUserCredits = getSecret().setUserCredits;
	const openAiKey = getSecret().openAiKey;
	const session = getSecret().session;

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

			// TODO: check user's message credit
			const enoughCredit = isUserCreditsEnough(node, node.data.text, userCredits);
			if (session?.user.user_metadata.edit_with_api_key && !enoughCredit) {
				get().setNotificationMessage(
					'You have reached your free plan limit. Please upgrade your plan to continue using Chatbot Butler.',
				);
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

			if (session?.user.user_metadata.edit_with_api_key && isNodeDoOpenAICall(node)) {
				const creditsUsed = calculateCreditsRequired(
					node.data,
					node.data.text + node.data.response,
				);
				const remainingCredits =
					userCredits.credits - creditsUsed > 0 ? userCredits.credits - creditsUsed : 0;

				const { data: updatedUser, error } = await supabase
					.from('profiles')
					.update({ remaining_message_credits: remainingCredits });

				if (error) {
					console.log(error);
				} else if (updatedUser) {
					setUserCredits({
						...userCredits,
						credits: remainingCredits,
					});
				}
			}

			node.data.isLoading = false;

			get().setNodes([...nodes]);

			state.visited.add(nodeId);
			runConditional(nodes, edges as FlowEdgeType[], nodeId, state);
		}
	}
}
