import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAI } from 'langchain/llms/openai';
import { AIChatMessage, HumanChatMessage, SystemChatMessage } from 'langchain/schema';

import { createSupabaseClient } from '../auth/supabaseClient';
import {
	ChatPromptNodeDataType,
	ClassifyNodeDataType,
	LLMPromptNodeDataType,
	SingleChatPromptDataType,
} from '../nodes/types/NodeTypes';
import { RFState } from '../store/useStore';
import { parsePromptInputs } from '../utils/parsePromptInputs';

export type ChatSequence = {
	role: 'user' | 'assistant' | 'system';
	content: string;
}[];

export async function getOpenAICompleteResponse(
	apiKey: string | null,
	llmPrompt: LLMPromptNodeDataType,
	inputNodeIds: string[],
	get: () => RFState,
) {
	try {
		if (!apiKey) {
			throw new Error(
				'OpenAI API key is not set. Please set it in the settings at the bottom left panel.',
			);
		}

		const parsedPrompt = parsePromptInputs(get, llmPrompt.text, inputNodeIds);

		const settings: {
			openAIApiKey?: string;
			model: string;
			max_tokens: number;
			temperature: number;
			top_p: number;
			presence_penalty: number;
			frequency_penalty: number;
			best_of: number;
			stop?: string[];
		} = {
			model: llmPrompt.model,
			max_tokens: Math.floor(llmPrompt.max_tokens),
			temperature: llmPrompt.temperature,
			top_p: llmPrompt.top_p,
			presence_penalty: llmPrompt.presence_penalty,
			frequency_penalty: llmPrompt.frequency_penalty,
			best_of: Math.floor(llmPrompt.best_of),

			// TODO: make these fields configurable
			// n: llmPrompt.n,
			// stream: llmPrompt.stream,
		};

		if (llmPrompt.stop.length) {
			settings.stop = llmPrompt.stop;
		}

		const supabase = createSupabaseClient();

		const session = await supabase.auth.getSession();

		if (session.error) {
			throw new Error(session.error.message);
		}

		// if no sessions found, use api key set in non-user's "session"
		if (
			!session ||
			!session.data ||
			!session.data.session ||
			!session.data.session.access_token
		) {
			settings.openAIApiKey = apiKey;
			const llm = new OpenAI(settings);
			const response = await llm.call(parsedPrompt);
			return response;
		}

		// this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
		settings.openAIApiKey = session.data.session?.access_token;

		const llm = new OpenAI(settings, {
			basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
		});
		const response = await llm.call(parsedPrompt);
		return response;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getOpenAIChatResponse(
	apiKey: string | null,
	chatPrompt: ChatPromptNodeDataType | ClassifyNodeDataType | SingleChatPromptDataType,
	chatSequence: {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}[],
) {
	try {
		if (!apiKey) {
			throw new Error(
				'OpenAI API key is not set. Please set it in the settings at the bottom left panel.',
			);
		}

		const convertedMessages = chatSequence.map((message: any) => {
			if (message.role === 'user') {
				return new HumanChatMessage(message.content);
			} else if (message.role === 'system') {
				return new SystemChatMessage(message.content);
			} else {
				return new AIChatMessage(message.content);
			}
		});

		const settings: { [key: string]: any } = {
			modelName: chatPrompt.model,
			maxTokens: Math.floor(chatPrompt.max_tokens),
			temperature: chatPrompt.temperature,
			topP: chatPrompt.top_p,
			presencePenalty: chatPrompt.presence_penalty,
			frequencyPenalty: chatPrompt.frequency_penalty,
		};

		if (chatPrompt.stop.length) {
			settings.stop = chatPrompt.stop;
		}

		const supabase = createSupabaseClient();

		const session = await supabase.auth.getSession();

		if (session.error) {
			throw new Error(session.error.message);
		}

		// if no sessions found, use api key set in non-user's "session"
		if (
			!session ||
			!session.data ||
			!session.data.session ||
			!session.data.session.access_token
		) {
			settings.openAIApiKey = apiKey;
			const llm = new ChatOpenAI(settings);
			const response = await llm.call(convertedMessages);
			return response;
		}

		// this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
		settings.openAIApiKey = session.data.session?.access_token;

		const llm = new ChatOpenAI(settings, {
			basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
		});
		const response = await llm.call(convertedMessages);
		return response;
	} catch (error: any) {
		console.log('oof', error);
		throw new Error(error.message);
	}
}
