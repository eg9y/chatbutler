import { CustomNode, InputNode } from "./types/NodeTypes";

export function getNodes(nodes: CustomNode[], nodeIds: string[]) {
  if (nodeIds.length === 0) {
    return [];
  }
  const inputNodes = nodes.filter((node) => nodeIds.includes(node.id));
  return inputNodes as InputNode[];
}
