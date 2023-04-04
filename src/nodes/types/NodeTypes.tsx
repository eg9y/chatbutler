import { Node } from 'reactflow';

import { Inputs } from './Input';
import { DocumentDbSchema } from '../../db/dbTypes';

export type DefaultNodeDataType = {
	name: string;
	text: string;
	inputs: Inputs;
	children: string[];
	response: string;
	isLoading: boolean;
	isBreakpoint: boolean;
};

export type AllDataTypes =
	| LLMPromptNodeDataType
	| TextNodeDataType
	| ChatPromptNodeDataType
	| ClassifyNodeDataType
	| ClassifyNodeCategoriesDataType
	| ChatMessageNodeDataType
	| SearchDataType
	| OutputTextDataType
	| InputTextDataType
	| CombineDataType
	| FileTextDataType;

export type CustomNode = Node<AllDataTypes>;
export type InputNode = Node<LLMPromptNodeDataType | TextNodeDataType | ChatPromptNodeDataType>;

type OpenAIAPIRequest = {
	model: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	max_tokens: number;
	response: string;
	stop: string[];
};

export type LLMPromptNodeDataType = {
	best_of: number;
} & OpenAIAPIRequest &
	DefaultNodeDataType;
export type ChatPromptNodeDataType = LLMPromptNodeDataType;
export type ChatMessageNodeDataType = {
	role: 'user' | 'assistant' | 'system';
} & DefaultNodeDataType;

export type TextNodeDataType = DefaultNodeDataType;

export type PlaceholderDataType = {
	typeToCreate: NodeTypesEnum | null;
} & DefaultNodeDataType;

export type ClassifyNodeDataType = {
	textType: string;
} & OpenAIAPIRequest &
	DefaultNodeDataType;

export type ClassifyNodeCategoriesDataType = {
	classifications: {
		id: string;
		value: string;
	}[];
} & DefaultNodeDataType;

type DocumentDataType = {
	document?: DocumentDbSchema;
};

export type FileTextDataType = DocumentDataType & DefaultNodeDataType;
export type SearchDataType = {
	results: number;
} & DocumentDataType &
	DefaultNodeDataType;

export type CombineDataType = DefaultNodeDataType;
export type InputTextDataType = DefaultNodeDataType;
export type OutputTextDataType = DefaultNodeDataType;

export enum NodeTypesEnum {
	llmPrompt = 'llmPrompt',
	text = 'text',
	chatPrompt = 'chatPrompt',
	chatMessage = 'chatMessage',
	classify = 'classify',
	classifyCategories = 'classifyCategories',
	placeholder = 'placeholder',
	fileText = 'fileText',
	search = 'search',
	combine = 'combine',
	inputText = 'inputText',
	outputText = 'outputText',
}
