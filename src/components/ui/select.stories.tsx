import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta: Meta = {
  title: "Components/Select",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => (
    <Select defaultValue="medium">
      <SelectTrigger style={{ width: 200 }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
      </SelectContent>
    </Select>
  ),
};
