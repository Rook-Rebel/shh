import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// The three glass intensities used across the site. Exported so elements
// that can't be a <div> (Link, button, nav) can still apply the same look.
export const glassIntensity = {
  soft: "border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  card: "border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)]",
  heavy: "border border-white/[0.12] bg-white/[0.07] backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
} as const;

export type GlassIntensity = keyof typeof glassIntensity;

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  rounded?: string;
  reflection?: boolean;
}

// A layered glass surface: translucent tint, backdrop blur, hairline border,
// soft outer shadow, an inner top-edge highlight, and a faint gradient wash
// in the upper portion — reads as dark smoked glass, never frosted white.
export default function GlassPanel({
  intensity = "card",
  rounded = "rounded-3xl",
  reflection = true,
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div className={cn("relative overflow-hidden", rounded, glassIntensity[intensity], className)} {...props}>
      {reflection && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] via-white/[0.015] to-transparent"
        />
      )}
      {children}
    </div>
  );
}
