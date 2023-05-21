import { getNodes } from "../getNodes";
import { CustomNode } from "../types/NodeTypes";

// Helper function to collect all children of the skipped nodes that has no other parents to lead to them
export function getAllChildren(
  nodes: CustomNode[],
  node: CustomNode
): CustomNode[] {
  const children = getNodes(nodes, node.data.children);
  if (children.length === 0) {
    return [];
  }
  return children.reduce((acc: CustomNode[], child: CustomNode) => {
    return acc.concat(child, getAllChildren(nodes, child));
  }, []);
}
