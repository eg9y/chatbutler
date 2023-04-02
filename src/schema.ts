export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			document_contents: {
				Row: {
					content: string | null;
					document_id: number;
					embedding: unknown | null;
					id: string;
					token_count: number | null;
					user_id: string;
				};
				Insert: {
					content?: string | null;
					document_id: number;
					embedding?: unknown | null;
					id: string;
					token_count?: number | null;
					user_id: string;
				};
				Update: {
					content?: string | null;
					document_id?: number;
					embedding?: unknown | null;
					id?: string;
					token_count?: number | null;
					user_id?: string;
				};
			};
			documents: {
				Row: {
					created_at: string | null;
					document_url: string;
					file_format: string | null;
					id: number;
					name: string | null;
					size: number | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					document_url: string;
					file_format?: string | null;
					id?: number;
					name?: string | null;
					size?: number | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					document_url?: string;
					file_format?: string | null;
					id?: number;
					name?: string | null;
					size?: number | null;
					user_id?: string | null;
				};
			};
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
			user_api_keys: {
				Row: {
					id: number;
					nonce: string | null;
					open_ai_key: string | null;
					user_id: string | null;
				};
				Insert: {
					id?: number;
					nonce?: string | null;
					open_ai_key?: string | null;
					user_id?: string | null;
				};
				Update: {
					id?: number;
					nonce?: string | null;
					open_ai_key?: string | null;
					user_id?: string | null;
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
			get_open_ai_key: {
				Args: {
					p_user_id: string;
					p_secret_key: string;
				};
				Returns: {
					user_id: string;
					open_ai_key: string;
				}[];
			};
			insert_user_api_key: {
				Args: {
					p_user_id: string;
					p_open_api_key: string;
					p_secret_key: string;
				};
				Returns: undefined;
			};
			match_document_contents: {
				Args: {
					query_embedding: unknown;
					match_count: number;
					filter_document_ids?: number[];
				};
				Returns: {
					id: string;
					document_id: number;
					content: string;
					similarity: number;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
