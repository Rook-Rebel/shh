"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { formatDate } from "@/lib/formatDate";
import type { Video } from "@/types/video";

export default function Search({
  videos,
  onClose,
}: {
  videos: Video[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q)
    );
  }, [query, videos]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-950/85 px-4 py-[8vh] backdrop-blur-2xl sm:items-center sm:px-6 sm:py-10">
      <GlassPanel
        intensity="heavy"
        rounded="rounded-[28px]"
        className="panel-enter flex max-h-[76vh] w-full max-w-xl flex-col bg-zinc-950/70"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <SearchIcon size={19} className="shrink-0 text-rose-200/70" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search the evidence…"
            className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none sm:text-lg"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-100"
          >
            <X size={19} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {query.trim() === "" ? (
            <p className="py-14 text-center text-sm text-zinc-600">start typing to search</p>
          ) : results.length === 0 ? (
            <p className="py-14 text-center text-sm text-zinc-600">nothing. suspicious. 🤏</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map((video) => (
                <li key={video.id}>
                  <Link
                    href={`/watch/${video.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-xl border border-transparent px-2.5 py-2.5 transition-colors hover:border-white/10 hover:bg-white/5"
                  >
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                      {video.thumbnail_url && (
                        <Image
                          src={video.thumbnail_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{video.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-600">{formatDate(video.created_at)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
