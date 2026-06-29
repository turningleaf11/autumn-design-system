// Calendar — plain month-grid, native Date math (no date-fns/react-day-picker
// dependency — consistent with how Task Page's Timeline view already does
// its own date math). Used standalone or inside DatePicker's popover.

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: Date | null;
  onSelect: (date: Date) => void;
  className?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function Calendar({ value, onSelect, className }: Props) {
  const [cursor, setCursor] = React.useState(() => value ?? new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date();

  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(year, month, i + 1)),
  ];

  function shiftMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1));
  }

  return (
    <div className={cn("w-64 p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-semibold">{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
        <button onClick={() => shiftMonth(1)} aria-label="Next month" className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground/70">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const selected = value && isSameDay(date, value);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className={cn(
                "h-7 w-7 rounded-md text-xs transition-colors flex items-center justify-center",
                selected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground",
                !selected && isToday && "text-primary font-semibold",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
