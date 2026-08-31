import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Supabase client instance.
 * Returns null when VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing,
 * allowing the app to fall back to mock data seamlessly.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Whether live Supabase connection is configured */
export const isSupabaseConfigured = supabase !== null;
