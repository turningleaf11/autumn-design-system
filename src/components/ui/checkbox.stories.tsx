import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

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

export const CheckedRowList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When a checkbox lives inside a list row, tint the whole row on check — not just the box. That's the detail that makes a checked state feel satisfying instead of just technically correct.",
      },
    },
  },
  render: () => {
    const options = ["Realtor channel", "Broker channel", "Wholesale", "Portfolio"];
    const [checked, setChecked] = useState<Record<string, boolean>>({ "Broker channel": true });
    return (
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 2 }}>
        {options.map((opt) => (
          <label
            key={opt}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors",
              checked[opt] ? "bg-primary/10" : "hover:bg-muted/60",
            )}
          >
            <Checkbox
              checked={!!checked[opt]}
              onCheckedChange={(v) => setChecked((c) => ({ ...c, [opt]: !!v }))}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    );
  },
};
