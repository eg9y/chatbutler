import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { retry } from 'https://deno.land/std@0.181.0/async/mod.ts';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

import { corsHeaders } from '../_shared/cors.ts';
import { hexToString } from '../_shared/hex.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

serve(async (req) => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	const supabase = supabaseClient(req);
	// Now we can get the session or user object
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// call supabase function
	const { data, error } = await supabase.rpc('get_open_ai_key', {
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

	try {
		const retryPromise = await retry(
			async () => {
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

				return embeddings;
			},
			{
				multiplier: 2,
				maxTimeout: 60000,
				maxAttempts: 3,
				minTimeout: 100,
			},
		);

		return new Response(JSON.stringify(retryPromise), {
			status: 200,
			headers: {
				...corsHeaders,
				'content-type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(`NOT OK: ${error.message}`, {
			status: 500,
			headers: {
				...corsHeaders,
				'content-type': 'application/json',
			},
		});
	}
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
