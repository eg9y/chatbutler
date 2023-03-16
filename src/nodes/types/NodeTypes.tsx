import { Node } from 'reactflow';

import { Inputs } from './Input';

export type DefaultNodeDataType = {
	inputs: Inputs;
};

export type CustomNode = Node<LLMPromptNodeDataType & TextInputNodeDataType>;
export type InputNode = Node<LLMPromptNodeDataType & TextInputNodeDataType>;

export type LLMPromptNodeDataType = {
	name: string;
	prompt: string;
	model: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	best_of: number;
	max_tokens: number;
	response: string;
} & DefaultNodeDataType;

export type TextInputNodeDataType = {
	name: string;
	response: string;
} & DefaultNodeDataType;

export enum NodeTypesEnum {
	llmPrompt = 'llmPrompt',
	textInput = 'textInput',
}
