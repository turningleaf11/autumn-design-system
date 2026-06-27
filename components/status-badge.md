# StatusBadge Component

**Reconciled with StatusPill** — these two used to overlap. StatusBadge shipped its own `TASK_STATUS_VARIANT`/`GOAL_STATUS_VARIANT`/`PROJECT_STATUS_VARIANT`/`PRIORITY_VARIANT` maps, duplicating what `statusTone.ts`'s registry now does — with no edit capability and a different, hardcoded Tailwind color palette (`bg-emerald-500`, `text-amber-700`, etc.) instead of the shared `TONE_HSL` tokens.

**Use `StatusPill` (and `PriorityPill`) instead** for any of the registered entity kinds: `goal` / `project` / `task` / `issue` / `deal` / `lead` / `transaction` / `contact` / `thread`. They're registry-driven (`@/lib/statusTone`), support an inline edit dropdown, and are what every page in this system actually uses.

**StatusBadge stays** for everything that *isn't* a registered entity status — one-off categorical labels like process-node types or improvement kinds (OpsHQ's process-mapping feature), where there's no "kind" in `statusTone.ts` and no edit-dropdown need. Tone variants (`success`/`warning`/`danger`/`info`/`purple`) now route through `TONE_HSL`, the same registry StatusPill and Toast use — "success" means the same green everywhere.

**Never use raw Tailwind badge classes.** Ensures dark mode and theme-switching work correctly everywhere.

---

## Variants

| Variant | Use for |
|---|---|
| `default` | Neutral, unknown, unset |
| `muted` | Inactive, archived, deselected |
| `primary` | Highlighted, branded |
| `success` | Complete, on-track, won, active |
| `warning` | Behind, needs attention, pending |
| `danger` | At risk, blocked, failed, critical |
| `info` | In progress, informational |
| `purple` | Ideas, initiatives, special category |
| `mint` | External, referral, inbound |
| `coral` | Outbound, warm, promotional |

---

## Props

```tsx
<StatusBadge
  label="In Progress"      // display text
  variant="info"           // see variants above
  size="sm"                // "xs" | "sm" | "md" (default: "sm")
  dot={false}              // show colored dot before label (default: false)
  icon={<Icon />}          // optional icon element before label
  className=""             // extra classes
/>
```

---

## Pre-built lookup maps

Only the non-entity maps remain here — entity status/priority lookups live in `@/lib/statusTone` (`listStatusOptions`, `listPriorityOptions`, `resolveStatusTone`) and are consumed via `StatusPill`/`PriorityPill`, not `StatusBadge`.

```tsx
import {
  StatusBadge,
  PROCESS_NODE_VARIANT,     // source/process/decision/outcome
  IMPROVEMENT_KIND_VARIANT, // idea/pain_point/observation/improvement
} from "@/components/shared/StatusBadge";
```

---

## Usage examples

```tsx
// Entity status — use StatusPill, not StatusBadge
<StatusPill kind="task" value={task.status} onChange={setStatus} />

// Process node type — no statusTone.ts equivalent, StatusBadge is correct here
<StatusBadge label="Decision" variant={PROCESS_NODE_VARIANT.decision} dot />

// Custom one-off category
<StatusBadge label="Wholesale" variant="mint" size="xs" />
```

---

## What NOT to do

```tsx
// ❌ Hardcoded colors break dark mode
<Badge className="bg-red-100 text-red-700">High</Badge>

// ❌ Conditional classes are fragile and not reusable
<span className={priority === "high" ? "text-red-600" : "text-gray-500"}>

// ✅ Always use StatusBadge
<StatusBadge label="High" variant="danger" dot />
```

---

## Adding new variants

1. Add the variant key to `BadgeVariant` union type in `StatusBadge.tsx`
2. Add a CSS class string to `VARIANT_CLS` — must use semantic tokens, not hardcoded colors
3. Document it here under Variants
4. If it maps to a data field, add a lookup map (`MY_FIELD_VARIANT`)
