# Spacing & Layout

Consistent rhythm makes an interface feel premium. A chaotic spacing system — mixing `p-2`, `p-3`, `p-4`, `p-5`, `p-6` at random — looks amateur. We use a defined rhythm.

---

## Base unit

`4px` (Tailwind's default). Everything is a multiple of 4.

---

## Spacing scale (common values)

| Token | px | Tailwind | Usage |
|---|---|---|---|
| `xs` | 4px | `p-1` | Icon padding, tight chips |
| `sm` | 8px | `p-2` | Inner badge/pill padding |
| `md` | 12px | `p-3` | Compact row padding |
| `lg` | 16px | `p-4` | Default element padding |
| `xl` | 20px | `p-5` | Card inner padding |
| `2xl` | 24px | `p-6` | Section inner padding |
| `3xl` | 32px | `p-8` | Page-level gaps |

---

## Card padding

Cards use `p-5` (20px) as the standard inner padding. Compact variants use `p-3` (12px). Never mix padding within a card grid.

---

## Gap rhythm

| Context | Gap |
|---|---|
| Inline elements (badges, chips) | `gap-1.5` (6px) |
| Form fields, stacked rows | `gap-3` (12px) |
| Card grids | `gap-4` (16px) |
| Section-to-section | `gap-6` (24px) |
| Page sections | `gap-8` (32px) |

---

## Layout grid

Page content lives inside a `max-w-7xl` container with `px-6` on mobile, `px-8` on desktop. Side panels are `320px` (narrow) or `680px` (detail sheets).

---

## Border radius

| Token | Value | Usage |
|---|---|---|
| `sm` | `6px` | Chips, badges, small buttons |
| `md` | `8px` | Inputs, compact cards |
| `lg` | `12px` | Cards, panels, modals |
| `xl` | `16px` | Large cards, featured areas |
| `full` | `9999px` | Pills, avatars |

Tailwind equivalents: `rounded` = 4px, `rounded-md` = 6px, `rounded-lg` = 8px, `rounded-xl` = 12px, `rounded-2xl` = 16px.

In practice we use `rounded-xl` (12px) for most cards and `rounded-lg` (8px) for inputs and compact surfaces.
