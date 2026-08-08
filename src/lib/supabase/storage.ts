import { createAdminClient } from "@/lib/supabase/admin";

// Server-only — these use the service_role admin client, which bypasses
// RLS. Only call from Server Actions that have already verified the admin
// session. Video/thumbnail bytes never pass through here — they go direct
// from the browser to Supabase via a signed upload URL (see
// createSignedUpload below); this module only issues that authorization
// and cleans up storage objects.
export type StorageBucket = "videos" | "thumbnails";

// Public Supabase Storage URLs look like:
// https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
// We only ever store that URL on the video row, so deleting an old file
// later means parsing the path back out of it.
export function parseStoragePath(url: string, bucket: StorageBucket): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export interface SignedUpload {
  path?: string;
  token?: string;
  error?: string;
}

// Authorizes a single direct browser-to-Supabase upload for a given path.
// The returned token is safe to hand to the browser: it only permits an
// insert at this exact path, and expires shortly after issuance.
export async function createSignedUpload(bucket: StorageBucket, path: string): Promise<SignedUpload> {
  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error) return { error: error.message };

  return { path: data.path, token: data.token };
}

export async function removeFromBucket(bucket: StorageBucket, url: string): Promise<void> {
  const path = parseStoragePath(url, bucket);
  if (!path) return;
  await removeFromBucketByPath(bucket, path);
}

// Same as removeFromBucket, but for callers that already have the raw
// storage path rather than a full public URL — namely cleaning up a
// freshly-uploaded file that never made it into a video_url/thumbnail_url.
export async function removeFromBucketByPath(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn(error);
}
