import { UseStoreSetType, RFState } from './useStore';
import { InputNode } from '../nodes/types/NodeTypes';
import { getAllLeafChildren } from '../utils/getChildren';

const onEdgesDelete = (get: () => RFState, set: UseStoreSetType, edges: RFState['edges']) => {
	const nodes = get().nodes;
	let selectedNode = get().selectedNode;

	const updatedNodes = nodes.map((node) => {
		const edgesToDelete = edges.filter((edge) => edge.target === node.id);

		// remove node's children that are part of the target edge
		const childrenToRemove = edges
			.filter((edge) => {
				return edge.source === node.id;
			})
			.map((edge) => edge.target);
		childrenToRemove.forEach((target) => {
			node.data.children = node.data.children.filter((child) => child !== target);
		});

		edgesToDelete.forEach((edge) => {
			const nodeIndex = nodes.findIndex((node) => node.id === edge.target);

			// remove target's parent nodes
			if (nodeIndex && nodes[nodeIndex]?.parentNode) {
				// get parent node position
				const parentNode = nodes.find((node) => node.id === nodes[nodeIndex].parentNode);
				delete nodes[nodeIndex].parentNode;

				// set target node's position to parent node's position
				if (parentNode) {
					nodes[nodeIndex].position.x += parentNode.position.x;
					nodes[nodeIndex].position.y += parentNode.position.y;
				}
			}

			// reassign loop node inputs
			if (nodes[nodeIndex].data.loopId) {
				const loopNode = nodes.find((node) => node.id === nodes[nodeIndex].data.loopId);
				const loopInputs = getAllLeafChildren(nodes[nodeIndex], get().getNodes);

				loopInputs.forEach((input) => {
					// remove input from loop node
					if (loopNode) {
						loopNode.data.inputs.deleteInputs([input.id]);
					}

					// add new input(s) to loop node
					const inputNodes = get().getNodes(nodes[nodeIndex].data.inputs.inputs);
					inputNodes.forEach((inputNode) => {
						if (inputNode.data.loopId && inputNode.data.children.length === 0) {
							loopNode?.data.inputs.addInput(inputNode.id, nodes as InputNode[]);
						}
					});
				});
			}
		});

		// remove input nodes
		const inputsToDelete = edgesToDelete.map((edge) => edge.source);
		if (node.data.inputs && inputsToDelete) {
			node.data.inputs.deleteInputs(inputsToDelete);
			if (node.id === get().selectedNode?.id) {
				selectedNode = node;
			}
		}

		return node;
	});

	set({
		nodes: updatedNodes,
		selectedNode,
	});
};

export default onEdgesDelete;
