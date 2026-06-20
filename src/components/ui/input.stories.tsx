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
