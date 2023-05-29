// src/supabaseClient.js
import { Database } from '@chatbutler/shared/src/index';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

export const createSupabaseClient = () => {
	const supabase = createClient<Database>(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_PUBLIC_API,
	);
	return supabase;
};

const useSupabase = () => {
	return useMemo(createSupabaseClient, []);
};

export default useSupabase;
