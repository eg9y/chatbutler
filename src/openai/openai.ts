import { Configuration, OpenAIApi } from 'openai';
import { InputNode, LLMPromptNodeDataType } from '../nodes/types/NodeTypes';

export function parsePromptInputs(prompt: string, inputNodes: InputNode[]): string {
	let parsedPrompt = prompt;
	inputNodes.forEach((inputNode) => {
		parsedPrompt = parsedPrompt.replace(
			new RegExp(`{{${inputNode.data.name}}}`, 'g'),
			inputNode.data.response,
		);
	});
	return parsedPrompt;
}

export async function getOpenAIResponse(
	apiKey: string | null,
	llmPrompt: LLMPromptNodeDataType,
	inputNodes: InputNode[],
) {
	if (!apiKey) {
		throw new Error(
			'OpenAI API key is not set. Please set it in the settings at the bottom left panel.',
		);
	}

	const parsedPrompt = parsePromptInputs(llmPrompt.prompt, inputNodes);

	const settings = {
		model: llmPrompt.model,
		prompt: parsedPrompt,
		max_tokens: llmPrompt.max_tokens,
		temperature: llmPrompt.temperature,
		top_p: llmPrompt.top_p,
		presence_penalty: llmPrompt.presence_penalty,
		frequency_penalty: llmPrompt.frequency_penalty,
		best_of: llmPrompt.best_of,

		// TODO: make these fields configurable
		// n: llmPrompt.n,
		// stream: llmPrompt.stream,
		// stop: llmPrompt.stop,
	};
	console.log('openAI prompt settings', settings);

	const config = new Configuration({
		apiKey,
	});
	const openAi = new OpenAIApi(config);
	const response = await openAi.createCompletion(settings);
	return response;
}
