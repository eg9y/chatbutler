import { Node } from 'reactflow';

import { RFState, UseStoreSetType } from './useStore';
import { InputNode, LLMPromptNodeDataType, TextNodeDataType } from '../nodes/types/NodeTypes';

const updateNode = (
	get: () => RFState,
	set: UseStoreSetType,
	nodeId: string,
	data: LLMPromptNodeDataType & TextNodeDataType,
	position?: {
		mode: 'add' | 'set';
		x: number;
		y: number;
	},
) => {
	let selectedNode: Node | null = null;
	const nodes = get().nodes.map((node) => {
		if (node.id === nodeId) {
			// it's important to create a new object here, to inform React Flow about the changes
			node.data = { ...data };
			selectedNode = node;

			if (position) {
				if (position.mode === 'add') {
					node.position.x += position.x;
					node.position.y += position.y;
				} else {
					node.position = position;
				}
			}
		}

		return node;
	});

	// update inputs of target nodes
	const edges = get().edges;
	const targetEdges = edges.filter((e) => e.source === nodeId);
	const targetNodes = nodes.filter((n) => targetEdges.map((e) => e.target).includes(n.id));
	targetNodes.forEach((targetNode) => {
		targetNode.data.inputs.updateInput(nodeId, nodes as InputNode[]);
	});

	set({
		nodes,
		selectedNode,
	});
};

export default updateNode;
