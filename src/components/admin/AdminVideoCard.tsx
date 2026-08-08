import Image from "next/image";
import { Pencil, Star, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/cn";
import type { Video } from "@/types/video";

export default function AdminVideoCard({
  video,
  onEdit,
  onDelete,
}: {
  video: Video;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors hover:border-white/20">
      <div className="shimmer relative aspect-video bg-zinc-900">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
            <span className="bg-gradient-to-r from-rose-200/40 via-fuchsia-200/40 to-violet-200/40 bg-clip-text text-sm tracking-widest text-transparent">
              shh.
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                video.visibility === "public" ? "bg-emerald-400/80" : "bg-violet-300/80"
              )}
            />
            {video.visibility}
          </span>
          {video.featured && (
            <span className="flex items-center gap-1 rounded-full border border-rose-200/20 bg-gradient-to-r from-rose-400/20 to-violet-400/20 px-2.5 py-1 text-[11px] font-medium text-rose-100 backdrop-blur-sm">
              <Star size={10} strokeWidth={2} className="fill-current" />
              featured
            </span>
          )}
        </div>

        {!video.video_url && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
            coming soon
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
          <button
            onClick={onEdit}
            aria-label="Edit video"
            className="rounded-full border border-white/20 bg-white/10 p-2.5 text-zinc-100 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <Pencil size={15} strokeWidth={1.75} />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete video"
            className="rounded-full border border-white/20 bg-white/10 p-2.5 text-zinc-100 backdrop-blur-md transition-colors hover:border-rose-300/40 hover:bg-rose-500/20 hover:text-rose-200"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="line-clamp-1 text-sm font-medium text-ink">{video.title}</h3>
        <span className="text-xs text-zinc-600">{formatDate(video.created_at)}</span>
      </div>
    </div>
  );
}
