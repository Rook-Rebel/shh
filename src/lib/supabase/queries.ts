import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/types/video";

// Public visitors only ever see "public" videos through these two helpers.
export async function getPublicVideos(): Promise<Video[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedVideo(): Promise<Video | null> {
  const videos = await getPublicVideos();
  return videos.find((video) => video.featured) ?? null;
}

// Looks up a single video by id regardless of visibility — this is what
// makes unlisted links work. Only reachable if you already know the id.
export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("videos").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return data;
}

// Admin-only: every video regardless of visibility, for the dashboard.
export async function getAllVideosForAdmin(): Promise<Video[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}
