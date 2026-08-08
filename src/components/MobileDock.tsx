"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Search as SearchIcon } from "lucide-react";
import Search from "@/components/Search";
import { glassIntensity } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";
import type { Video } from "@/types/video";

// Premium-app-style bottom navigation for small screens, replacing a
// squeezed desktop header. Admin lives one tap deeper, behind the 🤏
// menu, rather than competing for space in the primary row.
export default function MobileDock({ videos }: { videos: Video[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] z-40 flex justify-center px-6 sm:hidden">
        <div className={cn("flex items-center gap-1 rounded-full bg-zinc-950/70 px-2 py-2", glassIntensity.heavy)}>
          <Link
            href="/"
            aria-label="Home"
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition-colors active:scale-95 hover:bg-white/5 hover:text-zinc-100"
          >
            <Home size={19} strokeWidth={1.75} />
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition-colors active:scale-95 hover:bg-white/5 hover:text-zinc-100"
          >
            <SearchIcon size={19} strokeWidth={1.75} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="More"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition-transform active:scale-95"
            >
              🤏
            </button>

            {menuOpen && (
              <div
                className={cn(
                  "absolute bottom-full right-0 z-50 mb-3 min-w-28 overflow-hidden rounded-2xl bg-zinc-950/90 p-1.5",
                  glassIntensity.heavy
                )}
              >
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-100"
                >
                  admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {searchOpen && <Search videos={videos} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
