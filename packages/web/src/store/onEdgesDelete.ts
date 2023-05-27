import { CustomNode, NodeTypesEnum } from '@chatbutler/shared';
import { getAllChildren } from '@chatbutler/shared/src/utils/getAllChildren';

import { assignInputsToChildren } from './onConnect';
import { UseStoreSetType, RFState } from './useStore';

function deleteInputsFromChildren(
	nodes: CustomNode[],
	edge: {
		source: string;
		target: string;
	},
): void {
	const sourceNode = nodes.find((node) => node.id === edge.source);
	const targetNode = nodes.find((node) => node.id === edge.target);

	if (sourceNode && targetNode) {
		// Prepare a list of input IDs to delete
		const inputsToDelete: string[] = [sourceNode.id, ...sourceNode.data.inputs.inputs];

		// if source is classifyCategories, include classify as well since they're one entity
		if (sourceNode.type === NodeTypesEnum.classifyCategories) {
			inputsToDelete.push(sourceNode.data.inputs.inputs[0]);
		}

		// Delete inputs from target node and its descendants
		deleteInputsFromNodeAndDescendants(nodes, targetNode, inputsToDelete);
	}
}

function deleteInputsFromNodeAndDescendants(
	nodes: CustomNode[],
	node: CustomNode,
	inputsToDelete: string[],
): void {
	node.data.inputs.deleteInputs(inputsToDelete);
	node.data.children.forEach((childId) => {
		const childNode = nodes.find((node) => node.id === childId);
		if (childNode) {
			deleteInputsFromNodeAndDescendants(nodes, childNode, inputsToDelete);
		}
	});
}

const onEdgesDelete = (get: () => RFState, set: UseStoreSetType, edges: RFState['edges']) => {
	const nodes = get().nodes;
	const selectedNode = get().selectedNode;

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

			if (nodes[nodeIndex].data.loopId) {
				delete nodes[nodeIndex].data.loopId;
				getAllChildren(nodes, nodes[nodeIndex]).forEach((child) => {
					delete child.data.loopId;
				});
			}
		});

		// For each edge to delete
		edgesToDelete.forEach((edgeToDelete) => {
			// Assuming "edges" is your list of edges and "edgeToDelete" is the edge you're deleting
			const remainingEdges = get().edges.filter((edge) => edge.id !== edgeToDelete.id); // Delete the edge
			deleteInputsFromChildren(nodes, edgeToDelete); // Remove related inputs
			remainingEdges.forEach((edge) => assignInputsToChildren(nodes, edge)); // Recompute inputs based on remaining edges
		});

		return node;
	});

	set({
		nodes: updatedNodes,
		selectedNode,
	});
};

export default onEdgesDelete;
