import { CustomNode } from '../../nodes/types/NodeTypes';
import { TraversalStateType } from '../new/traversalStateType';
import { parsePromptInputsNoState } from '../parsePromptInputs';

async function inputText(stack: TraversalStateType, nodes: CustomNode[], node: CustomNode) {
	const parsedText = parsePromptInputsNoState(nodes, node.data.inputs.inputs, node.data.text);
	stack.chatHistory = [
		...stack.chatHistory,
		{
			role: 'assistant',
			content: parsedText,
		},
	];
}

export default inputText;
