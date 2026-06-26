# Elevation & Shadow

Elevation communicates hierarchy: what's on top of what. We use a three-level system — subtle, lifted, floating — rather than many distinct shadow values.

---

## Levels

| Level | CSS | Tailwind | Usage |
|---|---|---|---|
| `0` (flat) | none | — | Inline elements, table rows |
| `1` (subtle) | tinted, see below | `shadow-card-lift` | Cards at rest |
| `2` (lifted) | tinted, see below | `shadow-card-lift-hover` | Cards on hover |
| `2` (lifted, generic) | `0 4px 12px rgba(0,0,0,0.10)` | `shadow-md` | Dropdowns |
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

## Card: tinted lift, not neumorphism or generic shadows

Decided 2026-06-25, after comparing three directions in Storybook (tinted-shadow lift, glass, light neumorphism) across all four themes.

Card uses a tinted shadow recipe (`shadow-card-lift` / `shadow-card-lift-hover` in `tailwind.config.ts`) instead of a flat black-opacity shadow — the shadow picks up the ambient violet/primary hue so it reads as genuinely "lifted" rather than just dark. Neumorphism (dual light/dark emboss shadows) was tried and rejected: it depends on a near-flat single-color background to read correctly, and in dark mode / Midnight Slate the white highlight shadow turns into a glowing halo instead of a soft emboss. It only worked in the two light themes — not viable across a 4-theme system.

**Glass is reserved for overlay surfaces** (Dialog, DropdownMenu, Popover) that float above the ambient backdrop — not for base Cards. Recipe: `background: hsl(var(--card) / 0.55)`, `backdrop-filter: blur(20px) saturate(160%)`, border `hsl(var(--border) / 0.35)`, shadow `0 8px 32px hsl(var(--foreground) / 0.12)`. This held up well across all four themes in testing and is the planned treatment when DropdownMenu/Popover get built.

`Card` takes an `interactive` prop — only click-target cards (list items, project cards) get the hover lift:

```css
transition: transform 150ms ease, box-shadow 150ms ease;
hover: -translate-y-0.5 shadow-card-lift-hover
```

This is a signature interaction pattern across all products. It signals "this is clickable" without a cursor change alone. Static containers (forms, static panels) leave `interactive` off and stay at rest.

---

## Rules

- Flat elements never have shadow — if it's flat, it's not elevated
- Only interactive surfaces lift on hover (cards, buttons) — static surfaces stay flat
- Never stack more than 3 elevation levels in a single view (background → card → modal is the max)
- Popover/dropdown shadows are always level 3 or 4
