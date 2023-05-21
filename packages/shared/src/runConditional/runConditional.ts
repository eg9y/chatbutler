import { getNodes } from "../getNodes";
import { TraversalStateType } from "../traversalStateType";
import { FlowEdgeType } from "../types/EdgeTypes";
import { CustomNode, NodeTypesEnum, LoopDataType } from "../types/NodeTypes";
import { getAllChildren } from "../utils/getAllChildren";
import classifyCategories from "./classifyCategories";
import conditional from "./conditional";

export function runConditional(
  nodes: CustomNode[],
  edges: FlowEdgeType[],
  nodeId: string,
  state: TraversalStateType
) {
  const node = getNodes(nodes, [nodeId])[0];

  let childrenNodes = getNodes(nodes, node.data.children);

  if (node.type === NodeTypesEnum.classifyCategories) {
    // 1) get edges where source is node and target is one of children
    childrenNodes = classifyCategories(
      nodes,
      edges,
      node,
      childrenNodes,
      state.skipped
    );
  } else if (node.type === NodeTypesEnum.conditional) {
    childrenNodes = conditional(
      nodes,
      edges,
      node,
      childrenNodes,
      state.skipped
    );
  } else if (node.type === NodeTypesEnum.loop) {
    // if loop node, check if the loop condition is met
    const loopData = node.data as LoopDataType;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const loopStartNodeId = edges.find((edge) => {
      return (
        edge.sourceHandle === "loop-start-output" && edge.source === node.id
      );
    })!.target;

    if (loopData.loopCount >= loopData.loopMax) {
      // set children nodes to be ones in the Done output edg
      const childrenNodeIds = edges
        .filter((edge) => {
          return (
            edge.sourceHandle === "loop-finished-output" &&
            edge.source === node.id
          );
        })
        .map((edge) => {
          return edge.target;
        });
      childrenNodes = getNodes(nodes, childrenNodeIds);

      // Set all loop children that's part of the looping logic to be skipped
      const loopChildren = getAllChildren(
        nodes,
        getNodes(nodes, [loopStartNodeId])[0]
      );
      loopChildren.forEach((child) => {
        state.skipped.add(child.id);
      });
      state.skipped.add(loopStartNodeId);
      state.skipped.add(node.id);
    } else {
      childrenNodes = getNodes(nodes, [loopStartNodeId]);
    }
  }

  if (node.data.loopId && node.data.children.length === 0) {
    // eslint-disable-next-line no-inner-declarations
    // if last node in the loop, go back to the loop node

    // recursively assigning the parentNode and loopId for nodes in a loop
    // eslint-disable-next-line no-inner-declarations
    function resetLoopChildren(nodes: CustomNode[], loopNodeIndex: number) {
      state.visited.delete(nodes[loopNodeIndex].id);
      // Iterate through target node's children and call assignLoopChildren recursively
      nodes[loopNodeIndex].data.children.forEach((childId) => {
        const childIndex = nodes.findIndex((node) => node.id === childId);
        if (childIndex !== -1) {
          resetLoopChildren(nodes, childIndex);
        }
      });
      return nodes;
    }
    // get loop node index
    const loopNodeIndex = nodes.findIndex(
      (currNode) => currNode.id === node.data.loopId
    );
    childrenNodes = getNodes(nodes, [node.data.loopId]);
    // reset loop children
    resetLoopChildren(nodes, loopNodeIndex);
  }

  // push children nodes to stack
  childrenNodes.forEach((childNode) => {
    state.stack.push(childNode.id);
  });
}
