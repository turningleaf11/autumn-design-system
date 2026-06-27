// EmptyState — the generalized "nothing here" pattern for any surface that
// isn't a table (search results, inbox, notifications, a filtered list with
// zero matches). DataTableEmpty already covers the table-specific case;
// this is the same visual recipe (icon, title, hint) made reusable
// everywhere else, plus an optional action for the common "create the
// first one" / "clear filters" follow-up.

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  icon?: React.ReactNode;
  title: string;
  hint?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  /** Use "compact" inside smaller containers (a panel, a popover list). */
  size?: "default" | "compact";
  className?: string;
}

export function EmptyState({ icon, title, hint, action, size = "default", className }: Props) {
  return (
    <div
      className={cn(
        "text-center text-muted-foreground",
        size === "compact" ? "py-8" : "py-16",
        className,
      )}
    >
      {icon && (
        <div className={cn("mx-auto inline-flex opacity-50", size === "compact" ? "mb-1.5" : "mb-2")}>
          {icon}
        </div>
      )}
      <p className={cn("font-medium text-foreground", size === "compact" ? "text-sm mb-0.5" : "mb-1")}>{title}</p>
      {hint && <p className={size === "compact" ? "text-xs" : "text-sm"}>{hint}</p>}
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
