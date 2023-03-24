import { Edge } from 'reactflow';
import { UseStoreSetType, RFState } from './useStore';

const onEdgesDelete = (get: () => RFState, set: UseStoreSetType, edges: Edge[]) => {
	const nodes = get().nodes;
	let selectedNode = get().selectedNode;

	const updatedNodes = nodes.map((node) => {
		const edgesToDelete = edges
			.filter((edge) => edge.target === node.id)
			.map((edge) => edge.source);
		if (node.data.inputs && edgesToDelete) {
			node.data.inputs.deleteInputs(edgesToDelete);
			if (node.id === get().selectedNode?.id) {
				selectedNode = node;
			}
		}

		const childrenToRemove = edges
			.filter((edge) => {
				return edge.source === node.id;
			})
			.map((edge) => edge.target);
		childrenToRemove.forEach((target) => {
			node.data.children = node.data.children.filter((child) => child !== target);
		});

		return node;
	});

	set({
		nodes: updatedNodes,
		selectedNode,
	});
};

export default onEdgesDelete;
