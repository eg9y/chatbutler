export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			document_contents: {
				Row: {
					content: string | null;
					document_id: number;
					embedding: string | null;
					id: string;
					token_count: number | null;
					user_id: string;
				};
				Insert: {
					content?: string | null;
					document_id: number;
					embedding?: string | null;
					id?: string;
					token_count?: number | null;
					user_id: string;
				};
				Update: {
					content?: string | null;
					document_id?: number;
					embedding?: string | null;
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
					query_embedding: string;
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
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
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
