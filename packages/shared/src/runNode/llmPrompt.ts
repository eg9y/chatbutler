import { CustomNode, LLMPromptNodeDataType } from "../types/NodeTypes";
import { SupabaseSettingsType } from "../types/SupabaseSettingsType";
import { getOpenAICompleteResponse } from "../utils/openai/openai";

async function llmPrompt(
  nodes: CustomNode[],
  node: CustomNode,
  openAiKey: string,
  supabaseSettings: SupabaseSettingsType
) {
  const inputs = node.data.inputs;
  if (inputs) {
    const response = await getOpenAICompleteResponse(
      openAiKey,
      node.data as LLMPromptNodeDataType,
      inputs.inputs,
      nodes,
      supabaseSettings
    );
    // const mockResponse = {
    // 	data: {
    // 		choices: [
    // 			{
    // 				text:
    // 					Math.random().toString(36).substring(2, 15) +
    // 					Math.random().toString(36).substring(2, 15),
    // 			},
    // 		],
    // 	},
    // };
    // const completion = mockResponse.data.choices[0].text;
    const completion = response;
    if (completion) {
      node.data = {
        ...node.data,
        response: completion,
      };
    }
  }
}

export default llmPrompt;
