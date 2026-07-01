import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  CheckSquare, Plus, Search, Clock, Send, Paperclip, Calendar, User,
  CheckCircle2, X, Flag, Folder, Check, FileText, ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Sheet, SheetContent } from "../ui/sheet";
import { DataTableShell } from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
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
          "Second full-page composition, sharing the CRM Page shell (EntityViewTabs board/list switcher, EntityCard kanban) but with its own peek pattern. Unlike DetailSheet's tabbed peek (used by CRM, Goal, Project, Issue, Docs, Inbox), the task peek follows Asana's structure instead: no tabs — assignee, due date, priority, description, subtasks, notes, and attachments are all visible in one scrolling column, with activity/comments pinned at the bottom using the same composer used everywhere else in the app.",
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

const TEAM = [
  { id: "u1", name: "Sam Lin" },
  { id: "u2", name: "Priya Shah" },
  { id: "u3", name: "Jordan Reyes" },
];

interface TaskRecord {
  id: string;
  stage: string;
  title: string;
  description: string;
  priority: string;
  assigneeId?: string;
  project: string;
  notes: string;
  days: number;
  /** Days from today the task is due — drives the Timeline view. Undefined = no due date. */
  dueOffset?: number;
  subtasks: { id: string; label: string; done: boolean }[];
}

const INITIAL_TASKS: TaskRecord[] = [
  {
    id: "1", stage: "todo", title: "Draft Q3 investor update", description: "Pull numbers from finance, write narrative.",
    priority: "high", assigneeId: "u1", project: "Investor Relations", notes: "", days: 1, dueOffset: 0,
    subtasks: [
      { id: "a", label: "Pull revenue numbers", done: true },
      { id: "b", label: "Write narrative draft", done: false },
      { id: "c", label: "Review with CFO", done: false },
    ],
  },
  {
    id: "2", stage: "todo", title: "Renew office lease", description: "Lease expires end of month.",
    priority: "medium", project: "Facilities", notes: "", days: 4, dueOffset: 3,
    subtasks: [{ id: "a", label: "Get renewal terms from landlord", done: false }],
  },
  {
    id: "3", stage: "in_progress", title: "Migrate billing to Stripe", description: "Cut over from legacy invoicing.",
    priority: "urgent", assigneeId: "u2", project: "Platform", notes: "<p>Cutover window: Saturday 2am–5am ET. Comms draft pending.</p>", days: 9, dueOffset: 1,
    subtasks: [
      { id: "a", label: "Map existing plans to Stripe products", done: true },
      { id: "b", label: "Test webhook handling", done: true },
      { id: "c", label: "Cut over production", done: false },
    ],
  },
  {
    id: "4", stage: "done", title: "Onboard new SDR", description: "Account setup, CRM training.",
    priority: "low", assigneeId: "u3", project: "Sales Ops", notes: "", days: 0, dueOffset: -1,
    subtasks: [{ id: "a", label: "Provision accounts", done: true }],
  },
];

const MOCK_ACTIVITY: { id: string; kind: "event" | "comment"; author: string; text: string; time: string }[] = [
  { id: "1", kind: "event", author: "Sam Lin", text: "moved this to In Progress", time: "2d ago" },
  { id: "2", kind: "comment", author: "Priya Shah", text: "Webhook handling tested against the Stripe sandbox — looks good.", time: "1d ago" },
  { id: "3", kind: "event", author: "Sam Lin", text: "changed priority to Urgent", time: "18h ago" },
  { id: "4", kind: "comment", author: "Priya Shah", text: "Cutting over production tomorrow morning, will post here once it's live.", time: "2h ago" },
];

const TIMELINE_DAYS = 7;

