import { Edge } from 'reactflow';
import { ChatMessageNodeDataType } from '../nodes/types/NodeTypes';
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

		const chatChildrenToRemove = edges
			.filter(
				(edge) =>
					edge.source === node.id &&
					edge.sourceHandle === 'chatMessage' &&
					edge.targetHandle === 'chatMessage',
			)
			.map((edge) => {
				return edge.target;
			});
		chatChildrenToRemove.forEach((target) => {
			(node.data as ChatMessageNodeDataType).childrenChat = (
				node.data as ChatMessageNodeDataType
			).childrenChat.filter((child) => child !== target);
		});

		return node;
	});

	set({
		nodes: updatedNodes,
		selectedNode,
	});
};

export default onEdgesDelete;
