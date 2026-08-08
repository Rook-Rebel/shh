import { Play } from "lucide-react";

// Sits nested inside a GlassPanel "frame" on the watch page, so this stays
// deliberately unadorned — no border/shadow of its own to avoid a
// glass-on-glass, border-on-border look.
export default function VideoPlayer({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) {
  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-white/[0.05] via-transparent to-transparent">
        <span className="bg-gradient-to-r from-rose-200/50 via-fuchsia-200/50 to-violet-200/50 bg-clip-text text-3xl font-medium tracking-tight text-transparent">
          shh.
        </span>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <Play size={12} strokeWidth={0} className="fill-current" />
          <p className="text-xs">coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <video controls playsInline className="aspect-video w-full rounded-3xl bg-black" aria-label={title}>
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