function timelineDate(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function FieldRow({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Mock activity/comments thread — stands in for ActivityPanel (an app-level,
// Supabase-backed component). Uses the same composer affordances (attach,
// send) and size as the rest of the app — the task peek pins this at the
// bottom, sharing remaining height with the scrollable content above it,
// rather than capping it to a small fixed box.
function TaskActivityThread() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Activity</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-3 pb-2">
        {MOCK_ACTIVITY.map((a) =>
          a.kind === "event" ? (
            <div key={a.id} className="text-xs text-muted-foreground/70">
              <span className="font-medium text-muted-foreground">{a.author}</span> {a.text} · {a.time}
            </div>
          ) : (
            <div key={a.id} className="flex gap-2.5 text-sm">
              <div className="h-6 w-6 rounded-full bg-muted shrink-0 flex items-center justify-center text-[10px] font-medium">
                {a.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-medium text-xs">{a.author}</span>
                  <span className="text-[10px] text-muted-foreground/60">{a.time}</span>
                </div>
                <p className="text-foreground/90">{a.text}</p>
              </div>
            </div>
          ),
        )}
      </div>
      <div className="shrink-0 border-t border-border/40 px-3 py-2 flex items-center gap-2">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Paperclip className="h-3.5 w-3.5" />
        </button>
        <input
          placeholder="Leave a comment…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function TaskPageDemo() {
  const [view, setView] = useState<ViewType>("board");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [peekId, setPeekId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [newSubtask, setNewSubtask] = useState("");

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

  function removeSubtask(taskId: string, subtaskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id !== taskId ? t : { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) })),
    );
  }

  function addSubtask(taskId: string) {
    if (!newSubtask.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id !== taskId
          ? t
          : { ...t, subtasks: [...t.subtasks, { id: crypto.randomUUID(), label: newSubtask.trim(), done: false }] },
      ),
    );
    setNewSubtask("");
  }

  const assignee = TEAM.find((m) => m.id === peek?.assigneeId);
  const isDone = peek?.stage === "done";

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

      {/* Task peek — deliberately NOT DetailSheet. Asana structure: no tabs,
          everything visible in one scroll, activity pinned at the bottom. */}
      {peek && (
        <Sheet open={!!peek} onOpenChange={(o) => !o && setPeekId(null)}>
          <SheetContent className="p-0 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-1 shrink-0">
              <button
                onClick={() => updateTask(peek.id, { stage: isDone ? "todo" : "done" })}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium transition-colors",
                  isDone
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <CheckCircle2 className={cn("h-3.5 w-3.5", isDone && "fill-primary/20")} />
                {isDone ? "Completed" : "Mark complete"}
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: "55%" }}>
              <input
                value={peek.title}
                onChange={(e) => updateTask(peek.id, { title: e.target.value })}
                placeholder="Untitled"
                className="w-full text-xl font-bold bg-transparent outline-none border-b-2 border-transparent
                           hover:border-border/30 focus:border-primary/40 pb-1 mb-4 transition-colors"
              />

              <div className="space-y-2.5 mb-5">
                <FieldRow icon={Folder} label="Project">
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors">
                    {peek.project}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </button>
                </FieldRow>

                <FieldRow icon={User} label="Assignee">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-muted pl-1 pr-2.5 py-1 text-xs font-medium text-foreground transition-colors">
                        <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-semibold text-primary shrink-0">
                          {(assignee?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        {assignee?.name || "Unassigned"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-1" align="start">
                      <div className="max-h-64 overflow-y-auto">
                        {TEAM.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => updateTask(peek.id, { assigneeId: m.id })}
                            className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent/60 text-left"
                          >
                            <span className="truncate">{m.name}</span>
                            {peek.assigneeId === m.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                          </button>
                        ))}
                        {peek.assigneeId && (
                          <button
                            onClick={() => updateTask(peek.id, { assigneeId: undefined })}
                            className="w-full px-2 py-1.5 text-xs text-destructive text-left rounded-md hover:bg-accent/60"
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </FieldRow>

                <FieldRow icon={Calendar} label="Due date">
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
                </FieldRow>

                <FieldRow icon={Flag} label="Priority">
                  <PriorityPill value={peek.priority} size="sm" onChange={(v) => updateTask(peek.id, { priority: v })} />
                </FieldRow>

                <FieldRow icon={CheckCircle2} label="Status">
                  <StatusPill kind="task" value={peek.stage} onChange={(v) => updateTask(peek.id, { stage: v })} />
                </FieldRow>
              </div>

              <section className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Details</h3>
                <div className="overflow-y-auto rounded-md border border-transparent hover:border-border/30 focus-within:border-border/50 transition-colors" style={{ maxHeight: 180 }}>
                  <RichTextEditor
                    content={peek.notes || peek.description}
                    onChange={(html) => updateTask(peek.id, { notes: html })}
                    placeholder="Add a description, plans, context…"
                    borderless
                  />
                </div>
              </section>

              <section className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  Subtasks {peek.subtasks.length > 0 && (
                    <span className="text-muted-foreground/70 normal-case font-normal">
                      ({peek.subtasks.filter((s) => s.done).length}/{peek.subtasks.length})
                    </span>
                  )}
                </h3>
                <div className="space-y-1">
                  {peek.subtasks.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 py-1 px-2 -mx-2 rounded-md hover:bg-accent/30 group">
                      <Checkbox checked={s.done} onCheckedChange={() => toggleSubtask(peek.id, s.id)} />
                      <span className={cn("text-sm flex-1", s.done && "line-through text-muted-foreground")}>{s.label}</span>
                      <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity" onClick={() => removeSubtask(peek.id, s.id)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSubtask(peek.id)}
                      placeholder="Add a subtask…"
                      className="text-sm h-8 border-dashed"
                    />
                    <Button size="sm" variant="ghost" onClick={() => addSubtask(peek.id)} disabled={!newSubtask.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <section className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Docs</h3>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 border border-border/50 rounded-md px-3 py-2 group">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="flex-1 min-w-0 text-sm truncate">Stripe cutover runbook</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">Jun 28</span>
                    <X className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                  </div>
                  <button className="w-full flex items-center gap-2 border border-dashed border-border/50 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent/30 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> New doc or link existing
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  Attachments <Plus className="h-3 w-3 text-muted-foreground/70" />
                </h3>
                <div className="flex flex-col items-center justify-center text-center py-6 text-xs text-muted-foreground/70 border border-dashed border-border/50 rounded-lg" title="Not built yet">
                  <Paperclip className="h-4 w-4 mb-1.5 text-muted-foreground/50" />
                  No attachments yet
                </div>
              </section>
            </div>

            {/* Activity — pinned below, takes remaining height, same composer used everywhere else */}
            <div className="flex-1 min-h-0 border-t border-border/40 flex flex-col overflow-hidden">
              <TaskActivityThread />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export const FullPage: Story = {
  render: () => <TaskPageDemo />,
};
