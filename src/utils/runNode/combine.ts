import { Document } from '../../backgroundTasks/langChainBrowser/document';
import { CustomNode } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';

function combine(node: CustomNode, get: () => RFState) {
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
}

export default combine;
