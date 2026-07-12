import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FolderOpen, Calendar, Target, Crown, Plus, MoreHorizontal, Link2, Flag,
  Send, Reply, Paperclip as AttachIcon, List, LayoutGrid,
  GanttChartSquare, CalendarDays, Table2, FileText, FormInput, PenLine,
  MessageSquare, User, Filter, ArrowUpDown, Info, X,
} from "lucide-react";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
import { QuickAddPopover } from "./QuickAddPopover";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Project Detail Page",
  parameters: {
    docs: {
      description: {
        component:
          "Single-project full page. A project is a bounded record that is also a container of tasks — the page keeps the two cleanly separate:\n\n" +
          "• **Header = the record.** Title with the lifecycle (status, priority) inline, a quick-glance meta row (goal, owner, due), and two header affordances that open right-side panels: an **info icon → Details** (description, roles, milestones) and a **comment icon → Activity** (unified comments + events, with an unread badge).\n" +
          "• **Body = the work, full width.** The project opens on its **List** of tasks. Board / Timeline are built-in lenses, and **+ Add view** adds what a project needs (Calendar, Table, Doc, Form, Whiteboard). The view row is purely task-views — nothing else competes.\n\n" +
          "Details is reference (rarely opened, so it's tucked away); Activity is the living pulse (same panel treatment, but a badge keeps it discoverable). Deliberately NOT the department-page shell: a department is a standing aggregator; a project is a bounded record whose task list is the point.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const TASK_TEMPLATE = "2.2fr 1fr 1fr 110px";

const TEAM = [
  { id: "1", name: "Autumn Alexander", initials: "AA" },
  { id: "2", name: "Jordan Lee", initials: "JL" },
];

const TAG_COLORS: Record<string, string> = {
  Legal: "bg-violet-100 text-violet-800",
  Finance: "bg-emerald-100 text-emerald-800",
  Operations: "bg-orange-100 text-orange-800",
  Brokerage: "bg-cyan-100 text-cyan-800",
};

interface TaskRow {
  id: string; title: string; status: string;
  priority: string; section: string; tag: string;
}

const TASKS: TaskRow[] = [
  { id: "1", title: "Commission property inspection and environmental report", status: "done",        priority: "high",   section: "Due diligence",          tag: "Operations" },
  { id: "2", title: "Review title search and survey",                         status: "in_progress", priority: "medium", section: "Due diligence",          tag: "Legal"      },
  { id: "3", title: "Validate financial model and rent roll",                 status: "todo",        priority: "medium", section: "Due diligence",          tag: "Finance"    },
  { id: "4", title: "Negotiate purchase and sale agreement",                  status: "todo",        priority: "high",   section: "Negotiation & contract", tag: "Legal"      },
  { id: "5", title: "Secure financing commitment letter",                     status: "todo",        priority: "medium", section: "Negotiation & contract", tag: "Finance"    },
  { id: "6", title: "Coordinate closing statement and wire transfer",         status: "todo",        priority: "low",    section: "Closing",                tag: "Brokerage"  },
];

// Built-in views ship first; + Add view offers the rest (persisted per-project in the app).
const BUILT_IN_VIEWS = [
  { id: "list",     label: "List",     icon: List },
  { id: "board",    label: "Board",    icon: LayoutGrid },
  { id: "timeline", label: "Timeline", icon: GanttChartSquare },
] as const;

const ADD_VIEW_OPTIONS = [
  { label: "Calendar",   icon: CalendarDays },
  { label: "Table",      icon: Table2 },
  { label: "Doc",        icon: FileText },
  { label: "Form",       icon: FormInput },
  { label: "Whiteboard", icon: PenLine },
];

const STATUS_COLS = [
  { id: "todo",        name: "To do",       color: "220 12% 55%" },
  { id: "in_progress", name: "In progress", color: "215 80% 55%" },
  { id: "done",        name: "Done",        color: "152 65% 42%" },
];

// Unified activity feed — comments and system events in one thread (ActivityPanel in the app).
const ACTIVITY = [
  { type: "event",   who: "Autumn Alexander", initials: "AA", text: "created this project",               when: "Oct 14 at 9:08 am" },
  { type: "event",   who: "Jordan Lee",       initials: "JL", text: "joined the project team",            when: "Oct 14 at 9:15 am" },
  { type: "comment", who: "Jordan Lee",       initials: "JL", text: "Initial due diligence docs uploaded. Starting title review now.", when: "Jan 15 at 8:52 am" },
  { type: "event",   who: "Autumn Alexander", initials: "AA", text: "changed status to In Progress",      when: "Feb 6 at 9:49 am" },
  { type: "comment", who: "Autumn Alexander", initials: "AA", text: "@Jordan — can you confirm the title search is on track for this week?", when: "Jun 30 at 7:53 am" },
];

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]";
  return (
    <div className={cn("rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium shrink-0", sz)}>
      {initials}
    </div>
  );
}

function ProjectDetailDemo() {
  const [view, setView] = useState<string>("list");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [tasks, setTasks] = useState(TASKS);
  const [moreOpen, setMoreOpen] = useState(false);
  const [addViewOpen, setAddViewOpen] = useState(false);
  const [comment, setComment] = useState("");

  const sections = Array.from(new Set(tasks.map((t) => t.section)));
  const updateTaskStatus = (id: string, status: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  // Details and Activity are peer right-panels — one at a time.
  const openDetails = () => { setActivityOpen(false); setDetailsOpen(true); };
  const openActivity = () => { setDetailsOpen(false); setActivityOpen(true); };
  const commentCount = ACTIVITY.filter((a) => a.type === "comment").length;

  return (
    <div
      className="relative border border-border/40 rounded-xl overflow-hidden bg-background"
      style={{ width: 1040, height: 700, display: "flex", flexDirection: "column" }}
    >
      {/* ── Header = the record ─────────────────────────────────────────── */}
      <div className="px-6 pt-4 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            title="Back to projects"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded p-0.5 hover:bg-accent/60"
          >
            <FolderOpen className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold leading-tight truncate cursor-pointer hover:bg-accent/30 rounded px-2 -mx-1 py-0.5">
            Property acquisition
          </h1>
          <span className="text-muted-foreground/30 mx-0.5">·</span>
          <StatusPill kind="project" value="in_progress" onChange={() => {}} />
          <span className="text-muted-foreground/30">·</span>
          <PriorityPill value="high" size="sm" onChange={() => {}} />

          <div className="ml-auto flex items-center gap-1">
            {/* Info → Details panel (reference; rarely opened) */}
            <button
              onClick={openDetails}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              title="Project details"
              aria-label="Project details"
            >
              <Info className="h-4 w-4" />
            </button>
            {/* Comment → Activity panel (living pulse; badge keeps it discoverable) */}
            <button
              onClick={openActivity}
              className="relative h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              title="Activity"
              aria-label="Activity"
            >
              <MessageSquare className="h-4 w-4" />
              {commentCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold flex items-center justify-center">
                  {commentCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                aria-label="More"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-border bg-card shadow-lg p-1">
                  <button
                    onClick={() => setMoreOpen(false)}
                    className="w-full flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-accent text-left"
                  >
                    <Link2 className="h-3.5 w-3.5" /> Copy link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick-glance meta — most-referenced properties inline; the rest live in Details */}
        <div className="flex items-center gap-4 mt-2 ml-7 text-xs text-muted-foreground">
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Target className="h-3 w-3" /> Q3 Growth Goals
          </button>
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <User className="h-3 w-3" /> Autumn +1
          </button>
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Calendar className="h-3 w-3" /> Jul 30, 2026
          </button>
        </div>
      </div>

      {/* ── View row = the container. Purely task-views. ────────────────── */}
      <div className="flex items-center gap-1 px-6 mt-3 border-b border-border/50 shrink-0">
        {BUILT_IN_VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={cn(
              "flex items-center gap-1.5 text-sm px-2 pb-2.5 pt-1 border-b-2 transition-colors -mb-px",
              view === id ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}

        <div className="relative">
          <button
            onClick={() => setAddViewOpen((o) => !o)}
            className="flex items-center gap-1 text-sm px-2 pb-2.5 pt-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add view
          </button>
          {addViewOpen && (
            <div className="absolute left-0 top-full mt-1 z-20 w-44 rounded-lg border border-border bg-card shadow-lg p-1">
              {ADD_VIEW_OPTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setAddViewOpen(false)}
                  className="w-full flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-accent text-left"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-2.5 border-b border-border/40 shrink-0 text-muted-foreground">
        <button className="flex items-center gap-1.5 text-xs hover:text-foreground"><Filter className="h-3.5 w-3.5" /> Filter</button>
        <button className="flex items-center gap-1.5 text-xs hover:text-foreground"><ArrowUpDown className="h-3.5 w-3.5" /> Sort</button>
        <div className="ml-auto">
          <QuickAddPopover
            triggerLabel="New task"
            placeholder="Task name…"
            onAdd={(title) =>
              setTasks((prev) => [
                ...prev,
                { id: crypto.randomUUID(), title, status: "todo", priority: "medium", section: sections[0] || "To Do", tag: "Operations" },
              ])
            }
          />
        </div>
      </div>

      {/* ── Body = the work ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {view === "list" && (
          <div className="px-6 py-4 space-y-5">
            {sections.map((section) => (
              <div key={section}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{section}</h4>
                <DataTableShell>
                  <DataTableHeader template={TASK_TEMPLATE}>
                    <span>Task</span><span>Status</span><span>Priority</span><span>Tag</span>
                  </DataTableHeader>
                  {tasks.filter((t) => t.section === section).map((t) => (
                    <DataTableRow key={t.id} template={TASK_TEMPLATE}>
                      <span style={{ fontWeight: 600 }}>{t.title}</span>
                      <StatusPill kind="task" value={t.status} size="sm" onChange={(v) => updateTaskStatus(t.id, v)} />
                      <PriorityPill value={t.priority} size="sm" onChange={() => {}} />
                      <span className={cn("inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[11px] font-medium", TAG_COLORS[t.tag])}>
                        {t.tag}
                      </span>
                    </DataTableRow>
                  ))}
                </DataTableShell>
              </div>
            ))}
          </div>
        )}

        {view === "board" && (
          <div className="flex gap-3 px-6 py-4 h-full">
            {STATUS_COLS.map((col) => {
              const items = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="flex flex-col rounded-xl bg-muted/30 border border-border/30 w-[280px] shrink-0">
                  <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${col.color})` }} />
                      <span className="text-xs font-medium">{col.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="p-2 space-y-2">
                    {items.map((t) => (
                      <div key={t.id} className="rounded-lg border border-border/50 bg-card p-3 space-y-2">
                        <p className="text-sm font-medium leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2">
                          <PriorityPill value={t.priority} size="sm" onChange={() => {}} />
                          <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium", TAG_COLORS[t.tag])}>{t.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "timeline" && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-muted-foreground">
            <GanttChartSquare className="h-6 w-6 text-muted-foreground/60" />
            <p className="text-sm">Timeline view</p>
            <p className="text-xs text-muted-foreground/70 max-w-xs">Schedule tasks across dates. Same tasks as the List and Board — just a different lens.</p>
          </div>
        )}
      </div>

      {/* ── Details panel — record properties. Reference; opens on the info icon. ── */}
      {detailsOpen && (
        <>
          <div className="absolute inset-0 z-20 bg-foreground/10" onClick={() => setDetailsOpen(false)} />
          <aside className="absolute top-0 right-0 z-30 h-full w-[360px] bg-card border-l border-border/60 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-12 border-b border-border/50 shrink-0">
              <span className="text-sm font-semibold">Details</span>
              <button onClick={() => setDetailsOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close details">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Description</h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Tracks a single real estate deal from initial due diligence through closing. Centralises tasks, documents, and milestones for the acquisition team.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Connected goal</h3>
                <button className="w-full flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-accent/30 transition-colors text-left">
                  <Target className="h-4 w-4 text-muted-foreground shrink-0" /> Q3 Growth Goals
                </button>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Roles</h3>
                <div className="space-y-1.5">
                  {TEAM.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2 text-sm">
                      <Avatar initials={p.initials} size="sm" />
                      <span>{p.name}</span>
                      {i === 0 && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Crown className="h-3 w-3" /> Owner</span>}
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground pt-0.5">
                    <Plus className="h-3 w-3" /> Add member
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Milestones</h3>
                <button className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground">
                  <Flag className="h-3.5 w-3.5" /> Add a milestone
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Activity panel — unified comments + events + composer. Opens on the comment icon. ── */}
      {activityOpen && (
        <>
          <div className="absolute inset-0 z-20 bg-foreground/10" onClick={() => setActivityOpen(false)} />
          <aside className="absolute top-0 right-0 z-30 h-full w-[400px] bg-card border-l border-border/60 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-12 border-b border-border/50 shrink-0">
              <span className="text-sm font-semibold">Activity</span>
              <button onClick={() => setActivityOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close activity">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {ACTIVITY.map((item, i) => (
                item.type === "event" ? (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Avatar initials={item.initials} size="sm" />
                    <div>
                      <span className="font-medium text-foreground/80">{item.who}</span> {item.text}
                      <span className="block text-muted-foreground/60 mt-0.5">{item.when}</span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2.5">
                    <Avatar initials={item.initials} />
                    <div className="flex-1 min-w-0 rounded-xl bg-muted/50 px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{item.who}</span>
                        <span className="text-[10px] text-muted-foreground">{item.when}</span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{item.text}</p>
                      <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mt-1.5 transition-colors">
                        <Reply className="h-3 w-3" /> Reply
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="border-t border-border/40 p-3 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment or @mention…"
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50"
                />
                <button className="text-muted-foreground hover:text-foreground p-1"><AttachIcon className="h-3.5 w-3.5" /></button>
                <button className={cn("p-1 rounded-lg transition-colors", comment.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground/40 cursor-default")}>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export const FullPage: Story = {
  render: () => <ProjectDetailDemo />,
};
