/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Connection, addEdge, MarkerType, Edge } from 'reactflow';
import { ChatMessageNodeDataType, InputNode } from '../nodes/types/NodeTypes';
import { RFState, UseStoreSetType } from './useStore';

const onConnect = (get: () => RFState, set: UseStoreSetType, connection: Connection) => {
	const nodes = get().nodes;
	const edges = get().edges;
	const targetNodeIndex = nodes.findIndex((n) => n.id === connection.target)!;
	const sourceNodeIndex = nodes.findIndex((n) => n.id === connection.source)!;

	let connectionEdge: Connection | Edge = connection;

	if (connection.targetHandle === 'placeholder') {
		return false;
	}

	const alreadyConnectedToChatMessage = edges.some((edge) => {
		// if target does have another source that's of type chatMessage, do something
		if (
			connection.targetHandle === 'chat-message-input' &&
			connection.sourceHandle === 'chat-message' &&
			edge.target === connection.target &&
			edge.sourceHandle === 'chat-message'
		) {
			return true;
		}

		// if chat prompt already has a chat message chain, don't allow another one
		if (
			connection.targetHandle === 'chat-prompt-messages' &&
			connection.sourceHandle === 'chat-message' &&
			edge.target === connection.target &&
			edge.sourceHandle === 'chat-message'
		) {
			return true;
		}
	});

	if (alreadyConnectedToChatMessage) {
		return false;
	}

	if (
		connection.sourceHandle === 'chat-message' &&
		(connection.targetHandle === 'chat-message-input' ||
			connection.targetHandle === 'chat-prompt-messages')
	) {
		connectionEdge = {
			id: `${nodes[sourceNodeIndex].id}-${nodes[targetNodeIndex].id}`,
			source: connection.source,
			target: connection.target,
			sourceHandle: connection.sourceHandle,
			targetHandle: connection.targetHandle,
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

		// get source node
		const sourceNode = nodes[sourceNodeIndex];
		// get target node
		const targetNode = nodes[targetNodeIndex];
		(sourceNode.data as ChatMessageNodeDataType).childrenChat.push(targetNode.id);
		set({
			nodes: [...nodes],
		});
	} else if (
		// chat messages can only connect to chat inputs or chat prompts
		connection.sourceHandle === 'chat-message' &&
		connection.targetHandle !== 'chat-message-input' &&
		connection.targetHandle !== 'chat-prompt-messages'
	) {
		return;
	} else if (
		// no other nodes is allowed to connect to chat prompts besides chat messages
		connection.sourceHandle !== 'chat-message' &&
		connection.targetHandle === 'chat-prompt-messages'
	) {
		return;
	}

	if (connection.source) {
		nodes[targetNodeIndex].data.inputs.addInput(connection.source, nodes as InputNode[]);
		// remove any edges with the same source and the targetHandle placeholder
		const placeholderToDelete = edges.find((edge) => {
			return (
				edge.source === connection.source &&
				edge.target.substring(0, edge.target.indexOf('-')) === 'placeholder'
			);
		});

		// remove placeholder node
		const filteredNodes = nodes.filter((node) => {
			return node.id !== placeholderToDelete?.target;
		});

		set({
			nodes: [...filteredNodes],
		});
	}

	set({
		edges: addEdge(connectionEdge, edges),
	});
};

export default onConnect;
