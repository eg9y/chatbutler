import { Edge } from 'reactflow';

import { TraversalStateType } from './traversalStateType';
import { CustomNode } from '../../nodes/types/NodeTypes';
import { Message } from '../../windows/ChatPanel/Chat/types';
import { getRootNodes } from '../getRootNodes';

export function initializeFlowState(nodes: CustomNode[], edges: Edge[]): TraversalStateType {
	const stack: string[] = [];
	const visited = new Set<string>();
	const skipped = new Set<string>();
	const chatHistory: Message[] = [];

	const rootNodes = getRootNodes(nodes);
	rootNodes.forEach((node: CustomNode) => stack.push(node.id));

	return { stack, edges, visited, skipped, chatHistory };
}
