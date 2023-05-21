import { Edge } from "reactflow";

import { FlowEdgeType } from "../types/EdgeTypes";
import { getNodes } from "../getNodes";
import { CustomNode, ClassifyNodeCategoriesDataType } from "../types/NodeTypes";
import { getAllChildren } from "../utils/getAllChildren";

function classifyCategories(
  nodes: CustomNode[],
  edges: FlowEdgeType[],
  node: CustomNode,
  childrenNodes: CustomNode[],
  skipped: Set<string>
) {
  const sourceTargetEdge = edges
    .filter(
      (edge) =>
        edge.source === node.id &&
        childrenNodes.map((child) => child.id).includes(edge.target)
    )
    .reduce((acc: { [condition: string]: Edge[] }, edge) => {
      const conditionIndex = edge.sourceHandle?.split("::")[1] as string;
      const condition =
        conditionIndex === "none"
          ? "none"
          : (node.data as ClassifyNodeCategoriesDataType).classifications[
              parseInt(conditionIndex)
            ].value;
      if (!(condition in acc)) {
        acc[condition] = [edge];
      } else {
        acc[condition].push(edge);
      }
      return acc;
    }, {});

  const passingCondition = getNodes(nodes, node.data.inputs.inputs)[0].data
    .response;
  let passingChildrenNodes: CustomNode[] = [];
  if (passingCondition in sourceTargetEdge) {
    passingChildrenNodes = sourceTargetEdge[passingCondition].map(
      (edge) => nodes.find((node) => node.id === edge.target) as CustomNode
    );
  } else if ("none" in sourceTargetEdge) {
    passingChildrenNodes = sourceTargetEdge.none.map(
      (edge) => nodes.find((node) => node.id === edge.target) as CustomNode
    );
  }
  // Update this part to store skipped nodes and their children
  childrenNodes.forEach((child) => {
    if (!passingChildrenNodes.includes(child)) {
      skipped.add(child.id);
      const skippedChildren = getAllChildren(nodes, child);
      skippedChildren.forEach((skippedChild) => {
        skipped.add(skippedChild.id);
      });
    }
  });
  childrenNodes = passingChildrenNodes;
  return childrenNodes;
}

export default classifyCategories;
