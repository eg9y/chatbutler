/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CustomNode } from '@chatbutler/shared/src/index';
import { Connection, addEdge, MarkerType, Edge } from 'reactflow';

import { RFState, UseStoreSetType } from './useStore';

// recursively assigning the parentNode and loopId for nodes in a loop
function isCycle(nodes: CustomNode[], targetNodeIndex: number): boolean {
	function dfs(currentNodeIndex: number, visited: boolean[], recursionStack: boolean[]): boolean {
		if (recursionStack[currentNodeIndex]) {
			return true;
		}

		if (visited[currentNodeIndex]) {
			return false;
		}

		visited[currentNodeIndex] = true;
		recursionStack[currentNodeIndex] = true;

		for (const childId of nodes[currentNodeIndex].data.children) {
			const childNodeIndex = nodes.findIndex((node) => node.id === childId);
			if (dfs(childNodeIndex, visited, recursionStack)) {
				return true;
			}
		}

		recursionStack[currentNodeIndex] = false;
		return false;
	}

	const visited: boolean[] = new Array(nodes.length).fill(false);
	const recursionStack: boolean[] = new Array(nodes.length).fill(false);
	return dfs(targetNodeIndex, visited, recursionStack);
}

// recursively assigning the parentNode and loopId for nodes in a loop
function assignChildren(
	nodes: CustomNode[],
	targetNodeIndex: number,
	cb: (node: CustomNode) => void,
) {
	// Set target node's position to parent node's position
	cb(nodes[targetNodeIndex]);
	// Iterate through target node's children and call assignChildren recursively
	nodes[targetNodeIndex].data.children.forEach((childId) => {
		const childNodeIndex = nodes.findIndex((node) => node.id === childId);
		if (childNodeIndex !== -1) {
			assignChildren(nodes, childNodeIndex, cb);
		}
	});
	return nodes;
}

export function assignInputsToChildren(
	nodes: CustomNode[],
	edge: {
		source: string;
		target: string;
	},
): void {
	const sourceNode = nodes.find((node) => node.id === edge.source);
	const targetNode = nodes.find((node) => node.id === edge.target);

	if (sourceNode && targetNode) {
		// Add source node's ID to target node's parents, if it isn't already there
		if (!targetNode.data.inputs.inputs.includes(sourceNode.id)) {
			targetNode.data.inputs.addInput(sourceNode.id, nodes);
		}

		// Add source node's parents to target node's parents, if they aren't already there
		sourceNode.data.inputs.inputs.forEach((parentId) => {
			if (!targetNode.data.inputs.inputs.includes(parentId)) {
				targetNode.data.inputs.addInput(parentId, nodes);
			}
		});

		// Update target node's children
		targetNode.data.children.forEach((childId) => {
			const childNode = nodes.find((node) => node.id === childId);
			if (childNode) {
				assignInputsToChildren(nodes, { source: sourceNode.id, target: childId });
			}
		});
	}
}

function isNodePartOfHandle(
	nodes: CustomNode[],
	edges: Edge[],
	currentIndex: number,
	handle: string,
): boolean {
	const sourceParentHandles = edges.filter((edge) => {
		return edge.target === nodes[currentIndex].id;
	});

	if (sourceParentHandles.length === 0) {
		return false;
	}

	for (const edge of sourceParentHandles) {
		if (edge.sourceHandle === handle) {
			return true;
		}
		const parentNodeIndex = nodes.findIndex((node) => node.id === edge.source);
		if (parentNodeIndex !== -1 && isNodePartOfHandle(nodes, edges, parentNodeIndex, handle)) {
			return true;
		}
	}

	return false;
}

