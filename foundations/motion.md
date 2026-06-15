# Motion

Motion should feel responsive, not decorative. Every animation should have a reason — feedback, orientation, or hierarchy. Avoid motion for motion's sake.

---

## Principles

1. **Fast in, slow out** — elements appear quickly, exit gracefully
2. **Easing over linear** — linear motion feels robotic; ease functions feel physical
3. **Short durations** — UI interactions: 100–200ms. Larger transitions: 250–350ms. Never exceed 400ms for UI feedback.
4. **Respect reduced motion** — always wrap non-essential animations in `@media (prefers-reduced-motion: reduce)`

---

## Duration scale

| Token | Duration | Usage |
|---|---|---|
| `instant` | 0ms | State changes with no visual delay needed |
| `fast` | 100ms | Hover states, opacity micro-transitions |
| `base` | 150ms | Button presses, card hover lifts |
| `moderate` | 200ms | Dropdowns opening, badge changes |
| `slow` | 300ms | Panels sliding in, modals appearing |
| `deliberate` | 400ms | Page transitions, large layout shifts |

---

## Easing

| Token | Curve | CSS | Usage |
|---|---|---|---|
| `ease-out` | Decelerate | `cubic-bezier(0, 0, 0.2, 1)` | Most UI elements entering |
| `ease-in` | Accelerate | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |
| `ease-in-out` | Natural | `cubic-bezier(0.4, 0, 0.2, 1)` | Repositioning, layout shifts |
| `spring` | Overshoot | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Micro-delight moments only |

---

## Common patterns

### Hover lift (cards)
```css
transition: transform 150ms ease-out, box-shadow 150ms ease-out;
:hover { transform: translateY(-1px); }
```

### Fade in
```css
animation: fadeIn 150ms ease-out;
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

### Slide-in sheet (right)
```css
transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
transform: translateX(100%);
:open { transform: translateX(0); }
```

### Dropdown appear
```css
animation: scaleIn 150ms ease-out;
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```

---

## Rules

- Loading spinners: use `animate-spin` on an icon, not a full-page overlay, for secondary loading states
- Skeleton loaders preferred over spinners for content areas — they maintain layout shape
- Toast notifications: slide in from bottom, auto-dismiss at 4s, 200ms fade out
- Never animate color alone — pair it with opacity or transform for performance
