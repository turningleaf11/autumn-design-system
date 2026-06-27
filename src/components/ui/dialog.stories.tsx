import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  parameters: {
    docs: {
      description: {
        component:
          "Centered, glass-surface dialog for confirmations and short create flows — distinct from Sheet (the 680px side panel for full record detail). Per foundations/elevation.md, Dialog is one of the surfaces the glass recipe is reserved for, since it's short-lived chrome floating over the ambient backdrop rather than a dense content panel.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-1.5" /> Delete deal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this deal?</DialogTitle>
          <DialogDescription>
            "Coastal Acquisitions" and its activity history will be permanently removed. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

function QuickCreateDemo() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" /> New task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>Quick-create — open the full record later to add more detail.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" placeholder="e.g. Draft Q3 investor update" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!title} onClick={() => setOpen(false)}>Create task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const QuickCreate: Story = {
  render: () => <QuickCreateDemo />,
};
