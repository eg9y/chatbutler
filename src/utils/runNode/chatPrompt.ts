import {
	CustomNode,
	ChatMessageNodeDataType,
	ChatPromptNodeDataType,
	NodeTypesEnum,
} from '../../nodes/types/NodeTypes';
import { getOpenAIChatResponse } from '../../openai/openai';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

async function chatPrompt(node: CustomNode, get: () => RFState, openAiKey: string) {
	const chatMessageNodes = collectChatMessages(node, get);
	console.log('Chat sequence:', chatMessageNodes.map((n) => n.data.name).concat(node.data.name));
	const chatSequence = chatMessageNodes.map((node) => {
		const data = node.data as ChatMessageNodeDataType;
		return {
			role: data.role,
			content: data.response,
		};
	});
	const response = await getOpenAIChatResponse(
		openAiKey,
		node.data as ChatPromptNodeDataType,
		chatSequence,
	);

	const completion = response.data.choices[0].message?.content;
	if (completion) {
		node.data = {
			...node.data,
			response: completion,
		};
	}
	node.data.isLoading = false;
}
function collectChatMessages(node: CustomNode, get: () => RFState): CustomNode[] {
	const queue: CustomNode[] = [node];
	const chatMessageNodes: CustomNode[] = [];

	while (queue.length > 0) {
		const currentNode = queue.shift();
		if (!currentNode) continue;

		const inputNodes = get().getNodes(currentNode.data.inputs.inputs);

		let isAnyParentMessage = false;
		for (const parent of inputNodes) {
			if (parent.type === NodeTypesEnum.chatMessage && !chatMessageNodes.includes(parent)) {
				parent.data.response = parsePromptInputs(
					get,
					parent.data.text,
					parent.data.inputs.inputs,
				);
				chatMessageNodes.push(parent);
				isAnyParentMessage = true;
			}
			queue.push(parent);
		}
		if (isAnyParentMessage === false) {
			break;
		}
	}

	return chatMessageNodes.reverse();
}

export default chatPrompt;
