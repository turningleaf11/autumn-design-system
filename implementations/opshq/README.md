# OpsHQ — Design System Implementation

OpsHQ is the central business operating system. It uses the full Autumn Design System with no overrides to the base tokens.

---

## Stack

- React + TypeScript + Vite
- Tailwind CSS (CSS variables mapped to design tokens)
- shadcn/ui (base components)
- TipTap (rich text)
- React Flow / @xyflow (process mapping)
- Supabase (multi-tenant backend)

---

## Token mapping

OpsHQ's `src/index.css` implements the full token set as CSS custom properties. The three palette themes (Default, Midnight Slate, Warm Sand) are defined there.

See: `evergreenops/src/index.css`

---

## Shared components

| Component | Path | Notes |
|---|---|---|
| StatusBadge | `src/components/shared/StatusBadge.tsx` | All badge/pill rendering |
| RichTextEditor | `src/components/RichTextEditor.tsx` | TipTap wrapper |
| SlashCommandMenu | `src/components/SlashCommandMenu.tsx` | / commands in editor |

---

## Design decisions specific to OpsHQ

- **Left border accent** on all cards communicates record type (node_type color)
- **Step cards** have a short description subtitle — this comes from the `description` field on `process_buckets`
- **Detail sheets** use a tabbed layout: Overview / Notes / Map / Docs
- **Theme palette** is per-user, stored in `localStorage` as `"app-palette"` and applied via class on `<html>`

---

## DB conventions

- Every query includes `workspace_id` filter — multi-tenant
- Use `profiles.user_id` (not `profiles.id`) to join to auth.users
- `process_buckets.description` = short plain text subtitle shown on cards
- `process_buckets.notes` = rich HTML from TipTap, shown in Notes tab
