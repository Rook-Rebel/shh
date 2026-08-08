import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Used inside "use client" components (login form, admin dashboard, uploads).
// Returns null when Supabase isn't configured yet, instead of throwing —
// callers are expected to check for that and fail gracefully.
export function createClient() {
  if (!isSupabaseConfigured()) return null;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
