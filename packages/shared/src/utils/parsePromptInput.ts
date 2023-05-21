import { getNodes } from "../getNodes";
import { CustomNode, GlobalVariableDataType } from "../types/NodeTypes";

export function parsePromptInputs(
  nodes: CustomNode[],
  nodeIds: string[],
  prompt: string
): string {
  let parsedPrompt = prompt;

  const globalVariables = nodes
    .filter((node) => node.type === "globalVariable")
    .map((node) => {
      return node.id;
    });

  const inputNodes = getNodes(nodes, [...nodeIds, ...globalVariables]);

  inputNodes.forEach((node: CustomNode) => {
    if (node.type === "globalVariable") {
      const data = node.data as GlobalVariableDataType;
      if (data.type === "text") {
        parsedPrompt = parsedPrompt.replace(
          new RegExp(`{{${node.data.name}}}`, "g"),
          data.value as "string"
        );
      } else if (data.type === "list") {
        parsedPrompt = parsedPrompt.replace(
          new RegExp(`{{${node.data.name}}}`, "g"),
          (data.value as { id: "string"; value: "string" }[])
            .map((obj) => obj.value)
            .join(" ")
        );
      }
    }
    parsedPrompt = parsedPrompt.replace(
      new RegExp(`{{${node.data.name}}}`, "g"),
      node.data.response
    );
  });
  return parsedPrompt;
}
