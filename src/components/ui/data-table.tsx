// DataTable — column-driven table with user-controlled column order and
// visibility, via a "Columns" manager popover (drag to reorder, checkbox to
// show/hide). Distinct from data-table-shell.tsx's primitives (DataTableShell/
// DataTableHeader/DataTableRow), which stay for hand-rolled tables that don't
// need reordering — this is for tables where "organize the columns the way
// I want" matters (spreadsheet-like views: CRM contacts, linked-task lists).

import * as React from "react";
import { GripVertical, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  /** CSS grid fr-unit width, e.g. "2fr". Defaults to "1fr". */
  width?: string;
  /** Set false for a column that must always stay visible (rare). Default true. */
  hideable?: boolean;
  render: (row: T) => React.ReactNode;
}

export function useColumnOrder<T>(columns: DataTableColumn<T>[]) {
  const [order, setOrder] = React.useState(columns.map((c) => c.key));
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());

  function moveColumn(from: number, to: number) {
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return { order, hidden, moveColumn, toggleHidden };
}

function ColumnsMenu<T>({
  columns, order, hidden, onReorder, onToggleHidden,
}: {
  columns: DataTableColumn<T>[];
  order: string[];
  hidden: Set<string>;
  onReorder: (from: number, to: number) => void;
  onToggleHidden: (key: string) => void;
}) {
  const byKey = React.useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);
  const dragIndex = React.useRef<number | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/60 transition-colors">
          <Columns3 className="h-3.5 w-3.5" /> Columns
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-1.5">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Drag to reorder</p>
        {order.map((key, i) => {
          const col = byKey.get(key);
          if (!col) return null;
          return (
            <div
              key={key}
              draggable
              onDragStart={() => { dragIndex.current = i; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null && dragIndex.current !== i) onReorder(dragIndex.current, i);
                dragIndex.current = null;
              }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent/50 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <Checkbox
                checked={!hidden.has(key)}
                disabled={col.hideable === false}
                onCheckedChange={() => onToggleHidden(key)}
                className="h-4 w-4"
              />
              <span className="flex-1 truncate">{col.label}</span>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({ columns, data, rowKey, onRowClick, className }: DataTableProps<T>) {
  const { order, hidden, moveColumn, toggleHidden } = useColumnOrder(columns);
  const byKey = React.useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);
  const visible = order.map((k) => byKey.get(k)).filter((c): c is DataTableColumn<T> => !!c && !hidden.has(c.key));
  const template = visible.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-end">
        <ColumnsMenu columns={columns} order={order} hidden={hidden} onReorder={moveColumn} onToggleHidden={toggleHidden} />
      </div>

      <div className="rounded-xl overflow-hidden bg-card border border-border/40 shadow-card-lift">
        <div
          className="grid gap-x-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand-purple-muted))] border-b border-border/40 bg-muted/20"
          style={{ gridTemplateColumns: template }}
        >
          {visible.map((c) => <span key={c.key}>{c.label}</span>)}
        </div>

        {data.map((row) => (
          <div
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              "grid gap-x-4 items-center px-5 py-3 text-sm border-b border-border/30 last:border-b-0 hover:bg-accent/40 transition-colors",
              onRowClick && "cursor-pointer",
            )}
            style={{ gridTemplateColumns: template }}
          >
            {visible.map((c) => <span key={c.key} className="min-w-0">{c.render(row)}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
