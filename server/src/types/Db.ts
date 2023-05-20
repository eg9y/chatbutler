import { NodeTypesEnum } from './Node';
import { Database } from './schema';

export enum MessageType {
  CHATBOT_CHANGE = 'chatbot_change',
  NODE_TYPE = 'node_type',
}

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  assistantMessageType?: NodeTypesEnum;
}

export interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

export type WorkflowDbSchema = Database['public']['Tables']['workflows']['Row'];
export type DocumentDbSchema = Database['public']['Tables']['documents']['Row'];
export type SimpleWorkflow = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_public: boolean;
  updated_at: string;
};
export type GlobalVariableType = {
  [key: string]: { name: string; type: string };
};

export type ChatSessionType = {
  id: string;
  workflow: WorkflowDbSchema | null;
  messages: Message[];
};
