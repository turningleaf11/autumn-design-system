import { cn } from "@/lib/utils";
import { TONE_HSL } from "@/lib/statusTone";

// ── Generic categorical-chip primitive ─────────────────────────
//
// StatusBadge vs StatusPill — these used to overlap (StatusBadge shipped
// its own TASK_STATUS_VARIANT/GOAL_STATUS_VARIANT/PROJECT_STATUS_VARIANT/
// PRIORITY_VARIANT maps, duplicating statusTone.ts's registry with no edit
// capability and a different hardcoded color palette). Reconciled:
//
// - **StatusPill** (primitives/StatusPill.tsx) is canonical for any of the
//   registered EntityKinds in statusTone.ts (goal/project/task/issue/deal/
//   lead/transaction/contact/thread) — it's registry-driven, supports the
//   inline edit dropdown, and is what every page in this system actually
//   uses. Same for **PriorityPill** and task/deal/etc. priority.
// - **StatusBadge** stays for everything that ISN'T a registered entity
//   status — one-off categorical labels like process-node types or
//   improvement kinds (OpsHQ's process-mapping feature), where there's no
//   "kind" in statusTone.ts and no edit-dropdown need. It's a lower-level
//   variant-chip primitive, not a competing status system.
//
// Tone colors route through TONE_HSL (the same registry StatusPill/Toast
// use) instead of hardcoded Tailwind palette classes — "success" means the
// same green everywhere, which wasn't true before this reconciliation.

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "primary"
  | "purple"
  | "mint"
  | "coral";

const TONE_VARIANT: Partial<Record<BadgeVariant, keyof typeof TONE_HSL>> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  purple: "accent",
};

const STATIC_VARIANT_CLS: Partial<Record<BadgeVariant, string>> = {
  default: "bg-muted/60 text-muted-foreground border-border/30",
  muted: "bg-muted/40 text-muted-foreground/70 border-border/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  mint: "bg-[hsl(var(--brand-mint)/0.12)] text-[hsl(var(--brand-mint-deep))] border-[hsl(var(--brand-mint)/0.25)]",
  coral: "bg-[hsl(var(--brand-coral)/0.10)] text-[hsl(var(--brand-coral))] border-[hsl(var(--brand-coral)/0.20)]",
};

// ── Non-entity categorical maps — no statusTone.ts equivalent ──

export const PROCESS_NODE_VARIANT: Record<string, BadgeVariant> = {
  source: "success",
  process: "info",
  decision: "warning",
  outcome: "purple",
};

export const IMPROVEMENT_KIND_VARIANT: Record<string, BadgeVariant> = {
  idea: "purple",
  pain_point: "danger",
  observation: "info",
  improvement: "success",
};

// ── Component ─────────────────────────────────────────────────

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "xs" | "sm";
  dot?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function StatusBadge({ label, variant = "default", size = "sm", dot = false, className, icon }: StatusBadgeProps) {
  const tone = TONE_VARIANT[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium leading-none",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        !tone && STATIC_VARIANT_CLS[variant],
        className,
      )}
      style={tone ? { backgroundColor: `hsl(${TONE_HSL[tone]} / 0.1)`, color: `hsl(${TONE_HSL[tone]})`, borderColor: `hsl(${TONE_HSL[tone]} / 0.2)` } : undefined}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </span>
  );
}
