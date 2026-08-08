// Centralized check for whether Supabase is configured. The rest of the
// app calls this (directly, or indirectly via the createClient() helpers
// returning null) instead of each assuming the env vars are present.
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
