import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import type { Video } from "@/types/video";

// Compact horizontal rows for the watch page's sidebar — a full VideoCard
// grid reads too heavy in a narrow column, so this borrows Search's
// thumbnail + title + date row treatment instead.
export default function RelatedVideos({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {videos.map((video) => (
        <li key={video.id}>
          <Link
            href={`/watch/${video.id}`}
            className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5"
          >
            <div className="shimmer relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-colors group-hover:border-rose-200/20">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="112px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                  <span className="bg-gradient-to-r from-rose-200/40 via-fuchsia-200/40 to-violet-200/40 bg-clip-text text-[10px] tracking-widest text-transparent">
                    shh.
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-ink">{video.title}</p>
              <p className="mt-1 text-xs text-zinc-600">{formatDate(video.created_at)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
