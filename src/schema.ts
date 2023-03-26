export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					first_name: string | null;
					id: string;
					last_name: string | null;
				};
				Insert: {
					first_name?: string | null;
					id: string;
					last_name?: string | null;
				};
				Update: {
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
				};
			};
			workflows: {
				Row: {
					created_at: string | null;
					description: string | null;
					edges: Json | null;
					id: string;
					is_public: boolean;
					name: string;
					nodes: Json | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					edges?: Json | null;
					id: string;
					is_public?: boolean;
					name: string;
					nodes?: Json | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					edges?: Json | null;
					id?: string;
					is_public?: boolean;
					name?: string;
					nodes?: Json | null;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
