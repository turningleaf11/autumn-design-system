# Typography

Geist-inspired: clean, neutral, functional. Type should never compete with content — it should organize it.

---

## Typefaces

| Role | Font | Source |
|---|---|---|
| UI (primary) | **Geist** | Vercel / Google Fonts |
| Monospace | **Geist Mono** | Vercel / Google Fonts |
| Fallback | `system-ui, -apple-system, sans-serif` | System |

> Geist is the primary face. It reads well at all sizes, has excellent numeral rendering (critical for dashboards), and carries a premium/minimal feel without being cold.

---

## Scale

Sizes are in `rem`. Base is `16px`.

| Token | Size | Weight | Usage |
|---|---|---|---|
| `display` | `2.25rem / 36px` | 700 | Hero headings, page titles |
| `h1` | `1.75rem / 28px` | 700 | Section headings |
| `h2` | `1.375rem / 22px` | 600 | Card headings, panel titles |
| `h3` | `1.125rem / 18px` | 600 | Sub-headings |
| `body-lg` | `1rem / 16px` | 400 | Primary body copy |
| `body` | `0.9375rem / 15px` | 400 | Default body, inputs |
| `body-sm` | `0.875rem / 14px` | 400 | Secondary body, descriptions |
| `label` | `0.75rem / 12px` | 500 | Labels, metadata |
| `caption` | `0.6875rem / 11px` | 500 | Eyebrows, tiny labels |
| `micro` | `0.625rem / 10px` | 600–700 | Badges, counts, chips |

---

## Eyebrow pattern

Section labels that appear above content titles. Always uppercase, tracked wide, muted color.

```
FONT-SIZE: 10px
FONT-WEIGHT: 700
LETTER-SPACING: 0.1em (tracking-widest)
COLOR: muted-foreground/50
TEXT-TRANSFORM: uppercase
```

Example: `ACTIVE DEALS  ·  PIPELINE`

---

## Rules

- **No inline font sizes** — use the scale tokens or Tailwind classes (`text-sm`, `text-xs`, etc.)
- Body text is `text-[15px]` (not `text-base` which is 16px) — this is a deliberate density choice
- Labels and metadata: `text-xs` (`12px`)
- Badge/micro text: `text-[10px]` or `text-[11px]`
- Avoid `font-light` — at small sizes it reads as low-quality
- Line height: body = `leading-relaxed` (1.625), headings = `leading-tight` (1.25)
- Tracking: headings get `tracking-tight`, eyebrows get `tracking-widest`

---

## Dark mode

Text doesn't simply invert. The dark palette uses slightly off-white for `foreground` (`#EDEDED`) to reduce eye strain. Muted text uses `#8B8FA4` rather than a harsh gray.
