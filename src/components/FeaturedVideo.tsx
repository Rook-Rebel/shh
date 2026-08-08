"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/formatDate";
import type { Video } from "@/types/video";

export default function FeaturedVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Extremely subtle magnetic pull on the play button — desktop hover only,
  // capped to a few px so it reads as alive rather than gimmicky.
  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * 16, y: relY * 16 });
  }

  return (
    <Link
      ref={ref}
      href={`/watch/${video.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className="sheen sheen-accent shimmer group relative block aspect-video overflow-hidden rounded-[30px] border border-white/10 bg-zinc-900 transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_70px_-20px_rgba(198,180,255,0.25)] sm:rounded-[36px]"
    >
      {video.thumbnail_url ? (
        <Image
          src={video.thumbnail_url}
          alt={video.title}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1422] via-zinc-900 to-zinc-950">
          <span className="bg-gradient-to-r from-rose-200/30 via-fuchsia-200/30 to-violet-200/30 bg-clip-text text-2xl tracking-widest text-transparent">
            shh.
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-9">
        <Badge tone="accent" className="w-fit">
          featured
        </Badge>
        <h2 className="mt-1 max-w-xl text-2xl font-medium text-ink sm:text-3xl">{video.title}</h2>
        {video.description && (
          <p className="max-w-lg line-clamp-2 text-sm leading-relaxed text-zinc-300/80 sm:text-[15px]">
            {video.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
          <span>{formatDate(video.created_at)}</span>
          <span aria-hidden>·</span>
          <span>watch</span>
        </div>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <div className="rounded-full border border-white/25 bg-white/10 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Play size={26} className="fill-white text-white" strokeWidth={0} />
        </div>
      </div>
    </Link>
  );
}
