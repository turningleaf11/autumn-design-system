import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "./date-picker";

const meta: Meta = {
  title: "Components/DatePicker",
  parameters: {
    docs: {
      description: {
        component:
          "Plain month-grid Calendar in a Popover — no date-fns/react-day-picker dependency, native Date math (consistent with how Task Page's Timeline view already does its own date arithmetic). Wired into Task Page's Overview tab as a real \"Due date\" field, replacing the read-only relative-days label.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ width: 240 }}>
      <DatePicker value={date} onChange={setDate} />
    </div>
  );
}

export const Default: Story = {
  render: () => <DatePickerDemo />,
};
