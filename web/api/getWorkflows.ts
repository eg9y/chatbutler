import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from 'shared';

export const config = {
	runtime: 'experimental-edge',
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
	const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || '';
	const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

	const { data, error } = await supabase
		.from('workflows')
		.select(
			`
		id,
		name,
		user_id,
		description, 
		profiles (
			first_name
		)
	`,
		)
		.limit(10)
		.eq('is_public', true);
	if (error) {
		return response.status(500).json({ error });
	}

	return new Response(
		JSON.stringify({
			data,
		}),
		{
			status: 200,
			headers: {
				'Cache-Control': 's-maxage=120',
				'Content-Type': 'application/json',
			},
		},
	);
}
