"use client";

import { useEffect } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlassButton from "@/components/ui/GlassButton";

export default function ConfirmDeleteModal({
  video,
  onCancel,
  onConfirm,
}: {
  video: { title: string } | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!video) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [video, onCancel]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/80 px-6 backdrop-blur-md"
      onClick={onCancel}
    >
      <GlassPanel
        intensity="heavy"
        className="panel-enter w-full max-w-sm p-7 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-base font-medium text-ink">delete this?</p>
        <p className="mt-1.5 text-sm text-zinc-500">there&rsquo;s no undo.</p>
        <p className="mt-4 line-clamp-1 text-xs text-zinc-600">&ldquo;{video.title}&rdquo;</p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <GlassButton type="button" variant="ghost" onClick={onCancel}>
            cancel
          </GlassButton>
          <GlassButton type="button" variant="danger" onClick={onConfirm}>
            delete
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
}
