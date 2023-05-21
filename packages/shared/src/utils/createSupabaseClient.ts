import { Database } from "../types/schema";
import { createClient } from "@supabase/supabase-js";

export async function createSupabaseClient() {

  const supabaseUrl = process.env.SUPABASE_FUNCTION_URL || "";
  const supabasePublicKey = process.env.SUPABASE_PUBLIC_API || "";

  console.log(supabaseUrl, supabaseUrl);

  const supabase = createClient<Database>(supabaseUrl, supabasePublicKey);

  return supabase;
}
