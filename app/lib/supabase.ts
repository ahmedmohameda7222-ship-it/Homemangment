import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: any = null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseClient(): any {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  cachedClient ??= createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}
