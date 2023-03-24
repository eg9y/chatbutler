// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { Database } from '../schema';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_API;
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export default supabase;
