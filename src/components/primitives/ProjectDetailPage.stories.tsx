import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FolderOpen, Calendar, Target, Crown, Plus, Link2,
  LayoutDashboard, CheckSquare, PenLine, FileText, MessageSquare,
  FileSignature, Paperclip, Flag,
} from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
import { AvatarStack, type AvatarStackPerson } from "./AvatarStack";
import { CollapsibleNotes } from "./CollapsibleNotes";
import { QuickAddPopover } from "./QuickAddPopover";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Project Detail Page",
  parameters: {
    docs: {
      description: {
        component:
          "The single-project full page (what you land on after clicking into a project) — distinct from Project Page's kanban-of-projects-with-peek. Modeled on Asana's project view: the project name is the dominant header element (back-nav is a minor affordance, not a button competing for top billing), tabs cover Overview/Tasks/Whiteboards/Files/Messages, and Overview is a real structured page (description, roles, connected goals, key resources, milestones) with a status+activity right rail — not just a notes box.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const TASK_TEMPLATE = "2.2fr 1fr 1fr 100px";

const TEAM: AvatarStackPerson[] = [
  { user_id: "1", full_name: "Autumn Alexander", avatar_url: null },
  { user_id: "2", full_name: "Jordan Lee", avatar_url: null },
];

const TAG_COLORS: Record<string, string> = {
  Legal: "bg-violet-100 text-violet-800",
  Finance: "bg-emerald-100 text-emerald-800",
  Operations: "bg-orange-100 text-orange-800",
  Brokerage: "bg-cyan-100 text-cyan-800",
};

interface TaskRow { id: string; title: string; status: string; priority: string; section: string; tag: string; }

const TASKS: TaskRow[] = [
  { id: "1", title: "Commission property inspection and environmental report", status: "done", priority: "high", section: "Due diligence", tag: "Operations" },
  { id: "2", title: "Review title search and survey", status: "in_progress", priority: "medium", section: "Due diligence", tag: "Legal" },
  { id: "3", title: "Validate financial model and rent roll", status: "todo", priority: "medium", section: "Due diligence", tag: "Finance" },
  { id: "4", title: "Negotiate purchase and sale agreement", status: "todo", priority: "high", section: "Negotiation & contract", tag: "Legal" },
  { id: "5", title: "Secure financing commitment letter", status: "todo", priority: "medium", section: "Negotiation & contract", tag: "Finance" },
  { id: "6", title: "Coordinate closing statement and wire transfer", status: "todo", priority: "low", section: "Closing", tag: "Brokerage" },
];

const STATUS_OPTIONS = [
  { value: "on_track", label: "On track", color: "152 65% 42%" },
  { value: "at_risk", label: "At risk", color: "32 92% 52%" },
  { value: "off_track", label: "Off track", color: "0 72% 51%" },
  { value: "on_hold", label: "On hold", color: "215 80% 55%" },
];

function ProjectDetailDemo() {
  const [tab, setTab] = useState("overview");
  const [tasks, setTasks] = useState(TASKS);
  const [projectStatus, setProjectStatus] = useState("on_track");
  const [statusOpen, setStatusOpen] = useState(false);

  const sections = Array.from(new Set(tasks.map((t) => t.section)));
  const updateTaskStatus = (id: string, status: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const statusMeta = STATUS_OPTIONS.find((s) => s.value === projectStatus)!;

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 980, height: 640, display: "flex", flexDirection: "column" }}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-4 pb-5 max-w-[920px] mx-auto">
          {/* Header — project name is the dominant element. No back-nav
              line: that lives in sidebar/browser back, not the page body. */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FolderOpen className="h-4 w-4" />
              </div>
              <h1 className="text-2xl font-bold leading-tight truncate">Property acquisition</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AvatarStack people={TEAM} size="sm" max={4} />
              <button title="Copy link" className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
                <Link2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-5 text-sm">
            <StatusPill kind="project" value="in_progress" onChange={() => {}} />
            <span className="text-muted-foreground/30">·</span>
            <PriorityPill value="high" size="sm" onChange={() => {}} />
            <span className="text-muted-foreground/30">·</span>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-md hover:bg-accent/50">
              <Calendar className="h-3 w-3" /> Jul 30, 2026
            </button>
            <span className="text-muted-foreground/30">·</span>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-md hover:bg-accent/50">
              <Target className="h-3 w-3" /> Q3 Growth Goals
            </button>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-6 border-b border-border/50 rounded-none bg-transparent w-full justify-start gap-2 p-0 h-auto">
              {[
                { v: "overview", label: "Overview", icon: LayoutDashboard },
                { v: "tasks", label: "Tasks", icon: CheckSquare },
                { v: "whiteboards", label: "Whiteboards", icon: PenLine },
                { v: "files", label: "Files", icon: FileText },
                { v: "messages", label: "Messages", icon: MessageSquare },
              ].map(({ v, label, icon: Icon }) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:ring-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 px-3"
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                  {v === "tasks" && <span className="text-[10px] text-muted-foreground">({tasks.length})</span>}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview — real structured sections, not a lone notes box */}
            <TabsContent value="overview" className="mt-0">
              <div className="flex gap-8">
                <div className="flex-1 min-w-0 space-y-7">
                  <section>
                    <CollapsibleNotes
                      content="<p>Tracks a single real estate deal from initial due diligence through closing. Centralizes tasks, documents, and milestones for the acquisition team.</p>"
                      onChange={() => {}}
                    />
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold mb-2.5">Project roles</h3>
                    <div className="space-y-1.5">
                      {TEAM.map((p, i) => (
                        <div key={p.user_id} className="flex items-center gap-2.5 text-sm">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-medium">
                            {(p.full_name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium">{p.full_name}</span>
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
                    <button className="w-full rounded-lg border border-dashed border-border/60 py-5 flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                      <Target className="h-4 w-4" />
                      Connect this project to a larger goal
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

                {/* Right rail — status + activity, not a separate Comments tab content duplication */}
                <aside className="w-[260px] shrink-0 space-y-4">
                  <div className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">What's the status?</span>
                      <div className="relative">
                        <button
                          onClick={() => setStatusOpen((o) => !o)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 text-xs font-medium"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `hsl(${statusMeta.color})` }} />
                          {statusMeta.label}
                        </button>
                        {statusOpen && (
                          <div className="absolute right-0 top-full mt-1 z-10 w-36 rounded-lg border border-border bg-card shadow-lg p-1">
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => { setProjectStatus(s.value); setStatusOpen(false); }}
                                className="w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs hover:bg-accent text-left"
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `hsl(${s.color})` }} />
                                {s.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">No due date</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { who: "Jordan Lee", what: "joined the project team", when: "29m ago" },
                      { who: "Autumn Alexander", what: "created this project", when: "29m ago" },
                    ].map((ev, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-medium shrink-0 mt-0.5">
                          {ev.who.split(" ").map((w) => w[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground/90"><span className="font-medium">{ev.who}</span> {ev.what}</p>
                          <p className="text-muted-foreground mt-0.5">{ev.when}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </TabsContent>

            {/* Tasks — same DataTableShell/DataTableRow used by the standalone
                Task Page, grouped by section. One list implementation, two
                places it shows up — not a parallel, divergent table. */}
            <TabsContent value="tasks" className="mt-0">
              <div className="flex items-center justify-between mb-3">
                <QuickAddPopover
                  triggerLabel="Add task"
                  placeholder="Task name…"
                  onAdd={(title) => setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, status: "todo", priority: "medium", section: sections[0] || "To Do", tag: "Operations" }])}
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
              <p className="text-sm text-muted-foreground">Files and attachments. (Pattern not designed yet — see Task Page's Attachments tab placeholder.)</p>
            </TabsContent>

            {/* Messages — a project-level discussion stream, distinct from
                per-task Comments. Lives in the tab bar, not a floating
                top-right toggle/slide-out rail. */}
            <TabsContent value="messages" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No messages yet.</p>
                <Input placeholder="Message the project team or @mention someone…" className="text-sm" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export const FullPage: Story = {
  render: () => <ProjectDetailDemo />,
};
