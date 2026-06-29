// @mentions — autocomplete a teammate while typing "@". Same ReactRenderer +
// tippy popup machinery as the slash command, this time backed by TipTap's
// official Mention extension (it owns the inline node; we only supply the
// suggestion list). Team list is provided by the host app — this ships with
// sample data in the story, same as AppShell's owner-picker.

import * as React from "react";
import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { cn } from "@/lib/utils";

export interface MentionableUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface MentionListProps {
  items: MentionableUser[];
  command: (item: { id: string; label: string }) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const MentionList = React.forwardRef<MentionListRef, MentionListProps>(({ items, command }, ref) => {
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => setSelected(0), [items]);

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowDown") { setSelected((i) => (i + 1) % items.length); return true; }
      if (event.key === "ArrowUp") { setSelected((i) => (i - 1 + items.length) % items.length); return true; }
      if (event.key === "Enter") {
        const item = items[selected];
        if (item) command({ id: item.id, label: item.name });
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) {
    return <div className="w-48 rounded-xl border border-border/35 bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] p-2.5 text-sm text-muted-foreground">No matches</div>;
  }

  return (
    <div className="w-48 rounded-xl border border-border/35 bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] p-1.5 max-h-60 overflow-y-auto">
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => command({ id: item.id, label: item.name })}
          className={cn(
            "w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-left transition-colors",
            i === selected ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60",
          )}
        >
          <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
            {item.name.charAt(0).toUpperCase()}
          </span>
          {item.name}
        </button>
      ))}
    </div>
  );
});
MentionList.displayName = "MentionList";

export function createMentionExtension(users: MentionableUser[]) {
  return Mention.configure({
    HTMLAttributes: { class: "mention" },
    suggestion: {
      char: "@",
      items: ({ query }) => users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8),
      render: () => {
        let component: ReactRenderer<MentionListRef, MentionListProps>;
        let popup: TippyInstance;
        return {
          onStart: (props) => {
            component = new ReactRenderer(MentionList, {
              props: { items: props.items, command: props.command },
              editor: props.editor,
            });
            popup = tippy(document.body, {
              getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect(),
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start",
            });
          },
          onUpdate: (props) => {
            component.updateProps({ items: props.items, command: props.command });
            popup.setProps({ getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect() });
          },
          onKeyDown: (props) => {
            if (props.event.key === "Escape") { popup.hide(); return true; }
            return component.ref?.onKeyDown(props) ?? false;
          },
          onExit: () => { popup.destroy(); component.destroy(); },
        };
      },
    },
  });
}
