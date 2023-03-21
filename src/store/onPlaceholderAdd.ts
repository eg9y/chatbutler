import { NodeTypesEnum } from '../nodes/types/NodeTypes';
import { RFState, UseStoreSetType } from './useStore';

const onPlaceholderAdd = (
	get: () => RFState,
	set: UseStoreSetType,
	placeholderId: string,
	type: NodeTypesEnum,
) => {
	//get placeholder parentId and then remove it placeholderid
	const nodes = get().nodes;
	const placeholderNode = nodes.find((node) => node.id === placeholderId);
	let parentNodeId: string | undefined = '';
	if (!placeholderNode) {
		return;
	}
	parentNodeId = placeholderNode.parentNode;
	// remove
	set({
		nodes: nodes.filter((node) => node.id !== placeholderId),
	});
	get().onAdd(type, placeholderNode.position, parentNodeId);

	if (!parentNodeId) {
		return;
	}

	const edges = get().edges;
	const newNodes = get().nodes;
	const newNodeIndex = newNodes.findIndex((node) => node.parentNode === parentNodeId);
	const parentNode = newNodes.find((node) => node.id === parentNodeId);

	if (newNodeIndex === -1 || !parentNode) {
		return;
	}
	const edge = {
		id: `${parentNodeId}-${newNodes[newNodeIndex].id}`,
		source: parentNodeId,
		target: newNodes[newNodeIndex].id,
	};
	delete newNodes[newNodeIndex].parentNode;
	newNodes[newNodeIndex].position = {
		x: parentNode.position.x + 800,
		y: parentNode.position.y,
	};
	set({
		edges: edges.concat(edge),
	});
};

export default onPlaceholderAdd;
