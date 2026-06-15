# Form Patterns

Forms should feel fast and unobtrusive. Inline editing is preferred over modal forms for simple values. Complex creation flows use dedicated sheets or modals.

---

## Inline editing

For single-field edits (name, description, title):

```tsx
<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={save}
  onKeyDown={(e) => e.key === "Enter" && save()}
  className="bg-transparent outline-none border-b-2 border-transparent
             hover:border-border/30 focus:border-primary/40
             transition-colors"
/>
```

- **Save on blur and Enter** — never require a save button for single-field edits
- **No visible border at rest** — the border appears on hover/focus only
- **Never show "Saved" toast** for every inline edit — too noisy. Only toast on error.

---

## Input field anatomy

```
[Label - text-xs font-medium text-muted-foreground]
[Input field - rounded-xl border border-border/40 bg-background]
[Helper text or error - text-xs text-muted-foreground/60 or text-destructive]
```

---

## Standard input classes

```tsx
// Default input
"w-full px-3 py-2.5 rounded-xl border border-border/40 bg-background
 text-sm text-foreground outline-none
 focus:border-primary/40 focus:ring-1 focus:ring-primary/20
 placeholder:text-muted-foreground/30 transition-colors"

// Search input (with icon)
"w-full pl-8 pr-3 py-2.5 rounded-xl border border-border/40 bg-background
 text-xs outline-none focus:border-primary/40 transition-colors"
```

---

## Textarea / rich text

- Single-line short values → `<input>`
- Multi-line plain text → `<textarea className="resize-none ...">`
- Rich content (images, formatting, slash commands) → `<RichTextEditor>`

Never use a `<textarea>` where a `RichTextEditor` is appropriate. If the user might want to paste an image or add a checklist, use the rich editor.

---

## Select / dropdown

Use shadcn `<Select>` for single-choice pickers under ~8 options. For more options or searchable pickers, use a custom popover with an input.

---

## Buttons

| Variant | Usage |
|---|---|
| `default` (primary) | Primary CTA — one per form/card max |
| `outline` | Secondary actions |
| `ghost` | Tertiary, destructive confirmations |
| `destructive` | Delete, remove — always requires confirmation |

Button sizes: `sm` (most form buttons), `default` (primary CTAs), `icon` (icon-only actions).

---

## Validation

- Validate only at the boundary (save/submit), not on every keystroke
- Show errors inline below the field in `text-xs text-destructive`
- Required fields are not starred — use placeholder text as the hint
- Never disable the submit button based on validation state alone — let the user try and show the error

---

## Loading states

- Button: replace label with `<Loader2 className="h-3.5 w-3.5 animate-spin" />` + disable
- Field: `opacity-60 pointer-events-none` while saving
- Never block the entire form with a spinner overlay for small saves
