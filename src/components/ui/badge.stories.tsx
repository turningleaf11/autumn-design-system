import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge (legacy)",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn's base Badge. For status/priority chips in the app, prefer StatusBadge instead — it's theme-safe and has semantic variant maps. This is kept for generic tag use (e.g. project tags).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="pro">Pro</Badge>
    </div>
  ),
};

export const ProBadgeInContext: Story = {
  parameters: {
    docs: {
      description: {
        story: "Intended use: next to a name in an avatar menu, or on a plan/tier chip.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>Autumn Alexander</span>
      <Badge variant="pro">Pro</Badge>
    </div>
  ),
};
