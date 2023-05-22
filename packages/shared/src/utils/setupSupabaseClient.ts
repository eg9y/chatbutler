import { Database } from "../types/schema";
import { createClient } from "@supabase/supabase-js";

export function setupSupabaseClient(supabaseUrl: string, supabasePublicKey: string) {
  const supabase = createClient<Database>(supabaseUrl, supabasePublicKey);

  return supabase;
}