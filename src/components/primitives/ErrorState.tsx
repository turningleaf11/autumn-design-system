// ErrorState — every page in this system has so far assumed data always
// loads successfully. Same shell as EmptyState (icon, title, hint) but with
// a destructive-tinted icon and a Retry action front and center, since
// "try again" is virtually always the right call to action for a failed
// fetch, unlike EmptyState's more varied actions.

import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  hint?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  size?: "default" | "compact";
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  hint = "Try again — if it keeps happening, the issue is probably on our end, not yours.",
  onRetry,
  retryLabel = "Try again",
  size = "default",
  className,
}: Props) {
  return (
    <div className={cn("text-center", size === "compact" ? "py-8" : "py-16", className)}>
      <div className={cn("mx-auto inline-flex text-destructive", size === "compact" ? "mb-1.5" : "mb-2")}>
        <AlertTriangle className={size === "compact" ? "h-6 w-6" : "h-8 w-8"} />
      </div>
      <p className={cn("font-medium text-foreground", size === "compact" ? "text-sm mb-0.5" : "mb-1")}>{title}</p>
      {hint && <p className={cn("text-muted-foreground", size === "compact" ? "text-xs" : "text-sm")}>{hint}</p>}
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-4">
          <RotateCw className="h-3.5 w-3.5" /> {retryLabel}
        </Button>
      )}
    </div>
  );
}
