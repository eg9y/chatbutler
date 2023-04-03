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
	| TextInputNodeDataType
	| ChatPromptNodeDataType
	| ClassifyNodeDataType
	| ClassifyNodeCategoriesDataType
	| ChatMessageNodeDataType
	| SearchDataType
	| FileTextDataType;

export type CustomNode = Node<AllDataTypes>;
export type InputNode = Node<
	LLMPromptNodeDataType | TextInputNodeDataType | ChatPromptNodeDataType
>;

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

export type TextInputNodeDataType = DefaultNodeDataType;

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

export enum NodeTypesEnum {
	llmPrompt = 'llmPrompt',
	textInput = 'textInput',
	chatPrompt = 'chatPrompt',
	chatMessage = 'chatMessage',
	classify = 'classify',
	classifyCategories = 'classifyCategories',
	placeholder = 'placeholder',
	fileText = 'fileText',
	search = 'search',
}
