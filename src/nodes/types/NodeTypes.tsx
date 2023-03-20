import { Node } from 'reactflow';

import { Inputs } from './Input';

export type DefaultNodeDataType = {
	name: string;
	text: string;
	inputs: Inputs;
	response: string;
	isLoading: boolean;
	isBreakpoint: boolean;
};

export type CustomNode = Node<
	LLMPromptNodeDataType | TextInputNodeDataType | ChatPromptNodeDataType | ChatMessageNodeDataType
>;
export type InputNode = Node<
	LLMPromptNodeDataType | TextInputNodeDataType | ChatPromptNodeDataType
>;

type OpenAIAPIRequest = {
	model: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	best_of: number;
	max_tokens: number;
	response: string;
	stop: string[];
};

export type LLMPromptNodeDataType = OpenAIAPIRequest & DefaultNodeDataType;
export type ChatPromptNodeDataType = LLMPromptNodeDataType;
export type ChatMessageNodeDataType = {
	// to create a tree for getting paths to run
	childrenChat: string[];
	role: 'user' | 'assistant' | 'system';
} & DefaultNodeDataType;

export type TextInputNodeDataType = DefaultNodeDataType;

export type PlaceholderDataType = {
	typeToCreate: NodeTypesEnum | null;
} & DefaultNodeDataType;

export enum NodeTypesEnum {
	llmPrompt = 'llmPrompt',
	textInput = 'textInput',
	chatPrompt = 'chatPrompt',
	chatMessage = 'chatMessage',
	placeholder = 'placeholder',
}
