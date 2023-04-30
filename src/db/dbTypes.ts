import { Database } from '../schema';
import { Message } from '../windows/ChatPanel/Chat/types';

export type WorkflowDbSchema = Database['public']['Tables']['workflows']['Row'];
export type DocumentDbSchema = Database['public']['Tables']['documents']['Row'];
export type SimpleWorkflow = {
	id: string;
	user_id: string;
	name: string;
	description: string;
	is_public: boolean;
};
export type GlobalVariableType = { [key: string]: { name: string; type: string } };

export type ChatSessionType = {
	id: string;
	workflow: WorkflowDbSchema | null;
	messages: Message[];
};
