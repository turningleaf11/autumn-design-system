import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {
  args: { placeholder: "Short description…" },
  render: (args) => <Textarea style={{ width: 320 }} {...args} />,
};

export const Disabled: Story = {
  render: () => <Textarea style={{ width: 320 }} placeholder="Disabled" disabled />,
};
