"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { removeFromBucket } from "@/lib/supabase/storage";
import type { Video, Visibility } from "@/types/video";

// All video writes live here, gated behind requireAdminSession(). Video and
// thumbnail bytes never reach these actions — the browser uploads them
// straight to Supabase Storage first (see uploadActions.ts), and only the
// resulting storage paths are passed in here to build the database row.

export interface VideoActionResult {
  video?: Video;
  error?: string;
}

interface VideoMetadata {
  title: string;
  description: string;
  visibility: Visibility;
  featured: boolean;
}

export interface CreateVideoInput extends VideoMetadata {
  videoPath: string;
  thumbnailPath: string;
}

export interface UpdateVideoInput extends VideoMetadata {
  id: string;
  videoPath?: string;
  thumbnailPath?: string;
  existingVideoUrl: string;
  existingThumbnailUrl: string;
}

// Only one video should ever be featured — quietly un-feature the rest.
async function unfeatureOthers(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  savedId: string
): Promise<void> {
  await supabase.from("videos").update({ featured: false }).neq("id", savedId);
}

export async function createVideoAction(input: CreateVideoInput): Promise<VideoActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const title = input.title.trim();
  if (!title) return { error: "a title is required." };
  if (!input.videoPath) return { error: "a video file is required." };
  if (!input.thumbnailPath) return { error: "a thumbnail is required." };

  const video_url = supabase.storage.from("videos").getPublicUrl(input.videoPath).data.publicUrl;
  const thumbnail_url = supabase.storage.from("thumbnails").getPublicUrl(input.thumbnailPath).data.publicUrl;

  const { data, error } = await supabase
    .from("videos")
    .insert({
      title,
      description: input.description,
      video_url,
      thumbnail_url,
      featured: input.featured,
      visibility: input.visibility,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const saved = data as Video;
  if (saved.featured) await unfeatureOthers(supabase, saved.id);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/watch/${saved.id}`);
  return { video: saved };
}

export async function updateVideoAction(input: UpdateVideoInput): Promise<VideoActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const title = input.title.trim();
  if (!title) return { error: "a title is required." };
  if (!input.id) return { error: "missing video id." };

  const video_url = input.videoPath
    ? supabase.storage.from("videos").getPublicUrl(input.videoPath).data.publicUrl
    : input.existingVideoUrl;
  const thumbnail_url = input.thumbnailPath
    ? supabase.storage.from("thumbnails").getPublicUrl(input.thumbnailPath).data.publicUrl
    : input.existingThumbnailUrl;

  const { data, error } = await supabase
    .from("videos")
    .update({
      title,
      description: input.description,
      video_url,
      thumbnail_url,
      featured: input.featured,
      visibility: input.visibility,
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) return { error: error.message };

  const saved = data as Video;
  if (saved.featured) await unfeatureOthers(supabase, saved.id);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/watch/${saved.id}`);
  return { video: saved };
}

export async function deleteVideoAction(
  id: string,
  videoUrl: string,
  thumbnailUrl: string
): Promise<{ error?: string }> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) return { error: "couldn't delete this video. please try again." };

  if (thumbnailUrl) await removeFromBucket("thumbnails", thumbnailUrl);
  if (videoUrl) await removeFromBucket("videos", videoUrl);

  revalidatePath("/admin");
  revalidatePath("/");
  return {};
}
