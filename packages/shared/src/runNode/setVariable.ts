import { v4 as uuidv4 } from 'uuid';
import { Node } from 'reactflow';
import { getNodes } from "../getNodes";
import {
  CustomNode,
  SetVariableDataType,
  GlobalVariableDataType,
} from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";

function setVariable(nodes: CustomNode[], node: CustomNode) {
  node.data.response = parsePromptInputs(
    nodes,
    node.data.inputs.inputs,
    node.data.text
  );
  node.data = {
    ...node.data,
    isLoading: false,
  };

  // get node from node.data.variableId
  const globalVariableNode = getNodes(nodes, [
    (node.data as SetVariableDataType).variableId,
  ])[0] as Node<GlobalVariableDataType>;

  if (globalVariableNode.data.type === "text") {
    globalVariableNode.data.value = node.data.response;
  } else if (globalVariableNode.data.type === "list") {
    const globalVariableValue = globalVariableNode.data.value as {
      id: string;
      value: string;
    }[];

    const operation =
      (node.data as SetVariableDataType).listOperation || "+ Add to end";
    switch (operation) {
      case "+ Add to end":
        globalVariableValue.push({
          id: uuidv4(),
          value: node.data.response,
        });
        break;
      case "- Remove last":
        globalVariableValue.pop();
        break;
      case "+ Add to start":
        globalVariableValue.unshift({
          id: uuidv4(),
          value: node.data.response,
        });
        break;
      case "- Remove first":
        globalVariableValue.shift();
        break;
      default:
        break;
    }
    globalVariableNode.data.value = [...globalVariableValue];
  }
}

export default setVariable;
