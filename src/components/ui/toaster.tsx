// Toaster — mount once at the app root. Every `toast()` call from
// `@/hooks/use-toast` fans out into here via the shared listener queue.
import { useToast } from "@/hooks/use-toast";
import {
  Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    // duration matches motion.md's "auto-dismiss at 4s" — set here rather
    // than relying on Radix's own default (5000ms), so the visual close
    // (Radix's internal timer) and the array removal (useToast's own
    // timer) agree on the same number instead of racing each other.
    <ToastProvider duration={4000}>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
