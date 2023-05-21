import { Edge } from "reactflow";

import { TraversalStateType } from "./traversalStateType";
import { getRootNodes } from "./getRootNodes";
import { Message } from "./types/MessageTypes";
import { CustomNode } from "./types/NodeTypes";

export function initializeFlowState(
  nodes: CustomNode[],
  edges: Edge[]
): TraversalStateType {
  const stack: string[] = [];
  const visited = new Set<string>();
  const skipped = new Set<string>();
  const chatHistory: Message[] = [];

  const rootNodes = getRootNodes(nodes);
  rootNodes.forEach((node: CustomNode) => stack.push(node.id));

  return { stack, nodes, edges, visited, skipped, chatHistory };
}
