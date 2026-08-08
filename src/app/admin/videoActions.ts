"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { removeFromBucket, uploadToBucket } from "@/lib/supabase/storage";
import type { Video, Visibility } from "@/types/video";

// All video writes live here, gated behind requireAdminSession(). The
// browser only ever talks to Supabase with the publishable key, which can
// read but — by RLS design — can't write, so every insert/update/delete has
// to go through one of these instead.

export interface VideoActionResult {
  video?: Video;
  error?: string;
}

function readVisibility(formData: FormData): Visibility {
  return formData.get("visibility") === "unlisted" ? "unlisted" : "public";
}

export async function createVideoAction(formData: FormData): Promise<VideoActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const visibility = readVisibility(formData);
  const featured = formData.get("featured") === "true";
  const videoFile = formData.get("video");
  const thumbnailFile = formData.get("thumbnail");

  if (!title) return { error: "a title is required." };
  if (!(videoFile instanceof File) || videoFile.size === 0) {
    return { error: "a video file is required." };
  }
  if (!(thumbnailFile instanceof File) || thumbnailFile.size === 0) {
    return { error: "a thumbnail is required." };
  }

  try {
    const [video_url, thumbnail_url] = await Promise.all([
      uploadToBucket("videos", videoFile),
      uploadToBucket("thumbnails", thumbnailFile),
    ]);

    const { data, error } = await supabase
      .from("videos")
      .insert({ title, description, video_url, thumbnail_url, featured, visibility })
      .select()
      .single();

    if (error) return { error: error.message };

    const saved = data as Video;

    // Only one video should ever be featured — quietly un-feature the rest.
    if (saved.featured) {
      await supabase.from("videos").update({ featured: false }).neq("id", saved.id);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/watch/${saved.id}`);
    return { video: saved };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "something went wrong. please try again." };
  }
}

export async function updateVideoAction(formData: FormData): Promise<VideoActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "unauthorized." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { error: "storage isn't connected yet." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "missing video id." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const visibility = readVisibility(formData);
  const featured = formData.get("featured") === "true";
  const videoFile = formData.get("video");
  const thumbnailFile = formData.get("thumbnail");
  const existingVideoUrl = String(formData.get("existingVideoUrl") ?? "");
  const existingThumbnailUrl = String(formData.get("existingThumbnailUrl") ?? "");

  if (!title) return { error: "a title is required." };

  try {
    const video_url =
      videoFile instanceof File && videoFile.size > 0
        ? await uploadToBucket("videos", videoFile)
        : existingVideoUrl;

    const thumbnail_url =
      thumbnailFile instanceof File && thumbnailFile.size > 0
        ? await uploadToBucket("thumbnails", thumbnailFile)
        : existingThumbnailUrl;

    const { data, error } = await supabase
      .from("videos")
      .update({ title, description, video_url, thumbnail_url, featured, visibility })
      .eq("id", id)
      .select()
      .single();

    if (error) return { error: error.message };

    const saved = data as Video;

    if (saved.featured) {
      await supabase.from("videos").update({ featured: false }).neq("id", saved.id);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/watch/${saved.id}`);
    return { video: saved };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "something went wrong. please try again." };
  }
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
