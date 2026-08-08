import { createClient } from "@/lib/supabase/client";

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

export async function uploadToBucket(bucket: StorageBucket, file: File): Promise<string> {
  const supabase = createClient();
  if (!supabase) throw new Error("admin isn't connected yet.");

  const extension = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

export async function removeFromBucket(bucket: StorageBucket, url: string): Promise<void> {
  const path = parseStoragePath(url, bucket);
  if (!path) return;

  const supabase = createClient();
  if (!supabase) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error(error);
}
