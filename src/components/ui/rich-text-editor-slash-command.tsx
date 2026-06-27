// Slash command menu for RichTextEditor — type "/" to open a command list
// that inserts a block. Standard TipTap recipe: a Suggestion-backed
// Extension + a ReactRenderer popup positioned with tippy.

import * as React from "react";
import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { cn } from "@/lib/utils";

export interface SlashCommandItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  command: (editor: Editor) => void;
}

interface CommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = React.forwardRef<CommandListRef, CommandListProps>(({ items, command }, ref) => {
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => setSelected(0), [items]);

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowDown") {
        setSelected((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelected((i) => (i - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        if (items[selected]) command(items[selected]);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) return null;

  return (
    <div className="w-56 rounded-xl border border-border/35 bg-card/55 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] p-1.5 max-h-72 overflow-y-auto">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => command(item)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-left transition-colors",
              i === selected ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {item.title}
          </button>
        );
      })}
    </div>
  );
});
CommandList.displayName = "SlashCommandList";

function buildSuggestion(items: SlashCommandItem[]): Omit<SuggestionOptions, "editor"> {
  return {
    char: "/",
    items: ({ query }) =>
      items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10),
    render: () => {
      let component: ReactRenderer<CommandListRef, CommandListProps>;
      let popup: TippyInstance;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandList, {
            props: { items: props.items, command: (item: SlashCommandItem) => props.command(item) },
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
          component.updateProps({ items: props.items, command: (item: SlashCommandItem) => props.command(item) });
          popup.setProps({ getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect() });
        },
        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            popup.hide();
            return true;
          }
          return component.ref?.onKeyDown(props) ?? false;
        },
        onExit: () => {
          popup.destroy();
          component.destroy();
        },
      };
    },
  };
}

export const SlashCommand = Extension.create<{ items: SlashCommandItem[] }>({
  name: "slashCommand",

  addOptions() {
    return { items: [] };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...buildSuggestion(this.options.items),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          (props as SlashCommandItem).command(editor);
        },
      }),
    ];
  },
});
