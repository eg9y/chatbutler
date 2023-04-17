import { Database } from '../schema';

export type WorkflowDbSchema = Database['public']['Tables']['workflows']['Row'];
export type DocumentDbSchema = Database['public']['Tables']['documents']['Row'];
export type SimpleWorkflow = { id: string; user_id: string; name: string; description: string };
