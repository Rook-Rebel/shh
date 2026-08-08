"use client";

import { useState, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "shh:likedVideos";
const LIKES_CHANGED_EVENT = "shh:likes-changed";

function getLikedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(LIKES_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LIKES_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot() {
  return false;
}

export default function LikeButton({ videoId }: { videoId: string }) {
  const liked = useSyncExternalStore(subscribe, () => getLikedIds().includes(videoId), getServerSnapshot);
  const [popping, setPopping] = useState(false);

  function toggleLike() {
    const ids = new Set(getLikedIds());
    if (ids.has(videoId)) {
      ids.delete(videoId);
    } else {
      ids.add(videoId);
      setPopping(true);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    window.dispatchEvent(new Event(LIKES_CHANGED_EVENT));
  }

  return (
    <button
      onClick={toggleLike}
      aria-pressed={liked}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium backdrop-blur-xl transition-all duration-200 active:scale-[0.97]",
        liked
          ? "border-rose-200/20 bg-gradient-to-r from-rose-400/20 to-fuchsia-400/20 text-rose-100 shadow-[0_8px_24px_-8px_rgba(244,114,182,0.35)]"
          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-100"
      )}
    >
      <Heart
        size={16}
        strokeWidth={1.75}
        onAnimationEnd={() => setPopping(false)}
        className={cn(liked && "fill-rose-200 text-rose-200", popping && "like-pop")}
      />
      {liked ? "liked" : "like"}
    </button>
  );
}
