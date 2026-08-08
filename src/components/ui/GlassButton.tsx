import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-gradient-to-r from-rose-300 to-violet-300 text-zinc-950 shadow-[0_8px_24px_-8px_rgba(244,168,199,0.45)] hover:from-rose-200 hover:to-violet-200",
  ghost:
    "border border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.08] hover:text-zinc-100",
  danger:
    "border border-rose-200/15 bg-rose-500/[0.06] text-rose-300/80 backdrop-blur-xl hover:border-rose-300/30 hover:bg-rose-500/15 hover:text-rose-200",
} as const;

export type GlassButtonVariant = keyof typeof variants;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 disabled:cursor-not-allowed";

// Shared class string for elements that can't be a <button> (Link, label).
export function glassButtonClass(variant: GlassButtonVariant = "ghost", className?: string) {
  return cn(base, variants[variant], className);
}

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
}

export default function GlassButton({ variant = "ghost", className, children, ...props }: GlassButtonProps) {
  return (
    <button className={glassButtonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}
