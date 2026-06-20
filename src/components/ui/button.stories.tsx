import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Plus, Loader2, Sparkles } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "destructive", "outline", "secondary", "ghost", "link", "ai"] },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: { children: "Button", variant: "default", size: "default", disabled: false },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {(["default", "destructive", "outline", "secondary", "ghost", "link"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
      <Button variant="ai"><Sparkles /> Ask Albus</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><Plus /></Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Plus /> Add item
    </Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" /> Saving…
    </Button>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {(["default", "destructive", "outline", "secondary", "ghost"] as const).map((v) => (
        <Button key={v} variant={v} disabled>{v}</Button>
      ))}
    </div>
  ),
};
