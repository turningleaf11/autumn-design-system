import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  args: { placeholder: "Enter text…" },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input placeholder="Empty / placeholder" />
      <Input defaultValue="With a value typed in" />
      <Input placeholder="Disabled" disabled />
      <Input type="password" defaultValue="secret123" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 320 }}>
      <Label htmlFor="story-email">Email</Label>
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithPrefixSuffix: Story = {
  parameters: {
    docs: {
      description: {
        story: "Composition pattern for value-with-unit fields (currency, dimensions) — prefix/suffix sit inside the field with a divider, not as separate elements.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <div className="flex h-10 items-center rounded-xl border-2 border-input bg-background pl-4 pr-3 focus-within:border-primary transition-colors" style={{ width: 160 }}>
        <span className="text-sm text-muted-foreground mr-1">$</span>
        <input className="flex-1 bg-transparent outline-none text-sm" defaultValue="1,020.00" />
      </div>
      <div className="flex h-10 items-center rounded-xl border-2 border-input bg-background pl-4 pr-3 focus-within:border-primary transition-colors" style={{ width: 140 }}>
        <input className="flex-1 bg-transparent outline-none text-sm w-0" defaultValue="250" />
        <span className="text-sm text-muted-foreground border-l border-border pl-2 ml-1">px</span>
      </div>
    </div>
  ),
};
