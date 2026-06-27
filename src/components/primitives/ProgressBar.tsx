// ProgressBar — the canonical "% complete" bar. Used in Goal Page's
// Overview tab and the Dashboard's goal-progress widget; pulled out as a
// shared primitive rather than redefined per page.

import { cn } from "@/lib/utils";

interface Props {
  /** 0-100 */
  value: number;
  /** HSL triplet string, e.g. "152 65% 42%". Defaults to primary. */
  hsl?: string;
  className?: string;
}

export function ProgressBar({ value, hsl, className }: Props) {
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-muted overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: hsl ? `hsl(${hsl})` : "hsl(var(--primary))" }}
      />
    </div>
  );
}
