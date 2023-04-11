import { CustomNode, LLMPromptNodeDataType } from '../../nodes/types/NodeTypes';
import { getOpenAIResponse } from '../../openai/openai';
import { RFState } from '../../store/useStore';

async function llmPrompt(node: CustomNode, openAiKey: string, get: () => RFState) {
	const inputs = node.data.inputs;
	if (inputs) {
		const response = await getOpenAIResponse(
			openAiKey,
			node.data as LLMPromptNodeDataType,
			inputs.inputs,
			get,
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
		const completion = response.data.choices[0].text;
		if (completion) {
			node.data = {
				...node.data,
				response: completion,
				isLoading: false,
			};
		}
	}
}

export default llmPrompt;
