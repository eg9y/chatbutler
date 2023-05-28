import { getNodes } from "../getNodes";
import { CustomNode,  } from "../types/NodeTypes";

export function parsePromptInputs(
  nodes: CustomNode[],
  nodeIds: string[],
  prompt: string
): string {
  let parsedPrompt = prompt;

  const inputNodes = getNodes(nodes, [...nodeIds]);

  inputNodes.forEach((node: CustomNode) => {
    parsedPrompt = parsedPrompt.replace(
      new RegExp(`{{${node.data.name}}}`, "g"),
      node.data.response
    );
  });
  return parsedPrompt;
}
