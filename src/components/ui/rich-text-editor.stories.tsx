import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  parameters: {
    docs: {
      description: {
        component:
          "TipTap-based editor implementing components/rich-text-editor.md, plus extensions beyond the original spec: tables, a block drag handle (hover the left gutter), @mentions, and inline comments (select text → Comment in the bubble menu). Image upload and comment-thread persistence are app-specific, so those are exposed as callbacks rather than built-in pipelines.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

const MENTIONABLE_USERS = [
  { id: "1", name: "Autumn Alexander" },
  { id: "2", name: "Jordan Reyes" },
  { id: "3", name: "Priya Shah" },
  { id: "4", name: "Devon Carter" },
];

function StandaloneDemo() {
  const [html, setHtml] = useState(
    "<p>Try typing <strong>/</strong> for the command menu, <strong>@</strong> to mention someone, or select text to see the bubble menu (Comment is in there too).</p>",
  );
  return (
    <div style={{ width: 560 }}>
      <RichTextEditor
        content={html}
        onChange={setHtml}
        placeholder="Add notes…"
        onUploadImage={() => alert("wire this to your upload flow")}
        mentionableUsers={MENTIONABLE_USERS}
        onAddComment={(selectedText, comment) => alert(`Comment on "${selectedText}":\n${comment}`)}
      />
    </div>
  );
}

export const Standalone: Story = {
  render: () => <StandaloneDemo />,
};

export const TablesAndDragHandle: Story = {
  parameters: {
    docs: { description: { story: "Insert a table via the toolbar or \"/table\". Hover the left edge of any block to reveal the drag handle, then drag to reorder." } },
  },
  render: () => (
    <div style={{ width: 600 }}>
      <RichTextEditor
        content="<h2>Q3 Roadmap</h2><p>Drag this paragraph above the heading using the handle in the left gutter.</p><table><tbody><tr><th>Feature</th><th>Owner</th><th>Status</th></tr><tr><td>Billing migration</td><td>Devon</td><td>In progress</td></tr><tr><td>SOC 2 readiness</td><td>Priya</td><td>At risk</td></tr></tbody></table>"
        placeholder="Add notes…"
      />
    </div>
  ),
};

export const NotesTabEmbedded: Story = {
  parameters: {
    docs: { description: { story: "borderless + showToolbar + minHeight=\"300px\" — the mode used inside DetailSheet's Notes tab." } },
  },
  render: () => (
    <div style={{ width: 560 }}>
      <RichTextEditor borderless showToolbar minHeight="300px" placeholder="Add notes…" />
    </div>
  ),
};

export const CompactInline: Story = {
  parameters: {
    docs: { description: { story: "borderless + compact — for short inline notes, no toolbar." } },
  },
  render: () => (
    <div style={{ width: 420 }}>
      <RichTextEditor borderless compact showToolbar={false} minHeight="80px" placeholder="Quick note…" />
    </div>
  ),
};
