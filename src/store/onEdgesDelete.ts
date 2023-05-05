import { UseStoreSetType, RFState } from './useStore';

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
