import { CustomNode } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

function pauser(node: CustomNode, get: () => RFState): Promise<string> {
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

async function inputText(node: CustomNode, get: () => RFState) {
	await pauser(node, get);
	node.data = {
		...node.data,
		isLoading: false,
	};
}

export default inputText;
