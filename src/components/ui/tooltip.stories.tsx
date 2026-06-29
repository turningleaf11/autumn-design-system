import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Trash2 } from "lucide-react";
import { TooltipProvider, SimpleTooltip } from "./tooltip";
import { Button } from "./button";

const meta: Meta = {
  title: "Components/Tooltip",
  parameters: {
    docs: {
      description: {
        component:
          "For icon-only buttons that have no visible text label — toolbar buttons, nav collapse, etc. Glass surface, same tier as DropdownMenu/Popover per foundations/elevation.md. Already wired into RichTextEditor's toolbar (replacing the old native title= tooltips).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-3">
        <SimpleTooltip label="Bold">
          <Button variant="outline" size="icon"><Bold className="h-4 w-4" /></Button>
        </SimpleTooltip>
        <SimpleTooltip label="Delete" side="bottom">
          <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
        </SimpleTooltip>
      </div>
    </TooltipProvider>
  ),
};
