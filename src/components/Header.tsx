"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Search as SearchIcon } from "lucide-react";
import Search from "@/components/Search";
import { glassIntensity } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";
import type { Video } from "@/types/video";

export default function Header({ videos }: { videos: Video[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
        <div
          className={cn(
            "relative mx-auto flex w-fit max-w-2xl items-center gap-6 rounded-full transition-all duration-300",
            glassIntensity.soft,
            scrolled
              ? "bg-zinc-950/75 px-4 py-2.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.65)]"
              : "bg-zinc-950/40 px-5 py-3"
          )}
        >
          <Link href="/" aria-label="shh." className="group relative shrink-0">
            <span aria-hidden="true" className="bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200 bg-clip-text text-lg font-medium tracking-tight text-transparent">
              shh.
            </span>
            <span
              aria-hidden="true"
              className="logo-glint pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-xs"
            >
              🤏
            </span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              <SearchIcon size={16} strokeWidth={1.75} />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-sans text-[10px] text-zinc-600">
                ⌘K
              </kbd>
            </button>
            <Link
              href="/admin"
              className="group/admin flex items-center gap-1.5 px-2.5 py-2 text-xs text-zinc-600 transition-colors hover:text-zinc-300"
            >
              admin
              <Lock
                size={11}
                strokeWidth={2}
                className="scale-0 opacity-0 transition-all duration-200 group-hover/admin:scale-100 group-hover/admin:opacity-100"
              />
            </Link>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
        </div>
      </header>

      {searchOpen && <Search videos={videos} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
