# Color System

Inspired by Material 3's tonal palette model and Geist's restrained palette. Colors are defined as **semantic roles**, not hex values. Each role maps to CSS custom properties that shift between light and dark mode.

---

## Color roles

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `background` | Page canvas | `#FAFBFC` | `#0A0A0B` |
| `foreground` | Primary text | `#0D0D0E` | `#EDEDED` |
| `card` | Surface above background | `#FFFFFF` | `#111113` |
| `card-foreground` | Text on card | `#0D0D0E` | `#EDEDED` |
| `popover` | Menus, tooltips | `#FFFFFF` | `#1A1A1C` |
| `primary` | Brand accent, CTAs | `#3E54D3` | `#5B6EE8` |
| `primary-foreground` | Text on primary | `#FFFFFF` | `#FFFFFF` |
| `muted` | Subtle fills | `#F2F3F5` | `#1C1C1F` |
| `muted-foreground` | Secondary text, labels | `#6B7280` | `#8B8FA4` |
| `border` | Dividers, outlines | `#E5E7EB` | `#2A2A2E` |
| `input` | Input borders | `#D1D5DB` | `#3A3A3E` |
| `destructive` | Errors, deletions | `#DC2626` | `#EF4444` |

---

## Semantic state colors

These are used for status badges, indicators, and alerts. Never use raw Tailwind color utilities like `bg-red-100` — always use these semantic tokens.

| Semantic | Light bg | Light text | Dark text |
|---|---|---|---|
| `success` | `emerald-500/10` | `emerald-700` | `emerald-400` |
| `warning` | `amber-500/10` | `amber-700` | `amber-400` |
| `danger` | `red-500/10` | `red-700` | `red-400` |
| `info` | `blue-500/10` | `blue-700` | `blue-400` |
| `purple` | `purple-500/10` | `purple-700` | `purple-400` |
| `mint` | `teal-500/10` | `teal-700` | `teal-400` |
| `coral` | `orange-500/10` | `orange-700` | `orange-400` |

---

## Palette themes

Three named palettes layer on top of the base system:

### Default
The base system. Respects the user's light/dark mode preference.

### Midnight Slate
A deep navy dark mode designed for focused work.
- Background: `#0D1117` (GitHub-inspired deep navy)
- Primary: `#4F6EF7` (electric indigo)
- Card: `#161B22`
- Accent: electric indigo that stays vibrant on dark backgrounds

### Warm Sand
A warm light mode for a grounded, premium feel.
- Background: `#FAF7F2` (off-white with warmth)
- Primary: `#C1440E` (terracotta)
- Foreground: `#1C1410`
- Border: `#E8E0D5`

---

## CSS custom property pattern

All colors are defined as HSL values without the `hsl()` wrapper, allowing Tailwind opacity utilities to compose them:

```css
--primary: 234 90% 65%;
/* Usage: */
/* bg-primary          → background: hsl(var(--primary)) */
/* bg-primary/10       → background: hsl(var(--primary) / 0.1) */
/* text-primary/70     → color: hsl(var(--primary) / 0.7) */
```

---

## Rules

- **Never hardcode** a hex value or Tailwind color literal in a component (`bg-red-100`, `text-gray-500`, etc.)
- Use `hsl(var(--token))` in CSS or `text-foreground`, `bg-card`, etc. in Tailwind
- Entity status/priority colors always go through `StatusPill`/`PriorityPill` (registry-driven via `@/lib/statusTone`) — never hardcode a status color one-off
- Adding a new semantic color? Define it in all three palette themes simultaneously
