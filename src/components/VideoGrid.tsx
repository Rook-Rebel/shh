import VideoCard from "@/components/VideoCard";
import type { Video } from "@/types/video";

export default function VideoGrid({
  videos,
  spotlightFirst = false,
}: {
  videos: Video[];
  spotlightFirst?: boolean;
}) {
  if (videos.length === 0) return null;

  // Only give the first card room to breathe when there's enough of a
  // grid around it — otherwise a lone oversized card looks like a bug.
  const showSpotlight = spotlightFirst && videos.length >= 3;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} large={showSpotlight && index === 0} />
      ))}
    </div>
  );
}
