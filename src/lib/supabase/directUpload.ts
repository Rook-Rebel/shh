import { createClient } from "@/lib/supabase/client";
import { createSignedUploadAction } from "@/app/admin/uploadActions";
import type { StorageBucket } from "@/lib/supabase/storage";

export interface DirectUploadResult {
  path: string;
  url: string;
}

// Uploads a File straight from the browser to Supabase Storage using a
// signed, path-scoped token minted server-side — the file's bytes never
// pass through our Next.js server (Server Action or proxy) at all.
export async function uploadDirect(bucket: StorageBucket, file: File): Promise<DirectUploadResult> {
  const signed = await createSignedUploadAction(bucket, file.name);
  if (signed.error || !signed.path || !signed.token) {
    throw new Error(signed.error ?? "couldn't prepare upload.");
  }

  const supabase = createClient();
  if (!supabase) throw new Error("storage isn't connected yet.");

  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(signed.path, signed.token, file);
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(signed.path);

  return { path: signed.path, url: publicUrl };
}
