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
          "shadcn's base Badge. For entity status/priority chips, use StatusPill/PriorityPill instead — they're registry-driven and support the inline edit dropdown. This one is what every DetailSheet header actually uses for its typeBadge (\"Task\", \"Project\", \"Goal\"...) via the outline variant, plus the pro variant for tier/plan chips.",
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
