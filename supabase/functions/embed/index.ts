import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

import { hexToString } from './hex.ts';

serve(async (req) => {
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
	// Now we can get the session or user object
	const {
		data: { user },
	} = await supabaseClient.auth.getUser();

	// call supabase function
	const { data, error } = await supabaseClient.rpc('get_open_ai_key', {
		p_user_id: user?.id ?? '',
		p_secret_key: Deno.env.get('PGSODIUM_SECRET_KEY') ?? '',
	});

	if (error) {
		console.error(error);
	}
	if (!data) {
		return new Response('You have not set your OpenAI Key', {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		});
	}

	const openAiApiKey = hexToString(data[0].open_ai_key);

	const { texts } = await req.json();

	const clientConfig = new Configuration({
		apiKey: openAiApiKey,
	});
	const client = new OpenAIApi(clientConfig);

	const embeddings: number[][] = [];

	const response = await client.createEmbedding({
		model: 'text-embedding-ada-002',
		input: texts,
	});

	if (!response) {
		throw new Error('No response from OpenAI');
	}
	for (let j = 0; j < texts.length; j += 1) {
		embeddings.push(response.data.data[j].embedding);
	}

	return new Response(JSON.stringify(embeddings), {
		status: 200,
		headers: {
			'content-type': 'application/json',
		},
	});
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
