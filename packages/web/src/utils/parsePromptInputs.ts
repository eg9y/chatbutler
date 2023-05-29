import { CustomNode } from '@chatbutler/shared/src/index';

import { RFState } from '../store/useStore';

export function parsePromptInputs(get: () => RFState, prompt: string, nodeIds: string[]): string {
	let parsedPrompt = prompt;
	const nodes = get().getNodes([...nodeIds]);

	nodes.forEach((node: CustomNode) => {
		parsedPrompt = parsedPrompt.replace(
			new RegExp(`{{${node.data.name}}}`, 'g'),
			node.data.response,
		);
	});
	return parsedPrompt;
}
