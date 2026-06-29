// RichTextEditor — TipTap-based editor for notes, descriptions, and
// documents across all products. See components/rich-text-editor.md for the
// spec this implements: slash commands, bubble menu, toolbar, HTML content
// format. Extended beyond the original spec with: tables, a block drag
// handle (left gutter, hover to reveal), @mentions, and inline comments
// (select text → Comment in the bubble menu → highlights the range).
//
// Scope notes:
// - File/image *upload* is app-specific (needs Supabase storage, auth,
//   etc.) so this ships the UI affordance (toolbar button + slash command)
//   wired to an `onUploadImage` callback, not a built-in pipeline.
// - @mentions need a real teammate list — pass `mentionableUsers`, same
//   shape as AppShell's owner-picker. Omit the prop to disable mentions.
// - Inline comments are a UI shell: `onAddComment` fires with the selected
//   text + comment body, and the range gets a highlight mark. Persisting
//   threads (who said what, resolved/unresolved) is app-specific — wire it
//   the same way ActivityFeed's composer is wired to real data.
// - Markdown shortcuts (# , **bold**, - , etc.) are already live — they
//   ship for free with StarterKit's input rules, nothing to build.

import * as React from "react";
import { useEditor, EditorContent, BubbleMenu, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, ListTodo, Quote, Code, Minus, Link2, Image as ImageIcon,
  Table as TableIcon, MessageSquarePlus, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider, SimpleTooltip } from "./tooltip";
import { SlashCommand, type SlashCommandItem } from "./rich-text-editor-slash-command";
import { createMentionExtension, type MentionableUser } from "./rich-text-editor-mention";
import { DragHandle } from "./rich-text-editor-drag-handle";
import { Button } from "./button";

export interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Removes border/background — for embedded use in panels (e.g. a Notes tab). */
  borderless?: boolean;
  /** Reduced padding. Use minHeight to control height, not as a height substitute. */
  compact?: boolean;
  minHeight?: string;
  showToolbar?: boolean;
  /** Wired to the toolbar/slash-command image action — upload is app-specific. */
  onUploadImage?: () => void;
  /** Teammates available for @mention autocomplete. Omit to disable mentions. */
  mentionableUsers?: MentionableUser[];
  /** Called when a comment is added via the bubble menu's Comment action. */
  onAddComment?: (selectedText: string, comment: string) => void;
  className?: string;
}

const TOOLBAR_BUTTON =
  "inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none";
const TOOLBAR_BUTTON_ACTIVE = "bg-accent text-primary";

function ToolbarButton({
  active, onClick, disabled, children, label,
}: { active?: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode; label: string }) {
  return (
    <SimpleTooltip label={label}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(TOOLBAR_BUTTON, active && TOOLBAR_BUTTON_ACTIVE)}
      >
        {children}
      </button>
    </SimpleTooltip>
  );
}

