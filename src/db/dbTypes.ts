import { Database } from '../schema';

export type WorkflowDbSchema = Database['public']['Tables']['workflows']['Row'];
export type SimpleWorkflow = { id: string; user_id: string; name: string };
