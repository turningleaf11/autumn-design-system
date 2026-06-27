import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Toaster } from "./toaster";
import { toast } from "@/hooks/use-toast";

const meta: Meta = {
  title: "Components/Toast",
  parameters: {
    docs: {
      description: {
        component:
          "Transient feedback after an action — saved, deleted, error. Slides in from the bottom and auto-dismisses at 4s per foundations/motion.md. Call `toast({ title, description, variant })` from `@/hooks/use-toast` anywhere in the app; mount <Toaster/> once at the app root (it's included in this story so the demo is self-contained).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast({ title: "Saved", description: "Your changes have been saved." })}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ variant: "success", title: "Deal marked Won", description: "Coastal Acquisitions moved to Closed." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ variant: "warning", title: "Lease expiring soon", description: "Office relocation project is 4 days from its deadline." })}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ variant: "destructive", title: "Couldn't delete contact", description: "Marcus Webb has 2 open deals — resolve those first." })}
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ variant: "info", title: "Sync in progress", description: "Importing 184 contacts from Stripe." })}
      >
        Info
      </Button>
      <Toaster />
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <ToastDemo />,
};
