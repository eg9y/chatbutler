import { NodeTypesEnum } from '../../../nodes/types/NodeTypes';

export enum MessageType {
	CHATBOT_CHANGE = 'chatbot_change',
	NODE_TYPE = 'node_type',
}

export interface Message {
	role: 'assistant' | 'user';
	content: string;
}

export interface ChatMessage {
	role: 'assistant' | 'user';
	content: string;
}

export interface TheMessage {
	type: MessageType;
	data: Message | NodeTypesEnum;
}
