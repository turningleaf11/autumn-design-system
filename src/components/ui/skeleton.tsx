// Skeleton — loading placeholder that mirrors the shape of real content.
// Per foundations/motion.md: "Skeleton loaders preferred over spinners for
// content areas — they maintain layout shape." Spinners (animate-spin) are
// still right for secondary/inline loading (e.g. inside a button).

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
