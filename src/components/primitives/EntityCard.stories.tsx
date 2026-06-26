import type { Meta, StoryObj } from "@storybook/react";
import { EntityCard } from "./EntityCard";
import { StatusPill } from "./StatusPill";
import { MessageSquare, Paperclip, CheckSquare } from "lucide-react";

const meta: Meta = {
  title: "Components/EntityCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The canonical card across kanbans, grids, and lists — same shell for deals, projects, tasks, goals. Status color comes from one shared registry (statusTone.ts), so a Won deal, a Done task, and a Completed project all render the identical tone.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const PEOPLE = [
  { user_id: "1", full_name: "Autumn Alexander", avatar_url: null },
  { user_id: "2", full_name: "Jordan Reyes", avatar_url: null },
];

export const CardLayout: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <EntityCard
        kind="deal"
        status="open"
        priority="high"
        title="184 Sunbelt Holdings — SFH Acquisition"
        description="4bd/2ba, under contract, closing in 18 days."
        assignees={PEOPLE}
        dateLabel="Closes Jul 12"
        metadata={[
          { icon: MessageSquare, value: 6, label: "Comments" },
          { icon: Paperclip, value: 2, label: "Attachments" },
          { icon: CheckSquare, value: "1/3", label: "Subtasks" },
        ]}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
    </div>
  ),
};

export const RowLayout: Story = {
  parameters: {
    docs: { description: { story: "layout=\"row\" — used in list views, full-width horizontal strip." } },
  },
  render: () => (
    <div style={{ width: 480 }}>
      <EntityCard
        layout="row"
        kind="task"
        status="in_progress"
        priority="medium"
        title="Rebuild Smart List stale-lead logic"
        description="Cut leads >15 days inactive from the active view."
        assignees={PEOPLE}
        dateLabel="Due Fri"
        onClick={() => {}}
      />
    </div>
  ),
};

export const SameToneAcrossEntities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Won (deal), Done (task), and Completed (project) are different words for the same underlying concept — the registry maps all three to the same success tone so they read as visually equivalent.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <StatusPill kind="deal" value="won" />
      <StatusPill kind="task" value="done" />
      <StatusPill kind="project" value="completed" />
      <StatusPill kind="goal" value="done" />
    </div>
  ),
};
