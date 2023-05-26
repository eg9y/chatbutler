import { ChatMessageNodeDataType, NodeTypesEnum } from '@chatbutler/shared';
import { MarkerType } from 'reactflow';

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

	const updatedEdges = get().edges.filter((edge) => edge.target !== placeholderId);
	set({
		nodes: nodes.filter((node) => node.id !== placeholderId),
		edges: updatedEdges,
	});
	get().onAdd(type, placeholderNode.position, parentNodeId);

	if (!parentNodeId) {
		return;
	}

	const newNodes = get().nodes;
	const newNodeIndex = newNodes.findIndex((node) => node.parentNode === parentNodeId);
	const parentNodeIndex = newNodes.findIndex((node) => node.id === parentNodeId);

	if (newNodeIndex === -1 || parentNodeIndex === -1) {
		return;
	}
	const edge = {
		id: `${parentNodeId}-${newNodes[newNodeIndex].id}`,
		source: parentNodeId,
		target: newNodes[newNodeIndex].id,
		sourceHandle: 'chat-message',
		targetHandle: 'chat-prompt-messages',
		style: {
			strokeWidth: 5,
			stroke: 'rgb(216 180 254)',
			strokeDasharray: '5, 5',
		},
		markerEnd: {
			type: MarkerType.ArrowClosed,
			width: 10,
			height: 10,
			color: '#d8b4fe',
		},
	};
	delete newNodes[newNodeIndex].parentNode;
	newNodes[newNodeIndex].position = {
		x: newNodes[parentNodeIndex].position.x + 800,
		y: newNodes[parentNodeIndex].position.y,
	};
	(newNodes[parentNodeIndex].data as ChatMessageNodeDataType).children.push(
		newNodes[newNodeIndex].id,
	);
	newNodes[newNodeIndex].data.inputs.addInput(parentNodeId, newNodes);
	set({
		edges: updatedEdges.concat(edge),
		nodes: newNodes,
	});
};

export default onPlaceholderAdd;
