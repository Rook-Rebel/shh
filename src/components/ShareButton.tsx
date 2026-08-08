"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import Toast from "@/components/ui/Toast";

export default function ShareButton({ title }: { title: string }) {
  const [toastVisible, setToastVisible] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Visitor cancelled the native share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2400);
    } catch {
      // Clipboard access unavailable — silently ignore.
    }
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-400 backdrop-blur-xl transition-all duration-200 active:scale-[0.97] hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-100"
      >
        <Share2 size={16} strokeWidth={1.75} />
        share
      </button>
      <Toast message="✓ copied. keep it quiet 🤏" visible={toastVisible} />
    </>
  );
}
