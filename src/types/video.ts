export type Visibility = "public" | "unlisted";

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  featured: boolean;
  visibility: Visibility;
}
