# Detail Sheets

Detail sheets (side panels) are the primary pattern for viewing and editing a single record. They slide in from the right without leaving the current page.

---

## Structure

```
┌──────────────────── Sheet (680px wide) ─────────────────────────────┐
│ ┌─ Header (shrink-0, border-left accent) ────────────────────────── │
│ │  [type badge]  [owner pill]  [status indicators]                  │
│ │                                                                    │
│ │  Record Name ← editable inline                                    │
│ │  Short description ← editable inline, plain text                  │
│ └───────────────────────────────────────────────────────────────── │
│ ┌─ Tab bar (shrink-0, border-b) ─────────────────────────────────── │
│ │  Overview  │  Notes  │  Map  │  Docs  │  ...                     │
│ └───────────────────────────────────────────────────────────────── │
│ ┌─ Tab content (flex-1, overflow-y-auto) ──────────────────────────  │
│ │  [Content for selected tab]                                       │
│ └───────────────────────────────────────────────────────────────── │
└────────────────────────────────────────────────────────────────────┘
```

---

## Key rules

- **Width**: `max-w-[680px]` — wide enough for a rich editor or data table
- **Header is always visible** — tabs scroll, header doesn't
- **No sheet-level scroll** — only the active tab content scrolls
- **Short description in header** — one line, plain text, saves as subtitle that shows on cards
- **Rich notes in a Notes tab** — full editor, not in the header
- **Tabs keep content at panel height** — the fix for "pushing things too far down"

---

## Tab naming conventions

| Tab | Contains |
|---|---|
| Overview | Summary info, status, related items, issues |
| Notes | Full rich text editor |
| Map | Visual diagram / canvas |
| Docs | Linked documents, file attachments |
| Activity | Change log, comments (when needed) |

Not every sheet needs all tabs. Add only what's needed for the record type.

---

## Tab trigger style

```tsx
<TabsTrigger
  value="notes"
  className="rounded-none border-b-2 border-transparent
             data-[state=active]:border-primary
             data-[state=active]:bg-transparent
             data-[state=active]:shadow-none
             px-4 h-10 text-xs font-medium
             text-muted-foreground data-[state=active]:text-foreground
             transition-colors"
>
  Notes
</TabsTrigger>
```

---

## Owner picker pattern

The owner is shown as a pill in the header. Clicking it opens a small popover with a list of workspace members.

```
[Avatar] Owner Name ← click to open picker
     ↓
[List of members]
  ○ Autumn Alexander  ✓
  ○ Team Member
  ──────────────
  Remove owner
```

---

## Inline name editing

The record title in the header is a bare `<input>` styled to look like a heading:

```tsx
<input
  className="w-full text-xl font-bold text-foreground bg-transparent outline-none
             border-b-2 border-transparent hover:border-border/30
             focus:border-primary/40 pb-0.5 transition-colors"
/>
```

Save on blur and Enter. No save button needed.
