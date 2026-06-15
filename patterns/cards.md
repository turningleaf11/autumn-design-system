# Card Patterns

Cards are the most common surface across all products. They must be consistent, click-able where appropriate, and premium in feel.

---

## Anatomy

```
┌─ border-left accent (3px, color-coded) ───────────────────────┐
│  [eyebrow label]                              [...] menu       │
│                                                                │
│  Card Title                                                    │
│  Subtitle / description (muted, smaller)                       │
│                                                                │
│  [badge]  [badge]              [avatar] Owner name            │
└────────────────────────────────────────────────────────────────┘
```

---

## Variants

### Standard click-target card

Used for process steps, tasks, projects, issues — anything that opens a detail view.

```tsx
<div
  className="group relative rounded-xl border bg-card cursor-pointer
             border-border/40 hover:border-border/60
             hover:shadow-lg hover:shadow-black/[0.06] hover:-translate-y-px
             transition-all duration-150"
  style={{ borderLeft: `3px solid ${accentColor}` }}
  onClick={onOpen}
>
  <div className="p-5">
    {/* eyebrow */}
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">
      {eyebrow}
    </p>
    {/* title */}
    <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
      {title}
    </h3>
    {/* description */}
    {description && (
      <p className="mt-1 text-[13px] text-muted-foreground/60 line-clamp-2">
        {description}
      </p>
    )}
    {/* footer row */}
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      {badges}
      <div className="ml-auto">{owner}</div>
    </div>
  </div>
</div>
```

### Three-dot menu

Cards with actions get a `...` menu that appears on hover. The menu is always in the top-right corner of the card.

```tsx
<div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
  <button
    onClick={() => setShowMenu(v => !v)}
    className="p-1.5 rounded-lg hover:bg-foreground/6 text-foreground/20 hover:text-foreground/60
               opacity-0 group-hover:opacity-100 transition-all"
  >
    <MoreHorizontal className="h-4 w-4" />
  </button>
  {showMenu && <DropdownMenu />}
</div>
```

---

## Rules

- **Cards are click targets, not expandable** — clicking opens a detail sheet/modal, never expands inline
- **No "quick edit" inside cards** — if the user needs to edit, open the detail sheet
- **Accent left border** is always `3px solid {color}` — communicates type/status at a glance
- **Hover lift** is required on all click-target cards: `-translate-y-px shadow-lg`
- **Description on the card** is a short plain-text subtitle (1–2 lines), always `line-clamp-2`
- **Rich content** (notes, images, files) lives in the detail sheet, never on the card
- Empty state: cards are never rendered empty — show a proper empty state component instead

---

## Empty states

Every card grid needs an empty state when there's no data:

```tsx
{items.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon className="h-8 w-8 text-muted-foreground/20 mb-3" />
    <p className="text-sm text-muted-foreground/50">No {itemName} yet</p>
    <p className="text-xs text-muted-foreground/30 mt-1">
      {actionHint}
    </p>
  </div>
)}
```

---

## Anti-patterns

| What | Why not |
|---|---|
| Inline expand on click | Lazy — open a proper detail sheet |
| Pill labels for state change | Feels cheap — use StatusBadge |
| Hardcoded colors | Breaks dark mode |
| Cards without hover state | Unclear they're interactive |
| Mixing padding values across a grid | Looks inconsistent |
