import { cn } from "@/lib/cn";

// Presentational floating toast. Parents own their own visible/message
// state and just render this — see ShareButton for the reference usage.
export default function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-6 transition-all duration-300 ease-out sm:bottom-10",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="rounded-full border border-white/15 bg-zinc-900/90 px-5 py-3 text-sm text-zinc-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {message}
      </div>
    </div>
  );
}
