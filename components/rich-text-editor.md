# RichTextEditor Component

TipTap-based rich text editor used for notes, descriptions, and documents across all products. Supports slash commands, bubble menu, drag handles, file/image upload, and full formatting.

---

## Props

```tsx
<RichTextEditor
  content={html}               // initial HTML content string
  onChange={(html) => {}}      // called on every change (debounce saves yourself)
  placeholder="Add notes…"     // empty state placeholder
  borderless={false}           // removes border/background — for embedded use in panels
  compact={false}              // reduced padding — use minHeight instead
  minHeight="240px"            // CSS min-height for the editor body
  showToolbar={true}           // show the formatting toolbar
/>
```

---

## When to use which mode

| Use case | Props |
|---|---|
| Standalone doc editor | default (no special props) |
| Notes tab in a side panel | `borderless showToolbar minHeight="300px"` |
| Compact input (short notes) | `borderless minHeight="120px"` |
| Inline description in a form | `borderless compact` |

**Never use `compact` alone for panels** — it just reduces padding. Use `minHeight` to control height.

---

## Content format

The editor stores and returns HTML strings. When saving to the DB:

- Check with `stripHtml(content)` before saving — don't save empty `<p></p>` as content
- Store as `text` type in Postgres (not `jsonb`) — HTML is the portable format
- Debounce saves by 500–800ms to avoid hammering the DB on every keystroke

```tsx
const handleChange = (html: string) => {
  clearTimeout(timer.current);
  timer.current = setTimeout(async () => {
    const text = html.replace(/<[^>]*>/g, "").trim();
    if (!text) return; // don't save empty
    await saveToDb(html);
  }, 600);
};
```

---

## Slash commands

Type `/` anywhere in the editor to open the command menu. Current commands:

- **Headings** — H1, H2, H3
- **Text** — Paragraph, bold, italic
- **Lists** — Bullet list, numbered list, checklist
- **Blocks** — Blockquote, code block, divider
- **Media** — Image upload, file attachment

---

## Displaying saved content

Saved HTML should be rendered with `dangerouslySetInnerHTML` inside a `.prose` wrapper, or via the `<RichTextRenderer>` component (if available).

```tsx
<div
  className="prose prose-sm dark:prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: content }}
/>
```
