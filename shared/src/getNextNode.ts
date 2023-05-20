import { getNodes } from "./getNodes";
import { TraversalStateType } from "./traversalStateType";
import { CustomNode } from "./types/NodeTypes";

function allParentsVisited(
  nodes: CustomNode[],
  node: CustomNode,
  visited: Set<string>
): boolean {
  const inputNodes = getNodes(nodes, node.data.inputs.inputs);
  return inputNodes.every((parent) => visited.has(parent.id));
}

export function getNextNode(
  state: TraversalStateType,
  nodes: CustomNode[]
): string | null {
  while (state.stack.length > 0) {
    const nodeId = state.stack.pop();
    if (!nodeId) return null;

    const node = getNodes(nodes, [nodeId])[0];
    if (!node) return null;

    const test = !allParentsVisited(nodes, node, state.visited);
    if (state.visited.has(node.id) || test || state.skipped.has(node.id))
      continue;

    return nodeId;
  }
  return null;
}
