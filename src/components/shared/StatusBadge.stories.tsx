import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge, PROCESS_NODE_VARIANT, IMPROVEMENT_KIND_VARIANT } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic categorical-chip primitive — for labels that aren't a registered entity status (use StatusPill for those: goal/project/task/issue/deal/lead/transaction/contact/thread). StatusBadge is what's left for one-off categories like process-node types or improvement kinds, where there's no statusTone.ts registry entry and no edit-dropdown need. Tone colors (success/warning/danger/info/purple) route through the same TONE_HSL registry StatusPill and Toast use.",
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
  args: { label: "Idea", variant: "purple", size: "sm", dot: true },
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

export const ProcessNodeTypes: Story = {
  parameters: {
    docs: { description: { story: "OpsHQ's process-mapping feature — node types have no entity-status equivalent in statusTone.ts." } },
  },
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(PROCESS_NODE_VARIANT).map(([key, variant]) => (
        <StatusBadge key={key} label={key} variant={variant} dot />
      ))}
    </div>
  ),
};

export const ImprovementKinds: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(IMPROVEMENT_KIND_VARIANT).map(([key, variant]) => (
        <StatusBadge key={key} label={key.replace(/_/g, " ")} variant={variant} dot />
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
