import { TraversalStateType } from "../traversalStateType";
import { CustomNode } from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";

function outputText(
  state: TraversalStateType,
  nodes: CustomNode[],
  node: CustomNode
) {
  const parsedText = parsePromptInputs(
    nodes,
    node.data.inputs.inputs,
    node.data.text
  );
  state.chatHistory = [
    ...state.chatHistory,
    {
      role: "assistant",
      content: parsedText,
    },
  ];
  node.data = {
    ...node.data,
    response: parsedText,
  };
}

export default outputText;
