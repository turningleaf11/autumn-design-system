// CommandPalette (⌘K) — global search/quick-nav. Built on the same Radix
// Dialog primitive as Dialog, but with its own positioning (top-anchored,
// wide) and glass surface — per foundations/elevation.md, command palettes
// are explicitly level-4 floating chrome, one step above Dialog/DropdownMenu.

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogPortal, DialogOverlay } from "@/components/ui/dialog";

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
  onSelect: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  placeholder?: string;
}

export function CommandPalette({ open, onOpenChange, groups, placeholder = "Search or jump to…" }: Props) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(0);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flatItems = React.useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  React.useEffect(() => {
    setSelected(0);
  }, [query, open]);

  function runSelected() {
    const item = flatItems[selected];
    if (!item) return;
    item.onSelect();
    onOpenChange(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSelected();
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl overflow-hidden",
            "bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 border border-border/35 shadow-[0_16px_48px_hsl(var(--foreground)/0.18)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150",
          )}
          onKeyDown={onKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <div className="flex items-center gap-2.5 border-b border-border/40 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            />
            <kbd className="rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shrink-0">esc</kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {flatItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
            ) : (
              filtered.map((group) => (
                <div key={group.label} className="mb-2 last:mb-0">
                  <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                  {group.items.map((item) => {
                    const flatIndex = flatItems.indexOf(item);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setSelected(flatIndex)}
                        onClick={runSelected}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-left transition-colors",
                          flatIndex === selected ? "bg-accent text-foreground" : "text-foreground hover:bg-accent/60",
                        )}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hint && <span className="text-xs text-muted-foreground shrink-0">{item.hint}</span>}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
