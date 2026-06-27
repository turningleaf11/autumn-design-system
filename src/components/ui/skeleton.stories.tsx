import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";
import { DataTableShell } from "./data-table-shell";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  parameters: {
    docs: {
      description: {
        component:
          "Loading placeholder that mirrors the shape of the real content, per foundations/motion.md (\"skeleton loaders preferred over spinners for content areas — they maintain layout shape\"). Spinners are still right for secondary/inline loading (e.g. inside a button mid-submit).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const ListRows: Story = {
  parameters: {
    docs: { description: { story: "Mirrors EntityCard's layout=\"row\" shape — same DataTableShell wrapper, same single-line structure." } },
  },
  render: () => (
    <div style={{ width: 560 }}>
      <DataTableShell>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-b-0">
            <Skeleton className="h-5 w-16 rounded-md shrink-0" />
            <Skeleton className="h-4 w-32 shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-14 rounded-md shrink-0" />
          </div>
        ))}
      </DataTableShell>
    </div>
  ),
};

export const KanbanCards: Story = {
  parameters: {
    docs: { description: { story: "Mirrors EntityCard's default (card) shape for a kanban column." } },
  },
  render: () => (
    <div className="flex flex-col rounded-xl bg-muted/30 border border-border/30 p-2 space-y-2" style={{ width: 260 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border/40 bg-card p-3.5 space-y-2.5">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const DetailSheetHeader: Story = {
  render: () => (
    <div style={{ width: 480 }} className="space-y-3 p-6 border border-border/40 rounded-xl">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};
