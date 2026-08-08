import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export default function SectionHeader({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("mb-6 text-sm font-medium tracking-wide text-ink-soft/70", className)} {...props}>
      {children}
    </h2>
  );
}
