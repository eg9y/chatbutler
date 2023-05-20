import { Edge } from 'reactflow';

import { Message } from '../../windows/ChatPanel/Chat/types';

export type TraversalStateType = {
	visited: Set<string>;
	skipped: Set<string>;
	stack: string[];
	edges: Edge[];
	// nodesLengthToVisit: number;
	chatHistory: Message[];
};
