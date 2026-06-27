import type { Meta, StoryObj } from "@storybook/react";
import { SearchX, Inbox, FolderOpen } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { DataTableShell } from "../ui/data-table-shell";

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/Empty State",
  parameters: {
    docs: {
      description: {
        component:
          "Generalized 'nothing here' pattern for any non-table surface — search results, inbox, a filtered list with zero matches. DataTableEmpty already covers the table-specific case (used inside DataTableShell); this is the same icon/title/hint recipe made reusable everywhere else, plus an optional action.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoSearchResults: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <DataTableShell>
        <EmptyState
          icon={<SearchX className="h-8 w-8" />}
          title={'No results for "sunbelt"'}
          hint="Try a different search term, or clear filters."
          action={{ label: "Clear search", onClick: () => {} }}
        />
      </DataTableShell>
    </div>
  ),
};

export const EmptyInbox: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <DataTableShell>
        <EmptyState icon={<Inbox className="h-8 w-8" />} title="Inbox zero" hint="New leads will show up here as they come in." />
      </DataTableShell>
    </div>
  ),
};

export const CompactInPanel: Story = {
  parameters: {
    docs: { description: { story: "size=\"compact\" — for smaller containers like a popover list or sheet tab." } },
  },
  render: () => (
    <div style={{ width: 280, border: "1px solid hsl(var(--border))", borderRadius: 12 }}>
      <EmptyState size="compact" icon={<FolderOpen className="h-6 w-6" />} title="No documents yet" hint="Linked files will appear here." />
    </div>
  ),
};
