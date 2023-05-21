import { TraversalStateType } from "../traversalStateType";
import { CustomNode } from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";

async function inputText(
  stack: TraversalStateType,
  nodes: CustomNode[],
  node: CustomNode
) {
  const parsedText = parsePromptInputs(
    nodes,
    node.data.inputs.inputs,
    node.data.text
  );
  stack.chatHistory = [
    ...stack.chatHistory,
    {
      role: "assistant",
      content: parsedText,
    },
  ];
}

export default inputText;
