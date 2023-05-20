import { CustomNode } from '../../nodes/types/NodeTypes';
import { TraversalStateType } from '../new/traversalStateType';
import { parsePromptInputsNoState } from '../parsePromptInputs';

function outputText(state: TraversalStateType, nodes: CustomNode[], node: CustomNode) {
	const parsedText = parsePromptInputsNoState(nodes, node.data.inputs.inputs, node.data.text);
	state.chatHistory = [
		...state.chatHistory,
		{
			role: 'assistant',
			content: parsedText,
		},
	];
	node.data = {
		...node.data,
		response: parsedText,
	};
}

export default outputText;
