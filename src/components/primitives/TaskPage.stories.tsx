import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CheckSquare, Plus, Search, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { DataTableShell } from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
import { DetailSheet } from "./DetailSheet";
import { Badge } from "../ui/badge";
import { RichTextEditor } from "../ui/rich-text-editor";
import { FilterMenu, matchesFilters, type FilterState } from "./FilterMenu";
import { DatePicker } from "../ui/date-picker";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Task Page",
  parameters: {
    docs: {
      description: {
        component:
          "Second full-page composition, built to test whether DetailSheet's tabs generalize across entity kinds. Same shell as CRM Page (EntityViewTabs board/list switcher, EntityCard kanban, DetailSheet peek) — but tasks get a Subtasks tab instead of Docs, since that's the thing unique to this entity.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const STAGES = [
  { id: "todo", name: "To Do", color: "220 12% 55%" },
  { id: "in_progress", name: "In Progress", color: "215 80% 55%" },
  { id: "done", name: "Done", color: "152 65% 42%" },
];

const FILTER_FIELDS = [
  { key: "stage", label: "Status", options: STAGES.map((s) => ({ value: s.id, label: s.name })) },
  {
    key: "priority", label: "Priority",
    options: [
      { value: "low", label: "Low" }, { value: "medium", label: "Medium" },
      { value: "high", label: "High" }, { value: "urgent", label: "Urgent" },
    ],
  },
];

interface TaskRecord {
  id: string;
  stage: string;
  title: string;
  description: string;
  priority: string;
  days: number;
  /** Days from today the task is due — drives the Timeline view. Undefined = no due date. */
  dueOffset?: number;
  subtasks: { id: string; label: string; done: boolean }[];
}

const INITIAL_TASKS: TaskRecord[] = [
  {
    id: "1", stage: "todo", title: "Draft Q3 investor update", description: "Pull numbers from finance, write narrative.",
    priority: "high", days: 1, dueOffset: 0,
    subtasks: [
      { id: "a", label: "Pull revenue numbers", done: true },
      { id: "b", label: "Write narrative draft", done: false },
      { id: "c", label: "Review with CFO", done: false },
    ],
  },
  {
    id: "2", stage: "todo", title: "Renew office lease", description: "Lease expires end of month.",
    priority: "medium", days: 4, dueOffset: 3,
    subtasks: [{ id: "a", label: "Get renewal terms from landlord", done: false }],
  },
  {
    id: "3", stage: "in_progress", title: "Migrate billing to Stripe", description: "Cut over from legacy invoicing.",
    priority: "urgent", days: 9, dueOffset: 1,
    subtasks: [
      { id: "a", label: "Map existing plans to Stripe products", done: true },
      { id: "b", label: "Test webhook handling", done: true },
      { id: "c", label: "Cut over production", done: false },
    ],
  },
  {
    id: "4", stage: "done", title: "Onboard new SDR", description: "Account setup, CRM training.",
    priority: "low", days: 0, dueOffset: -1,
    subtasks: [{ id: "a", label: "Provision accounts", done: true }],
  },
];

const TIMELINE_DAYS = 7;

function timelineDate(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function TaskPageDemo() {
  const [view, setView] = useState<ViewType>("board");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [peekId, setPeekId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});

  const visibleTasks = tasks.filter((t) => matchesFilters(t, FILTER_FIELDS, filters));
  const peek = tasks.find((t) => t.id === peekId) ?? null;

  function updateTask(id: string, patch: Partial<TaskRecord>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id !== taskId
          ? t
          : { ...t, subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)) },
      ),
    );
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 920, height: 600, display: "flex", flexDirection: "column" }}>
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold leading-tight">Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-64"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New task
          </Button>
        </div>
      </div>

      <div className="px-6 pt-3">
        <EntityViewTabs views={["board", "list", "timeline"]} active={view} onChange={setView} filterSlot={<FilterMenu fields={FILTER_FIELDS} value={filters} onChange={setFilters} />} onSort={() => {}} />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {view === "board" ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STAGES.map((stage) => {
              const items = visibleTasks.filter((t) => t.stage === stage.id);
              return (
                <div key={stage.id} className="flex flex-col rounded-xl bg-muted/30 border border-border/30 min-h-[200px] flex-1 min-w-[240px] max-w-[280px] shrink-0">
                  <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: `hsl(${stage.color})` }} />
                      <span className="text-xs font-medium truncate">{stage.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{items.length}</span>
                  </div>
                  <div className="p-2 space-y-2 flex-1">
                    {items.map((t) => (
                      <EntityCard
                        key={t.id}
                        kind="task"
                        title={t.title}
                        description={t.description}
                        priority={t.priority}
                        dateLabel={t.days === 0 ? "Today" : `${t.days}d in stage`}
                        dateIcon={Clock}
                        metadata={[{ icon: CheckSquare, value: `${t.subtasks.filter((s) => s.done).length}/${t.subtasks.length}` }]}
                        onClick={() => setPeekId(t.id)}
                      />
                    ))}
                    {items.length === 0 && (
                      <div className="text-[11px] text-muted-foreground/60 text-center py-4">Drop here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : view === "list" ? (
          <DataTableShell>
            {visibleTasks.map((t) => (
              <EntityCard
                key={t.id}
                layout="row"
                kind="task"
                status={t.stage}
                onStatusChange={(v) => updateTask(t.id, { stage: v })}
                title={t.title}
                description={t.description}
                priority={t.priority}
                onPriorityChange={(v) => updateTask(t.id, { priority: v })}
                dateLabel={t.days === 0 ? "Today" : `${t.days}d in stage`}
                dateIcon={Clock}
                metadata={[{ icon: CheckSquare, value: `${t.subtasks.filter((s) => s.done).length}/${t.subtasks.length}` }]}
                onClick={() => setPeekId(t.id)}
              />
            ))}
          </DataTableShell>
        ) : (
          <div className="flex gap-px bg-border/40 rounded-xl overflow-hidden border border-border/40">
            {Array.from({ length: TIMELINE_DAYS }, (_, i) => i).map((offset) => {
              const date = timelineDate(offset);
              const isToday = offset === 0;
              const dayTasks = visibleTasks.filter((t) => t.dueOffset === offset);
              return (
                <div key={offset} className="flex-1 min-w-[120px] bg-background flex flex-col">
                  <div className={cn("px-2 py-2 text-center border-b border-border/40", isToday && "bg-primary/[0.06]")}>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <div className={cn("text-sm font-semibold", isToday ? "text-primary" : "text-foreground")}>
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="flex-1 p-1.5 space-y-1.5 min-h-[120px]">
                    {dayTasks.map((t) => (
                      <EntityCard
                        key={t.id}
                        kind="task"
                        title={t.title}
                        priority={t.priority}
                        onClick={() => setPeekId(t.id)}
                        className="text-xs"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unscheduled — tasks with no dueOffset don't appear on the timeline grid */}
      {view === "timeline" && visibleTasks.some((t) => t.dueOffset === undefined) && (
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground mb-1.5">No due date</p>
          <div className="flex gap-2 flex-wrap">
            {visibleTasks.filter((t) => t.dueOffset === undefined).map((t) => (
              <button
                key={t.id}
                onClick={() => setPeekId(t.id)}
                className="text-xs px-2.5 py-1 rounded-md border border-border/40 bg-muted/30 hover:bg-accent/50 transition-colors"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {peek && (
        <DetailSheet
          open={!!peek}
          onOpenChange={(o) => !o && setPeekId(null)}
          accentColor={STAGES.find((s) => s.id === peek.stage)?.color}
          typeBadge={<Badge variant="outline">Task</Badge>}
          statusSlot={<StatusPill kind="task" value={peek.stage} onChange={(v) => updateTask(peek.id, { stage: v })} />}
          name={peek.title}
          onNameChange={(v) => updateTask(peek.id, { title: v })}
          description={peek.description}
          onDescriptionChange={(v) => updateTask(peek.id, { description: v })}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">Priority</span>
                    <PriorityPill value={peek.priority} onChange={(v) => updateTask(peek.id, { priority: v })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">Due date</span>
                    <div className="w-40">
                      <DatePicker
                        value={peek.dueOffset !== undefined ? timelineDate(peek.dueOffset) : null}
                        onChange={(date) => {
                          const msPerDay = 1000 * 60 * 60 * 24;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const target = new Date(date);
                          target.setHours(0, 0, 0, 0);
                          updateTask(peek.id, { dueOffset: Math.round((target.getTime() - today.getTime()) / msPerDay) });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              // Task-specific tab — the thing that doesn't generalize from CRM Page.
              value: "subtasks",
              label: "Subtasks",
              content: (
                <div className="space-y-2">
                  {peek.subtasks.map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
                      <Checkbox checked={s.done} onCheckedChange={() => toggleSubtask(peek.id, s.id)} />
                      <span className={s.done ? "line-through text-muted-foreground" : "text-foreground"}>{s.label}</span>
                    </label>
                  ))}
                </div>
              ),
            },
            {
              value: "notes",
              label: "Notes",
              content: <RichTextEditor borderless showToolbar minHeight="280px" placeholder="Add notes…" />,
            },
            {
              value: "attachments",
              label: "Attachments",
              content: (
                <div className="flex flex-col items-center justify-center text-center py-10 text-sm text-muted-foreground">
                  <p>No attachments yet.</p>
                  <p className="text-xs mt-1">Attachments aren't designed yet — placeholder for the upcoming pattern.</p>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

export const FullPage: Story = {
  render: () => <TaskPageDemo />,
};
