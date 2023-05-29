import { serve } from 'http/server.ts';

import { corsHeaders } from "../_shared/cors.ts";
import { getOpenAiKey } from "../_shared/getOpenAiKey.ts";
import { supabaseClient } from "../_shared/supabaseClient.ts";


const pickHeaders = (headers: Headers, keys: any[]) => {
	const picked = new Headers();
	for (const key of headers.keys()) {
		if (keys.some((k) => (typeof k === 'string' ? k === key : k.test(key)))) {
			const value = headers.get(key);
			if (typeof value === 'string') {
				picked.set(key, value);
			}
		}
	}
	return picked;
};

serve(async (req) => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	// Get user from Supabase
	const supabase = supabaseClient(req);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response('Not authorized', {
			status: 401,
			headers: {
				'content-type': 'application/json',
			},
		});
	}

	let openAiApiKey = '';
	try {
		if (user.user_metadata.edit_with_api_key) {
			openAiApiKey = await getOpenAiKey(supabase, user);
		} else {
			// user can opt out of storing their api key for their editor and use the app's api key instead
			openAiApiKey = Deno.env.get('OPEN_AI_KEY') ?? '';
		}
	} catch (err) {
		return new Response(JSON.stringify(err), {
			status: 500,
			headers: {
				...corsHeaders,
				'content-type': 'application/json',
			},
		});
	}

	try {
		// populate function here
		const { pathname, search } = new URL(req.url);
		// remove openai so that itll be from /openai/other to /other
		const url = new URL(pathname.replace('/openai', '/v1') + search, 'https://api.openai.com')
			.href;
		const headers = pickHeaders(req.headers, ['content-type', 'authorization']);
		headers.set('authorization', `Bearer ${openAiApiKey}`);
		const res = await fetch(url, {
			body: req.body,
			method: req.method,
			headers,
		});

		return new Response(res.body, {
			status: res.status,
			headers: {
				...Object.fromEntries(
					pickHeaders(res.headers, ['content-type', /^x-ratelimit-/, /^openai-/]),
				),
				...corsHeaders,
			},
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
