import VideoCard from "@/components/VideoCard";
import { cn } from "@/lib/cn";
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
    <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 sm:gap-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 lg:overflow-visible lg:px-0 lg:pb-0">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={cn(
            "w-[72vw] max-w-[320px] shrink-0 snap-start sm:w-[42vw] sm:max-w-[360px] lg:w-auto lg:max-w-none",
            showSpotlight && index === 0 && "lg:col-span-2"
          )}
        >
          <VideoCard video={video} showGlint={index % 3 === 1} />
        </div>
      ))}
    </div>
  );
}
