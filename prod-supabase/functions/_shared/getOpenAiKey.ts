import { SupabaseClient, User } from '@supabase/supabase-js';

import { hexToString } from './hex.ts';

export async function getOpenAiKey(supabase: SupabaseClient<any, 'public', any>, user: User) {
	const { data, error } = await supabase.rpc('get_open_ai_key', {
		p_user_id: user.id,
		p_secret_key: Deno.env.get('PGSODIUM_SECRET_KEY') ?? '',
	});

	if (error) {
		throw new Error(error.message);
	}

	const openAiApiKey = hexToString(data[0].open_ai_key);
	return openAiApiKey;
}
