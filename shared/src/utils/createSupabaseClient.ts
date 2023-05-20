import { Database } from "../types/schema";
import { getRuntimeEnvironment } from "./env";
import { createClient } from "@supabase/supabase-js";

export async function createSupabaseClient() {
  const { runtime } = await getRuntimeEnvironment();

  let SUPABASE_URL = "";
  let SUPABASE_PUBLIC_KEY = "";

  if (runtime === "browser") {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
    SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_API as string;
  } else {
    SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
    SUPABASE_PUBLIC_KEY = process.env.VITE_SUPABASE_PUBLIC_API || "";
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

  return supabase;
}
