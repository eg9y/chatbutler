import { CustomNode, SingleChatPromptDataType } from '../../nodes/types/NodeTypes';
import { getOpenAIChatResponse } from '../../openai/openai';
import { parsePromptInputsNoState } from '../parsePromptInputs';

async function singleChatPrompt(nodes: CustomNode[], node: CustomNode, openAiKey: string) {
	const response = await getOpenAIChatResponse(openAiKey, node.data as SingleChatPromptDataType, [
		{
			role: 'user',
			content: parsePromptInputsNoState(nodes, node.data.inputs.inputs, node.data.text),
		},
	]);

	const completion = response.text;

	if (completion) {
		node.data = {
			...node.data,
			response: completion,
		};
	}
}

export default singleChatPrompt;
