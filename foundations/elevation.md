# Elevation & Shadow

Elevation communicates hierarchy: what's on top of what. We use a three-level system — subtle, lifted, floating — rather than many distinct shadow values.

---

## Levels

| Level | CSS | Tailwind | Usage |
|---|---|---|---|
| `0` (flat) | none | — | Inline elements, table rows |
| `1` (subtle) | `0 1px 3px rgba(0,0,0,0.08)` | `shadow-sm` | Cards at rest |
| `2` (lifted) | `0 4px 12px rgba(0,0,0,0.10)` | `shadow-md` | Cards on hover, dropdowns |
| `3` (floating) | `0 8px 24px rgba(0,0,0,0.14)` | `shadow-lg` | Modals, sheets, popovers |
| `4` (overlay) | `0 16px 48px rgba(0,0,0,0.20)` | `shadow-xl` | Command palettes, spotlight |

---

## Dark mode adjustment

Dark backgrounds make shadows invisible. On dark mode, elevation is communicated through **background lightness** instead:

| Level | Dark bg lightness (HSL L%) |
|---|---|
| Base | 5% (background) |
| Card | 10% (card) |
| Popover | 12% (popover) |
| Modal | 14% |

Dark mode shadows use `rgba(0,0,0,0.4)` — higher opacity to compensate for dark surroundings.

---

## Hover lift

Cards that are click targets get a micro-lift on hover:

```css
transition: transform 150ms ease, box-shadow 150ms ease;
hover: -translate-y-px shadow-lg
```

This is a signature interaction pattern across all products. It signals "this is clickable" without a cursor change alone.

---

## Rules

- Flat elements never have shadow — if it's flat, it's not elevated
- Only interactive surfaces lift on hover (cards, buttons) — static surfaces stay flat
- Never stack more than 3 elevation levels in a single view (background → card → modal is the max)
- Popover/dropdown shadows are always level 3 or 4
