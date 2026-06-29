import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "../ui/skeleton";
import { DataTableShell } from "../ui/data-table-shell";
import { Button } from "../ui/button";

const meta: Meta<typeof ErrorState> = {
  title: "Patterns/Error State",
  parameters: {
    docs: {
      description: {
        component:
          "Every page in this system has so far assumed data always loads successfully — no page has ever shown what a failed fetch looks like. Same shell as EmptyState (icon, title, hint) but destructive-tinted with Retry front and center, since \"try again\" is virtually always the right call for a failed load.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <DataTableShell>
        <ErrorState onRetry={() => alert("Retrying…")} />
      </DataTableShell>
    </div>
  ),
};

export const CustomMessage: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <DataTableShell>
        <ErrorState
          title="Couldn't load contacts"
          hint="Check your connection and try again."
          onRetry={() => alert("Retrying…")}
        />
      </DataTableShell>
    </div>
  ),
};

type LoadState = "loading" | "error" | "success";

function AsyncLifecycleDemo() {
  const [state, setState] = useState<LoadState>("loading");

  return (
    <div className="space-y-3" style={{ width: 480 }}>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setState("loading")}>Simulate loading</Button>
        <Button size="sm" variant="outline" onClick={() => setState("error")}>Simulate error</Button>
        <Button size="sm" variant="outline" onClick={() => setState("success")}>Simulate success</Button>
      </div>

      <DataTableShell>
        {state === "loading" && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        )}
        {state === "error" && (
          <ErrorState title="Couldn't load contacts" hint="Check your connection and try again." onRetry={() => setState("loading")} />
        )}
        {state === "success" && (
          <div className="divide-y divide-border/30">
            {["Marcus Webb", "Priya Shah", "Devon Carter"].map((name) => (
              <div key={name} className="px-5 py-3 text-sm font-medium">{name}</div>
            ))}
          </div>
        )}
      </DataTableShell>
    </div>
  );
}

export const AsyncLifecycle: Story = {
  parameters: {
    docs: { description: { story: "The full lifecycle a real page should handle: loading (Skeleton) → error (ErrorState + retry) → success. Click the buttons to step through it." } },
  },
  render: () => <AsyncLifecycleDemo />,
};
