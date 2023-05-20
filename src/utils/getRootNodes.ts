import { getNodes } from './getNodes';
import { CustomNode, NodeTypesEnum } from '../nodes/types/NodeTypes';

export function getRootNodes(nodes: CustomNode[]): CustomNode[] {
	const rootNodes: CustomNode[] = [];

	for (const node of nodes) {
		// get inputs
		const inputNodes = getNodes(nodes, node.data.inputs.inputs);
		const loopInputCount = inputNodes.filter((inputNode) => inputNode.data.loopId).length;

		// if loop is root, it might still have inputs from the loop end node.
		// if node is variable, don't consider it
		if (
			node.data.inputs.inputs.length === 0 ||
			(node.type === NodeTypesEnum.loop && loopInputCount === inputNodes.length)
		) {
			rootNodes.push(node);
		}
	}

	// sort such that those with type == globalVariable are at the start
	rootNodes.sort((a, b) => {
		if (a.type === NodeTypesEnum.globalVariable) {
			return -1;
		}
		if (b.type === NodeTypesEnum.globalVariable) {
			return 1;
		}
		return 0;
	});

	return rootNodes;
}
