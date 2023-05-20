import { createClient } from '@supabase/supabase-js';

export const supabaseClient = (req: Request) => {
	// Create a Supabase client with the Auth context of the logged in user.
	const supabaseClient = createClient(
		// Supabase API URL - env var exported by default.
		Deno.env.get('SUPABASE_URL') ?? '',
		// Supabase API ANON KEY - env var exported by default.
		Deno.env.get('SUPABASE_ANON_KEY') ?? '',
		// Create client with Auth context of the user that called the function.
		// This way your row-level-security (RLS) policies are applied.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		{ global: { headers: { Authorization: req.headers.get('Authorization')! } } },
	);
	return supabaseClient;
};
