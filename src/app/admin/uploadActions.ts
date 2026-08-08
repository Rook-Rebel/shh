"use server";

import { requireAdminSession } from "@/lib/adminSession";
import {
  createSignedUpload,
  removeFromBucketByPath,
  type SignedUpload,
  type StorageBucket,
} from "@/lib/supabase/storage";

// Authorizes ONE direct browser → Supabase upload. The video/thumbnail
// bytes themselves never reach this server — only this small request does,
// and the response is just a path + short-lived, path-scoped token.
export async function createSignedUploadAction(
  bucket: StorageBucket,
  fileName: string
): Promise<SignedUpload> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const extension = fileName.split(".").pop();
  const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

  return createSignedUpload(bucket, path);
}

// Best-effort cleanup for files that were uploaded directly to Supabase but
// never made it into a saved video row (thumbnail failed after the video
// upload succeeded, or the metadata write itself failed).
export async function cleanupOrphanedUploadAction(videoPath?: string, thumbnailPath?: string): Promise<void> {
  try {
    await requireAdminSession();
  } catch {
    return;
  }

  if (videoPath) await removeFromBucketByPath("videos", videoPath);
  if (thumbnailPath) await removeFromBucketByPath("thumbnails", thumbnailPath);
}
