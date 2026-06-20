import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
};
