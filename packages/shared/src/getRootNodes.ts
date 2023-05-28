import { getNodes } from "./getNodes";
import { CustomNode, NodeTypesEnum } from "./types/NodeTypes";

export function getRootNodes(nodes: CustomNode[]): CustomNode[] {
  const rootNodes: CustomNode[] = [];

  for (const node of nodes) {
    // get inputs
    const inputNodes = getNodes(nodes, node.data.inputs.inputs);
    const loopInputCount = inputNodes.filter(
      (inputNode) => inputNode.data.loopId
    ).length;

    // if loop is root, it might still have inputs from the loop end node.
    // if node is variable, don't consider it
    if (
      node.data.inputs.inputs.length === 0 ||
      (node.type === NodeTypesEnum.loop && loopInputCount === inputNodes.length)
    ) {
      rootNodes.push(node);
    }
  }

  return rootNodes;
}
