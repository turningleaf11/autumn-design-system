import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge, GOAL_STATUS_VARIANT, GOAL_STATUS_LABEL, PROJECT_STATUS_VARIANT, PROJECT_STATUS_LABEL, TASK_STATUS_VARIANT, PRIORITY_VARIANT, PRIORITY_LABEL } from "./StatusBadge";
import { Flag } from "lucide-react";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The single source of truth for status and priority chips across OpsHQ. Uses CSS variables so it stays correct in every theme — never hardcode raw Tailwind color classes (bg-red-100, etc.) for status.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info", "muted", "primary", "purple", "mint", "coral"],
    },
    size: { control: "select", options: ["xs", "sm"] },
  },
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Playground: Story = {
  args: { label: "On Track", variant: "success", size: "sm", dot: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["default", "success", "warning", "danger", "info", "muted", "primary", "purple", "mint", "coral"] as const).map((v) => (
        <StatusBadge key={v} label={v} variant={v} dot />
      ))}
    </div>
  ),
};

export const GoalStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(GOAL_STATUS_LABEL).map(([key, label]) => (
        <StatusBadge key={key} label={label} variant={GOAL_STATUS_VARIANT[key]} dot />
      ))}
    </div>
  ),
};

export const ProjectStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(PROJECT_STATUS_LABEL).map(([key, label]) => (
        <StatusBadge key={key} label={label} variant={PROJECT_STATUS_VARIANT[key]} dot />
      ))}
    </div>
  ),
};

export const PriorityWithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(PRIORITY_LABEL)
        .filter(([k]) => !["1", "2", "3"].includes(k))
        .map(([key, label]) => (
          <StatusBadge key={key} label={label} variant={PRIORITY_VARIANT[key]} icon={<Flag className="h-3 w-3" />} size="xs" />
        ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <StatusBadge label="Extra Small" variant="info" size="xs" dot />
      <StatusBadge label="Small (default)" variant="info" size="sm" dot />
    </div>
  ),
};

export const TaskStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {["not_started", "in_progress", "blocked", "done"].map((key) => (
        <StatusBadge key={key} label={key.replace(/_/g, " ")} variant={TASK_STATUS_VARIANT[key]} dot />
      ))}
    </div>
  ),
};
