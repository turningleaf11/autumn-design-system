import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { TONE_HSL } from "@/lib/statusTone";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 left-1/2 z-[100] flex max-h-screen w-full -translate-x-1/2 flex-col gap-2 p-4 sm:max-w-[380px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// Opaque card surface, not glass — per foundations/elevation.md, the glass
// recipe is reserved for Dialog/DropdownMenu/Popover. A toast is status text
// that needs full legibility at a glance, not floating chrome.
//
// Variant color comes from TONE_HSL (the same registry StatusPill draws
// from) applied as an inline left-border accent + icon tint, rather than
// new Tailwind color tokens — keeps "success" meaning the same green
// everywhere without expanding the Tailwind palette for one component.
const TOAST_TONE: Record<string, keyof typeof TONE_HSL | null> = {
  default: null,
  success: "success",
  warning: "warning",
  destructive: "danger",
  info: "info",
};

const toastVariants = cva(
  "group relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border/50 bg-card text-foreground p-4 shadow-lg transition-all " +
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none " +
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full " +
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[swipe=end]:animate-out",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        destructive: "",
        info: "",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const TOAST_ICON: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }> | null> = {
  default: null,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants> & { children?: React.ReactNode }
>(({ className, variant = "default", style, children, ...props }, ref) => {
  const tone = TOAST_TONE[variant ?? "default"];
  const Icon = TOAST_ICON[variant ?? "default"];
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      style={tone ? { borderLeftColor: `hsl(${TONE_HSL[tone]})`, borderLeftWidth: 3, ...style } : style}
      {...props}
    >
      {Icon && <Icon className="h-4.5 w-4.5 shrink-0 mt-0.5" style={{ color: `hsl(${TONE_HSL[tone!]})` }} />}
      <div className="flex-1 min-w-0 space-y-0.5">{children}</div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

export { TOAST_TONE };

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "shrink-0 rounded-md text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-muted-foreground/60 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold leading-snug", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm text-muted-foreground leading-snug", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
