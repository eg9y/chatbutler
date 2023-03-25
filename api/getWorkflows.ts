import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as dotenv from 'dotenv';

import { Database } from '../src/schema';

dotenv.config();

export default async function handler(request: VercelRequest, response: VercelResponse) {
	const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || '';
	const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

	const { data, error } = await supabase.from('workflows').select(`
		id,
		name
	`);
	if (error) {
		return response.status(500).json({ error });
	}

	response.status(200).json({ data });
}
