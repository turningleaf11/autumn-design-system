import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Switch />
      <Switch defaultChecked />
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
};