const onConnect = (
	get: () => RFState,
	set: UseStoreSetType,
	connection: Connection,
	setNotificationMessage: RFState['setNotificationMessage'],
) => {
	let nodes = get().nodes;
	let edges = get().edges;
	const targetNodeIndex = nodes.findIndex((n) => n.id === connection.target)!;
	const sourceNodeIndex = nodes.findIndex((n) => n.id === connection.source)!;

	let connectionEdge: Connection | Edge = connection;

	if (connection.targetHandle === 'placeholder-target') {
		return false;
	}

	if (connection.targetHandle === 'classify-categories-target') {
		return false;
	}

	const alreadyConnectedToChatMessage = edges.some((edge) => {
		// if target does have another source that's of type chatMessage, do don't allow
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

		// if (connection.targetHandle === 'chat-prompt-messages') {
		// 	// if target is a chat prompt, set the source node's parentNode field to the target node's id
		// 	nodes[sourceNodeIndex].parentNode = connection.target ? connection.target : undefined;
		// }

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
	} else if (
		// combine input only accepts lists
		connection.targetHandle === 'combine-input' &&
		connection.sourceHandle !== 'search-output'
	) {
		return;
	} else if (
		// combine input only accepts lists
		connection.targetHandle === 'search-input-doc' &&
		connection.sourceHandle !== 'docs-loader-output'
	) {
		return;
	} else if (
		// combine input only accepts lists
		connection.targetHandle === 'search-input' &&
		connection.sourceHandle === 'docs-loader-output'
	) {
		return;
	} else if (
		// combine input only accepts lists
		connection.targetHandle !== 'search-input-doc' &&
		connection.sourceHandle === 'docs-loader-output'
	) {
		setNotificationMessage(
			"Document Load Block can only be connected to Search Input 'Doc' handle",
		);
		return;
	} else if (nodes[targetNodeIndex].data.loopId) {
		// get source parent handle
		const partOfLoopDone = isNodePartOfHandle(
			nodes,
			edges,
			sourceNodeIndex,
			'loop-finished-output',
		);
		if (partOfLoopDone) {
			setNotificationMessage('nodes after loop cannot be connected to nodes inside loop');
			return;
		}
	} else if (nodes[sourceNodeIndex].data.loopId) {
		// get source parent handle
		const partOfLoopDone = isNodePartOfHandle(
			nodes,
			edges,
			targetNodeIndex,
			'loop-finished-output',
		);
		if (partOfLoopDone) {
			setNotificationMessage('nodes after loop cannot be connected to nodes inside loop');
			return;
		}
	}

	// else if (
	// 	// search can only connect to nodes that accepts lists
	// 	connection.sourceHandle === 'search-output' &&
	// 	connection.targetHandle !== 'combine-input'
	// ) {
	// 	return;
	// }

	// placeholder logic
	if (connection.source) {
		if ('inputs' in nodes[targetNodeIndex].data) {
			assignInputsToChildren(nodes, {
				source: connection.source,
				target: connection.target!,
			});
		}
		// remove any edges with the same source and the targetHandle placeholder
		const placeholderToDelete = edges.find((edge) => {
			return (
				edge.source === connection.source &&
				edge.target.substring(0, edge.target.indexOf('-')) === 'placeholder'
			);
		});

		// remove placeholder node
		nodes = nodes.filter((node) => {
			return node.id !== placeholderToDelete?.target;
		});

		// remove placeholder edge
		edges = edges.filter((edge) => {
			return edge.id !== placeholderToDelete?.id;
		});
	}

	if (
		connection.sourceHandle?.substring(0, connection.sourceHandle.indexOf('::')) ===
		'classifyCategories'
	) {
		connectionEdge = {
			id: `${nodes[sourceNodeIndex].id}-${nodes[targetNodeIndex].id}`,
			source: connection.source,
			target: connection.target,
			sourceHandle: connection.sourceHandle,
			targetHandle: connection.targetHandle,
			style: {
				strokeWidth: 8,
				stroke: '#fb7185',
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 10,
				height: 10,
				color: '#fb7185',
			},
		};
	}

	const sourceNode = nodes[sourceNodeIndex];
	const targetNode = nodes[targetNodeIndex];

	sourceNode.data.children.push(targetNode.id);

	// don't allow cycles
	if (isCycle(nodes, sourceNodeIndex)) {
		setNotificationMessage('Creating cycles are not allowed');
		sourceNode.data.children.pop();
		return false;
	}

	// add reference to nodes that are in a loop.
	if (connection.sourceHandle === 'loop-start-output') {
		// only allow source loop to only have one target
		const alreadyConnectedToLoop = edges.some((edge) => {
			return (
				edge.sourceHandle === connection.sourceHandle && edge.source === connection.source
			);
		});

		if (alreadyConnectedToLoop) {
			setNotificationMessage('Loop can only have one target');
			return false;
		}
		nodes[targetNodeIndex].data.loopId = nodes[sourceNodeIndex].id;
		nodes = assignChildren(nodes, targetNodeIndex, (node) => {
			node.data.loopId = node.id;
		});
	}

	// if source is part of a loop
	if (nodes[sourceNodeIndex].data.loopId) {
		const loopNodeIndex = nodes.findIndex(
			(node) => node.id === nodes[sourceNodeIndex].data.loopId,
		);
		if (loopNodeIndex !== -1) {
			nodes = assignChildren(nodes, targetNodeIndex, (node) => {
				node.data.loopId = node.id;
			});
		}
		nodes[loopNodeIndex].data.inputs.deleteInputs([nodes[sourceNodeIndex].id]);
	}

	set({
		edges: addEdge(connectionEdge, edges),
		nodes: [...nodes],
	});
};

export default onConnect;
