import { CustomNode, SingleChatPromptDataType } from '../../nodes/types/NodeTypes';
import { getOpenAIChatResponse } from '../../openai/openai';
import { RFState } from '../../store/useStore';
import { parsePromptInputs } from '../parsePromptInputs';

async function singleChatPrompt(openAiKey: string, node: CustomNode, get: () => RFState) {
	const response = await getOpenAIChatResponse(openAiKey, node.data as SingleChatPromptDataType, [
		{
			role: 'user',
			content: parsePromptInputs(get, node.data.text, node.data.inputs.inputs),
		},
	]);

	const completion = response.text;

	if (completion) {
		node.data = {
			...node.data,
			response: completion,
			isLoading: false,
		};
	}
}

export default singleChatPrompt;
