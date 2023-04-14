import { CustomNode } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function outputText(get: () => RFState, node: CustomNode) {
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
}

export default outputText;
