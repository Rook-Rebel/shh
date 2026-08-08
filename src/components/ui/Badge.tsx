import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const tones = {
  neutral: "border-white/10 bg-black/50 text-zinc-300",
  accent: "border-rose-200/20 bg-gradient-to-r from-rose-400/20 to-violet-400/20 text-rose-100",
} as const;

export type BadgeTone = keyof typeof tones;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export default function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
