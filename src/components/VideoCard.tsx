import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/formatDate";
import { isRecent } from "@/lib/isRecent";
import type { Video } from "@/types/video";

export default function VideoCard({
  video,
  showGlint = false,
}: {
  video: Video;
  showGlint?: boolean;
}) {
  const isNew = isRecent(video.created_at);

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="shimmer relative aspect-video overflow-hidden rounded-[22px] border border-white/10 bg-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:border-rose-200/25 group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_-18px_rgba(216,170,220,0.35)] sm:rounded-3xl">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
            <span className="bg-gradient-to-r from-rose-200/40 via-fuchsia-200/40 to-violet-200/40 bg-clip-text text-sm tracking-widest text-transparent">
              shh.
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="scale-75 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-transform duration-300 group-hover:scale-100">
            <Play size={18} className="fill-white text-white" strokeWidth={0} />
          </div>
        </div>

        <div className="absolute left-2.5 top-2.5">
          {!video.video_url ? (
            <Badge>coming soon</Badge>
          ) : (
            isNew && <Badge tone="accent">new</Badge>
          )}
        </div>
        {video.featured && (
          <div className="absolute right-2.5 top-2.5">
            <Badge tone="accent">featured</Badge>
          </div>
        )}

        {showGlint && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2.5 right-2.5 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-70"
          >
            🤏
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 text-[15px] font-medium text-ink">{video.title}</h3>
        <span className="text-xs text-zinc-600">{formatDate(video.created_at)}</span>
      </div>
    </Link>
  );
}
