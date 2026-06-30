import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FolderOpen, Calendar, Target, Crown, Plus, Link2,
  LayoutDashboard, CheckSquare, PenLine, FileText,
  FileSignature, Paperclip, Flag, MoreHorizontal, Users,
  Sparkles, Send, Reply, Paperclip as AttachIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
import { CollapsibleNotes } from "./CollapsibleNotes";
import { QuickAddPopover } from "./QuickAddPopover";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Project Detail Page",
  parameters: {
    docs: {
      description: {
        component:
          "Single-project full page. Source of truth for the project detail pattern: " +
          "(1) Folder icon is the back-nav — no back-arrow competing with the title. " +
          "(2) All meta (status/priority/team/date) on the same row as the title. " +
          "(3) Connected goal as a sub-line below the title. " +
          "(4) Persistent right-rail activity feed (comments + events unified) always " +
          "visible regardless of tab — no Messages tab. " +
          "(5) Overview tab is structured content only (notes, roles, goals, resources, " +
          "milestones); activity lives exclusively in the right rail. " +
          "(6) ⋯ dropdown holds secondary actions (copy link, etc.).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const TASK_TEMPLATE = "2.2fr 1fr 1fr 100px";

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

// Mock unified activity feed — comments and system events in one thread,
// sorted oldest-first. In the app this is rendered by ActivityPanel.
const ACTIVITY = [
  { type: "event",   who: "Autumn Alexander", initials: "AA", text: "created this project",               when: "Oct 14 at 9:08 am" },
  { type: "event",   who: "Jordan Lee",       initials: "JL", text: "joined the project team",            when: "Oct 14 at 9:15 am" },
  { type: "comment", who: "Jordan Lee",       initials: "JL", text: "Initial due diligence docs uploaded to the Files tab. Starting title review now.", when: "Jan 15 at 8:52 am" },
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
  const [tab, setTab] = useState("overview");
  const [tasks, setTasks] = useState(TASKS);
  const [moreOpen, setMoreOpen] = useState(false);
  const [comment, setComment] = useState("");

  const sections = Array.from(new Set(tasks.map((t) => t.section)));
  const updateTaskStatus = (id: string, status: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <div
      className="border border-border/40 rounded-xl overflow-hidden bg-background"
      style={{ width: 1200, height: 700, display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ── Left: main scrolling content ──────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          <div className="px-6 pt-4 pb-6">

            {/* Header — all meta on one row. Folder icon = back-nav. */}
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              {/* Folder icon is the back button — zero real-estate cost */}
              <button
                title="Back to projects"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded p-0.5 hover:bg-accent/60"
              >
                <FolderOpen className="h-5 w-5" />
              </button>

              <h1 className="text-2xl font-bold leading-tight truncate cursor-pointer hover:bg-accent/30 rounded px-2 -mx-1 py-1">
                Property acquisition
              </h1>

              <span className="text-muted-foreground/30 mx-0.5">·</span>
              <StatusPill kind="project" value="in_progress" onChange={() => {}} />
              <span className="text-muted-foreground/30">·</span>
              <PriorityPill value="high" size="sm" onChange={() => {}} />
              <span className="text-muted-foreground/30">·</span>

              {/* Team */}
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-md hover:bg-accent/50">
                <Users className="h-3 w-3" /> Autumn +1
              </button>
              <span className="text-muted-foreground/30">·</span>

              {/* Date */}
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-md hover:bg-accent/50">
                <Calendar className="h-3 w-3" /> Jul 30, 2026
              </button>

              {/* ⋯ more — copy link and other secondary actions live here */}
              <div className="ml-auto relative">
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

            {/* Connected goal — sub-line under title */}
            <div className="mb-2 ml-7">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Target className="h-3 w-3" /> Q3 Growth Goals
              </button>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-5 ml-7">
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                acquisition
              </span>
              <Input
                placeholder="+ tag"
                className="h-6 w-16 text-[11px] border-none shadow-none bg-transparent placeholder:text-muted-foreground/40 px-1"
              />
            </div>

            {/* Tabs — no Messages tab; activity lives in the right rail */}
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-6 border-b border-border/50 rounded-none bg-transparent w-full justify-start gap-2 p-0 h-auto">
                {[
                  { v: "overview",    label: "Overview",    icon: LayoutDashboard },
                  { v: "tasks",       label: "Tasks",       icon: CheckSquare,   count: tasks.length },
                  { v: "whiteboards", label: "Whiteboards", icon: PenLine },
                  { v: "files",       label: "Files",       icon: FileText },
                  { v: "ai",          label: "AI",          icon: Sparkles },
                ].map(({ v, label, icon: Icon, count }) => (
                  <TabsTrigger
                    key={v}
                    value={v}
                    className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:ring-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 px-3"
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                    {count != null && <span className="text-[10px] text-muted-foreground">({count})</span>}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview — structured content only; activity is in the right rail */}
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-7">
                  <section>
                    <CollapsibleNotes
                      content="<p>Tracks a single real estate deal from initial due diligence through closing. Centralises tasks, documents, and milestones for the acquisition team.</p>"
                      onChange={() => {}}
                    />
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2.5">Project roles</h3>
                    <div className="space-y-1.5">
                      {TEAM.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2.5 text-sm">
                          <Avatar initials={p.initials} />
                          <span className="font-medium">{p.name}</span>
                          {i === 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Crown className="h-3 w-3" /> Owner
                            </span>
                          )}
                        </div>
                      ))}
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground pt-1">
                        <Plus className="h-3 w-3" /> Add member
                      </button>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2.5">Connected goals</h3>
                    <button className="w-full flex items-center gap-2 rounded-lg border border-border/60 px-4 py-3 text-sm hover:bg-accent/30 transition-colors text-left">
                      <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                      Q3 Growth Goals
                    </button>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2.5">Key resources</h3>
                    <div className="rounded-lg border border-border/60 p-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-foreground">
                        <FileSignature className="h-3.5 w-3.5" /> Create project brief
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-foreground">
                        <Paperclip className="h-3.5 w-3.5" /> Add links &amp; files
                      </button>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5">
                      Milestones <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/70 border-t border-border/40 pt-2.5">
                      <Flag className="h-3.5 w-3.5" /> Add a milestone
                    </div>
                  </section>
                </div>
              </TabsContent>

              {/* Tasks — same DataTableShell used by standalone Task Page */}
              <TabsContent value="tasks" className="mt-0">
                <div className="mb-3">
                  <QuickAddPopover
                    triggerLabel="Add task"
                    placeholder="Task name…"
                    onAdd={(title) =>
                      setTasks((prev) => [
                        ...prev,
                        { id: crypto.randomUUID(), title, status: "todo", priority: "medium", section: sections[0] || "To Do", tag: "Operations" },
                      ])
                    }
                  />
                </div>
                <div className="space-y-5">
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
              </TabsContent>

              <TabsContent value="whiteboards" className="mt-0">
                <p className="text-sm text-muted-foreground">Whiteboards linked to this project.</p>
              </TabsContent>

              <TabsContent value="files" className="mt-0">
                <p className="text-sm text-muted-foreground">Files and attachments.</p>
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold">Project AI Partner</p>
                  <p className="text-xs text-muted-foreground max-w-xs">Grounded in this project's tasks, notes, files, and comments. Conversation persists across users.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ── Right: persistent activity rail ────────────────────────────
            Always visible regardless of which tab is active.
            Comments and system events unified in one chronological thread.
            No separate Messages tab needed. ──────────────────────────── */}
        <aside
          className="border-l border-border/40 bg-card/20 flex flex-col overflow-hidden"
          style={{ width: 400, minWidth: 400 }}
        >
          {/* Feed */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {ACTIVITY.map((item, i) => (
              item.type === "event" ? (
                /* System event — compact, de-emphasised */
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Avatar initials={item.initials} size="sm" />
                  <div>
                    <span className="font-medium text-foreground/80">{item.who}</span>
                    {" "}{item.text}
                    <span className="block text-muted-foreground/60 mt-0.5">{item.when}</span>
                  </div>
                </div>
              ) : (
                /* Comment — fuller treatment */
                <div key={i} className="flex items-start gap-2.5">
                  <Avatar initials={item.initials} />
                  <div className="flex-1 min-w-0 rounded-xl bg-muted/50 px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{item.who}</span>
                      <span className="text-[10px] text-muted-foreground">{item.when}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{item.text}</p>
                    <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mt-1.5 transition-colors">
                      <Reply className="h-3 w-3" /> Reply
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Composer — pinned at bottom */}
          <div className="border-t border-border/40 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment or @mention…"
                className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button className="text-muted-foreground hover:text-foreground p-1">
                  <AttachIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    comment.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground/40 cursor-default",
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export const FullPage: Story = {
  render: () => <ProjectDetailDemo />,
};
