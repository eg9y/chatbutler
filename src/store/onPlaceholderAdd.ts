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
	const newNode = newNodes.find((node) => node.parentNode === parentNodeId);
	if (!newNode) {
		return;
	}
	const edge = {
		id: `${parentNodeId}-${newNode.id}`,
		source: parentNodeId,
		target: newNode.id,
	};
	set({
		edges: edges.concat(edge),
	});
};

export default onPlaceholderAdd;
