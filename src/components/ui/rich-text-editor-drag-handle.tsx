// DragHandle — grab a top-level block (paragraph, heading, list, etc.) and
// reorder it, per the spec doc's promise ("drag handles") that was never
// built. Self-contained ProseMirror plugin: a grip widget appears in the
// left gutter on hover over a top-level block; native HTML5 drag-and-drop
// moves that block's node to wherever you drop it.

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const key = new PluginKey("dragHandle");

export const DragHandle = Extension.create({
  name: "dragHandle",

  addProseMirrorPlugins() {
    let hoveredPos: number | null = null;

    return [
      new Plugin({
        key,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            if (hoveredPos === null) return DecorationSet.empty;
            const resolved = state.doc.resolve(hoveredPos);
            const blockPos = resolved.before(1);
            const widget = Decoration.widget(blockPos, () => {
              const handle = document.createElement("div");
              handle.className = "rte-drag-handle";
              handle.draggable = true;
              handle.innerHTML =
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/></svg>';
              handle.addEventListener("dragstart", (e) => {
                e.dataTransfer?.setData("text/plain", String(blockPos));
                e.dataTransfer!.effectAllowed = "move";
              });
              return handle;
            }, { side: -1, key: `drag-handle-${blockPos}` });
            return DecorationSet.create(state.doc, [widget]);
          },
          handleDOMEvents: {
            mousemove(view, event) {
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              const next = pos ? pos.pos : null;
              if (next !== hoveredPos) {
                hoveredPos = next;
                view.dispatch(view.state.tr.setMeta("dragHandleHover", true));
              }
              return false;
            },
            dragover(view, event) {
              event.preventDefault();
              return true;
            },
            drop(view, event) {
              event.preventDefault();
              const fromStr = event.dataTransfer?.getData("text/plain");
              if (!fromStr) return false;
              const from = parseInt(fromStr, 10);
              const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!dropPos) return false;

              const { state } = view;
              const $from = state.doc.resolve(from);
              const blockStart = $from.before(1);
              const blockNode = $from.parent.maybeChild($from.index());
              if (!blockNode) return false;
              const blockEnd = blockStart + blockNode.nodeSize;

              let target = state.doc.resolve(dropPos.pos).before(1);
              if (target >= blockStart && target < blockEnd) return false; // dropped on itself

              let tr = state.tr.delete(blockStart, blockEnd);
              // If the target was after the removed block, shift it back by the removed size.
              if (target > blockEnd) target -= blockEnd - blockStart;
              tr = tr.insert(target, blockNode);
              view.dispatch(tr);
              return true;
            },
          },
        },
      }),
    ];
  },
});
