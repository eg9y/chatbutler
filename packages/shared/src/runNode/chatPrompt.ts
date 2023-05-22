import { getNodes } from "../getNodes";
import {
  CustomNode,
  ChatMessageNodeDataType,
  ChatPromptNodeDataType,
  NodeTypesEnum,
} from "../types/NodeTypes";
import { SupabaseSettingsType } from "../types/SupabaseSettingsType";
import { getOpenAIChatResponse } from "../utils/openai/openai";
import { parsePromptInputs } from "../utils/parsePromptInput";

async function chatPrompt(
  nodes: CustomNode[],
  node: CustomNode,
  openAiKey: string,
  supabaseSettings: SupabaseSettingsType
) {
  const chatMessageNodes = collectChatMessages(nodes, node);
  const chatSequence = chatMessageNodes.map((node) => {
    const data = node.data as ChatMessageNodeDataType;
    return {
      role: data.role,
      content: data.response,
    };
  });

  const response = await getOpenAIChatResponse(
    openAiKey,
    node.data as ChatPromptNodeDataType,
    chatSequence,
    supabaseSettings
  );

  const completion = response.text;
  if (completion) {
    node.data = {
      ...node.data,
      response: completion,
    };
  }
}
function collectChatMessages(
  nodes: CustomNode[],
  node: CustomNode
): CustomNode[] {
  const queue: CustomNode[] = [node];
  const chatMessageNodes: CustomNode[] = [];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode) continue;

    const inputNodes = getNodes(nodes, currentNode.data.inputs.inputs);

    let isAnyParentMessage = false;
    for (const parent of inputNodes) {
      if (
        parent.type === NodeTypesEnum.chatMessage &&
        !chatMessageNodes.includes(parent)
      ) {
        parent.data.response = parsePromptInputs(
          nodes,
          parent.data.inputs.inputs,
          parent.data.text
        );
        chatMessageNodes.push(parent);
        isAnyParentMessage = true;
      }
      queue.push(parent);
    }
    if (isAnyParentMessage === false) {
      break;
    }
  }

  return chatMessageNodes.reverse();
}

export default chatPrompt;
