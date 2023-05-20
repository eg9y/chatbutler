import { CustomNode, SingleChatPromptDataType } from "../types/NodeTypes";
import { getOpenAIChatResponse } from "../utils/openai/openai";
import { parsePromptInputs } from "../utils/parsePromptInput";

async function singleChatPrompt(
  nodes: CustomNode[],
  node: CustomNode,
  openAiKey: string
) {
  const response = await getOpenAIChatResponse(
    openAiKey,
    node.data as SingleChatPromptDataType,
    [
      {
        role: "user",
        content: parsePromptInputs(
          nodes,
          node.data.inputs.inputs,
          node.data.text
        ),
      },
    ]
  );

  const completion = response.text;

  if (completion) {
    node.data = {
      ...node.data,
      response: completion,
    };
  }
}

export default singleChatPrompt;
