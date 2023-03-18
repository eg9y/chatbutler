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

export type CustomNode = Node<LLMPromptNodeDataType | TextInputNodeDataType>;
export type InputNode = Node<LLMPromptNodeDataType | TextInputNodeDataType>;

export type LLMPromptNodeDataType = {
	model: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	best_of: number;
	max_tokens: number;
	response: string;
} & DefaultNodeDataType;

export type TextInputNodeDataType = DefaultNodeDataType & DefaultNodeDataType;

export enum NodeTypesEnum {
	llmPrompt = 'llmPrompt',
	textInput = 'textInput',
}