function Toolbar({ editor, onUploadImage }: { editor: Editor; onUploadImage?: () => void }) {
  return (
    <div className="flex items-center gap-0.5 flex-wrap border-b border-border/50 px-2 py-1.5">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>
      <div className="w-px h-4 bg-border/60 mx-1" />
      <ToolbarButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <div className="w-px h-4 bg-border/60 mx-1" />
      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Checklist" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <ListTodo className="h-3.5 w-3.5" />
      </ToolbarButton>
      <div className="w-px h-4 bg-border/60 mx-1" />
      <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Table"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        }}
      >
        <Link2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      {onUploadImage && (
        <ToolbarButton label="Image" onClick={onUploadImage}>
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}
    </div>
  );
}

export function RichTextEditor({
  content, onChange, placeholder = "Start typing…",
  borderless = false, compact = false, minHeight = "160px",
  showToolbar = true, onUploadImage, mentionableUsers, onAddComment, className,
}: RichTextEditorProps) {
  const slashItems = React.useMemo<SlashCommandItem[]>(
    () => buildSlashCommandItems(onUploadImage),
    [onUploadImage],
  );
  const [commentMode, setCommentMode] = React.useState(false);
  const [commentDraft, setCommentDraft] = React.useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({ HTMLAttributes: { class: "rte-comment-highlight" } }),
      DragHandle,
      SlashCommand.configure({ items: slashItems }),
      ...(mentionableUsers ? [createMentionExtension(mentionableUsers)] : []),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
  });

  if (!editor) return null;

  function submitComment() {
    const text = commentDraft.trim();
    if (!text || !editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    editor.chain().setHighlight().run();
    onAddComment?.(selectedText, text);
    setCommentDraft("");
    setCommentMode(false);
  }

  return (
    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
    <div
      className={cn(
        !borderless && "rounded-xl border border-border/50 bg-background overflow-hidden",
        className,
      )}
    >
      {showToolbar && <Toolbar editor={editor} onUploadImage={onUploadImage} />}

      {editor && (
        <BubbleMenu
          editor={editor}
          // shouldShow's default checks editor.view.hasFocus(), which becomes
          // false the instant you click into the comment textarea (it's
          // outside the contentEditable) — the popup would vanish before you
          // could type anything. Keep it open while commentMode is true
          // regardless of focus; interactive:true stops tippy from treating
          // a click inside its own popup as an "outside click" dismissal.
          shouldShow={({ editor: ed, state }) => commentMode || (ed.isEditable && !state.selection.empty)}
          tippyOptions={{ duration: 100, interactive: true, onHide: () => setCommentMode(false) }}
        >
          {commentMode ? (
            <div className="flex items-end gap-2 rounded-lg border border-border/35 bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] p-2 w-64">
              <textarea
                autoFocus
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitComment(); }}
                placeholder="Comment on this…"
                rows={2}
                className="flex-1 resize-none rounded-md border border-border/50 bg-background px-2 py-1.5 text-xs outline-none focus:border-primary/40"
              />
              <Button size="icon" className="h-7 w-7 shrink-0" disabled={!commentDraft.trim()} onClick={submitComment} aria-label="Send comment">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 rounded-lg border border-border/35 bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] p-1">
              <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton
                label="Link"
                active={editor.isActive("link")}
                onClick={() => {
                  const url = window.prompt("Link URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                <Link2 className="h-3.5 w-3.5" />
              </ToolbarButton>
              {onAddComment && (
                <ToolbarButton label="Comment" onClick={() => setCommentMode(true)}>
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                </ToolbarButton>
              )}
            </div>
          )}
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className={cn(
          "text-sm leading-relaxed [&_.ProseMirror]:outline-none [&_.ProseMirror]:h-full",
          compact ? "p-2" : "p-4",
          // Hand-rolled typography instead of pulling in @tailwindcss/typography
          // for one component — arbitrary-variant selectors targeting the
          // ProseMirror content directly.
          "[&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2",
          "[&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-1.5",
          "[&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1",
          "[&_.ProseMirror_p]:my-1.5 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground/60 [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5",
          "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-primary/40 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:italic",
          "[&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:text-xs [&_.ProseMirror_pre]:overflow-x-auto",
          "[&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.85em]",
          "[&_.ProseMirror_hr]:border-border/60 [&_.ProseMirror_hr]:my-4",
          "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline",
          "[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0",
          "[&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2",
        )}
      />
    </div>
    </TooltipProvider>
  );
}

function buildSlashCommandItems(onUploadImage?: () => void): SlashCommandItem[] {
  const items: SlashCommandItem[] = [
    { title: "Heading 1", icon: Heading1, command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { title: "Heading 2", icon: Heading2, command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { title: "Heading 3", icon: Heading3, command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { title: "Bullet list", icon: List, command: (editor) => editor.chain().focus().toggleBulletList().run() },
    { title: "Numbered list", icon: ListOrdered, command: (editor) => editor.chain().focus().toggleOrderedList().run() },
    { title: "Checklist", icon: ListTodo, command: (editor) => editor.chain().focus().toggleTaskList().run() },
    { title: "Quote", icon: Quote, command: (editor) => editor.chain().focus().toggleBlockquote().run() },
    { title: "Code block", icon: Code, command: (editor) => editor.chain().focus().toggleCodeBlock().run() },
    { title: "Divider", icon: Minus, command: (editor) => editor.chain().focus().setHorizontalRule().run() },
    { title: "Table", icon: TableIcon, command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  ];
  if (onUploadImage) {
    items.push({ title: "Image", icon: ImageIcon, command: () => onUploadImage() });
  }
  return items;
}
