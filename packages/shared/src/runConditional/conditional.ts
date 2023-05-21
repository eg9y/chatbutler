import { FlowEdgeType } from "../types/EdgeTypes";
import {
  CustomNode,
  ConditionalDataType,
  ConditionalBooleanOperation,
} from "../types/NodeTypes";
import { getAllChildren } from "../utils/getAllChildren";
import { parsePromptInputs } from "../utils/parsePromptInput";

function conditional(
  nodes: CustomNode[],
  edges: FlowEdgeType[],
  node: CustomNode,
  childrenNodes: CustomNode[],
  skipped: Set<string>
) {
  const data = node.data as ConditionalDataType;

  // get conditional result
  let isPass = false;
  const parsedText = parsePromptInputs(nodes, data.inputs.inputs, data.value);
  const parsedValueToCompare = parsePromptInputs(
    nodes,
    data.inputs.inputs,
    data.valueToCompare
  );

  if (data.booleanOperation === ConditionalBooleanOperation.EqualTo) {
    isPass = parsedText == parsedValueToCompare;
  } else if (data.booleanOperation === ConditionalBooleanOperation.NotEqualTo) {
    isPass = parsedText != parsedValueToCompare;
  } else if (
    data.booleanOperation === ConditionalBooleanOperation.GreaterThan
  ) {
    // check if data.text and data.valueToCompare are numbers
    const isValueNumber = !isNaN(Number(parsedValueToCompare));
    const isTextNumber = !isNaN(Number(parsedText));
    if (isValueNumber && isTextNumber) {
      isPass = Number(data.text) > Number(parsedValueToCompare);
    }
    isPass = false;
  } else if (data.booleanOperation === ConditionalBooleanOperation.LessThan) {
    // check if data.text and data.valueToCompare are numbers
    const isValueNumber = !isNaN(Number(parsedValueToCompare));
    const isTextNumber = !isNaN(Number(parsedText));
    if (isValueNumber && isTextNumber) {
      isPass = parsedText < parsedValueToCompare;
    }
    isPass = false;
  } else if (
    data.booleanOperation === ConditionalBooleanOperation.GreaterThanOrEqualTo
  ) {
    const isValueNumber = !isNaN(Number(parsedValueToCompare));
    const isTextNumber = !isNaN(Number(parsedText));
    if (isValueNumber && isTextNumber) {
      isPass = parsedText >= parsedValueToCompare;
    }
    isPass = false;
  } else if (
    data.booleanOperation === ConditionalBooleanOperation.LessThanOrEqualTo
  ) {
    const isValueNumber = !isNaN(Number(parsedValueToCompare));
    const isTextNumber = !isNaN(Number(parsedText));
    if (isValueNumber && isTextNumber) {
      isPass = parsedText <= parsedValueToCompare;
    }
    isPass = false;
  }

  const sourceTargetEdge = edges.filter(
    (edge) =>
      edge.source === node.id &&
      childrenNodes.map((child) => child.id).includes(edge.target)
  );

  const passingChildrenNodes = sourceTargetEdge
    .filter((edge) => {
      if (isPass) {
        return edge.sourceHandle === "conditional-true-output";
      }
      return edge.sourceHandle === "conditional-false-output";
    })
    .map((edge) => nodes.find((node) => node.id === edge.target) as CustomNode);

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

export default conditional;
