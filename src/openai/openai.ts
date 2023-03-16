import { Configuration, OpenAIApi } from 'openai';
import { InputNode, LLMPromptNodeDataType } from '../nodes/types/NodeTypes';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
export const openAi = new OpenAIApi(configuration);

export function parsePromptInputs(prompt: string, inputNodes: InputNode[]): string {
	let parsedPrompt = prompt;
	inputNodes.forEach((inputNode) => {
		parsedPrompt = parsedPrompt.replace(
			new RegExp(`{{${inputNode.data.name}}}`, 'g'),
			inputNode.data.response,
		);
	});
	console.log(parsedPrompt);
	return parsedPrompt;
}

export async function getOpenAIResponse(llmPrompt: LLMPromptNodeDataType, inputNodes: InputNode[]) {
	const parsedPrompt = parsePromptInputs(llmPrompt.prompt, inputNodes);

	const config = {
		model: llmPrompt.model,
		prompt: parsedPrompt,
		max_tokens: llmPrompt.max_tokens,
		temperature: llmPrompt.temperature,
		top_p: llmPrompt.top_p,
		presence_penalty: llmPrompt.presence_penalty,
		frequency_penalty: llmPrompt.frequency_penalty,
		best_of: llmPrompt.best_of,

		// n: llmPrompt.n,
		// stream: llmPrompt.stream,
		// stop: llmPrompt.stop,
	};

	console.log('config', config);
	const response = await openAi.createCompletion(config);
	return response;
}
