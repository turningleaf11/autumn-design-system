// StatusPill — the ONE control the entire app uses for entity status.
//
// Usage:  <StatusPill kind="deal" value={deal.status} />                          (read-only)
//         <StatusPill kind="task" value={task.status} onChange={setStatus} />     (editable dropdown)
//
// All status values across goals / projects / tasks / deals / leads /
// transactions / issues / contacts route through one registry so a
// "Won" deal looks identical to a "Done" task looks identical to a
// "Completed" project — same tone, same shape, same density.
//
// Visual: soft pastel background (~15% saturation), colored dot prefix,
// rounded-md (not a pill — see foundations/spacing.md, chips use the `sm`
// radius token, 6px). When `onChange` is passed it becomes a dropdown
// trigger with a chevron, so status can be edited inline anywhere this
// renders (tables, card headers, sheet headers) instead of only in a
// dedicated edit form.

import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveStatusTone, listStatusOptions, type EntityKind } from "@/lib/statusTone";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface StatusPillProps {
  kind: EntityKind;
  value: string | null | undefined;
  /** Override the displayed label (defaults to the registry label). */
  label?: string;
  /** Smaller variant for dense lists. */
  size?: "sm" | "md";
  /** Hide the colored dot prefix (rare — usually keep it). */
  hideDot?: boolean;
  /** Pass to make this an editable dropdown instead of a static pill. */
  onChange?: (value: string) => void;
  className?: string;
}

export function StatusPill({
  kind, value, label, size = "md", hideDot = false, onChange, className,
}: StatusPillProps) {
  if (!value && !onChange) return null;
  const { hsl, label: registryLabel } = value
    ? resolveStatusTone(kind, value)
    : { hsl: "220 12% 55%", label: "Set status" };
  const display = label ?? registryLabel;

  const sizeClasses = size === "sm" ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-[11px]";
  const dotSize = size === "sm" ? 5 : 6;

  const pill = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap",
        sizeClasses,
        onChange && "cursor-pointer hover:brightness-95 transition-[filter]",
        className,
      )}
      style={{
        backgroundColor: `hsl(${hsl} / 0.13)`,
        color: `hsl(${hsl})`,
      }}
    >
      {!hideDot && (
        <span
          className="inline-block rounded-full shrink-0"
          style={{ width: dotSize, height: dotSize, backgroundColor: `hsl(${hsl})` }}
        />
      )}
      <span className="capitalize leading-none">{display}</span>
      {onChange && <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />}
    </span>
  );

  if (!onChange) return pill;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">{pill}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {listStatusOptions(kind).map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => onChange(opt.value)} className="justify-between">
            <span className="flex items-center gap-2">
              <span className="inline-block rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: `hsl(${opt.hsl})` }} />
              {opt.label}
            </span>
            {value === opt.value && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
