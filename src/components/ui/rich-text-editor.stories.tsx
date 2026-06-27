import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  parameters: {
    docs: {
      description: {
        component:
          "TipTap-based editor implementing components/rich-text-editor.md — toolbar, bubble menu on selection, and slash commands (type \"/\"). Image upload is app-specific (Supabase storage etc.), so it's exposed as an `onUploadImage` callback rather than a built-in pipeline.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

function StandaloneDemo() {
  const [html, setHtml] = useState("<p>Try typing <strong>/</strong> to open the command menu, or select text to see the bubble menu.</p>");
  return (
    <div style={{ width: 560 }}>
      <RichTextEditor content={html} onChange={setHtml} placeholder="Add notes…" onUploadImage={() => alert("wire this to your upload flow")} />
    </div>
  );
}

export const Standalone: Story = {
  render: () => <StandaloneDemo />,
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
