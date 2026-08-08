import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only. Uses the service_role key, which bypasses Row Level Security
// entirely — never import this from a "use client" file, and never return
// the client (or its data unfiltered) to the browser. Only Server Actions
// that have already verified the admin session via requireAdminSession()
// should call this.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
