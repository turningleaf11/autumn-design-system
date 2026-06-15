# StatusBadge Component

The canonical way to render any status, priority, type, or category label across all products.

**Never use raw Tailwind badge classes.** This component is the single source of truth for badge styling and ensures dark mode works correctly everywhere.

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

These maps live in `StatusBadge.tsx` and should be imported wherever you need them:

```tsx
import {
  StatusBadge,
  TASK_STATUS_VARIANT,   // todo/in_progress/on_track/behind/at_risk/blocked/done
  PRIORITY_VARIANT,      // high/1/medium/2/low/3
  PRIORITY_LABEL,        // high → "High" etc.
  PROCESS_NODE_VARIANT,  // source/process/decision/outcome
  IMPROVEMENT_KIND_VARIANT, // idea/pain_point/observation/improvement
} from "@/components/shared/StatusBadge";
```

---

## Usage examples

```tsx
// Task status
<StatusBadge label="In Progress" variant={TASK_STATUS_VARIANT[task.status]} />

// Priority with dot
<StatusBadge
  label={PRIORITY_LABEL[task.priority]}
  variant={PRIORITY_VARIANT[task.priority]}
  dot
/>

// Custom
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
