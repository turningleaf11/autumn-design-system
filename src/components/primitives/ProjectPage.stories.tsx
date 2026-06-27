import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FolderKanban, Plus, Search, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { StatusPill } from "./StatusPill";
import { DetailSheet } from "./DetailSheet";
import { Badge } from "../ui/badge";

const meta: Meta = {
  title: "Patterns/Project Page",
  parameters: {
    docs: {
      description: {
        component:
          "Third full-page composition. Same shell as Task/CRM pages — only the DetailSheet tabs differ: a project's unique tab is 'Tasks' (the linked work items underneath it), built from the existing DataTableShell rather than a new table primitive.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const STAGES = [
  { id: "not_started", name: "Not Started", color: "220 12% 55%" },
  { id: "in_progress", name: "In Progress", color: "215 80% 55%" },
  { id: "at_risk", name: "At Risk", color: "32 92% 52%" },
  { id: "completed", name: "Completed", color: "152 65% 42%" },
];

const TASK_TEMPLATE = "2.2fr 1fr 90px";

interface LinkedTask {
  title: string;
  status: string;
  priority: string;
}

interface ProjectRecord {
  id: string;
  stage: string;
  title: string;
  description: string;
  days: number;
  tasks: LinkedTask[];
}

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "1", stage: "in_progress", title: "Stripe billing migration", description: "Cut over all customers from legacy invoicing.",
    days: 12,
    tasks: [
      { title: "Map plans to Stripe products", status: "done", priority: "high" },
      { title: "Test webhook handling", status: "done", priority: "high" },
      { title: "Cut over production", status: "in_progress", priority: "urgent" },
      { title: "Deprecate legacy invoicing UI", status: "todo", priority: "low" },
    ],
  },
  {
    id: "2", stage: "not_started", title: "Office relocation", description: "Move HQ to the new Sunbelt building.",
    days: 0,
    tasks: [{ title: "Sign new lease", status: "todo", priority: "medium" }],
  },
  {
    id: "3", stage: "at_risk", title: "SOC 2 readiness", description: "Audit prep for Type II certification.",
    days: 30,
    tasks: [
      { title: "Document access controls", status: "in_progress", priority: "high" },
      { title: "Vendor risk review", status: "blocked", priority: "urgent" },
    ],
  },
  {
    id: "4", stage: "completed", title: "Brand refresh", description: "New logo, palette, and site.",
    days: 0,
    tasks: [{ title: "Ship new marketing site", status: "done", priority: "medium" }],
  },
];

function ProjectPageDemo() {
  const [view, setView] = useState<ViewType>("board");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [peekId, setPeekId] = useState<string | null>(null);

  const peek = projects.find((p) => p.id === peekId) ?? null;

  function updateProject(id: string, patch: Partial<ProjectRecord>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function updateLinkedTaskStatus(projectId: string, taskTitle: string, status: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId
          ? p
          : { ...p, tasks: p.tasks.map((t) => (t.title === taskTitle ? { ...t, status } : t)) },
      ),
    );
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 940, height: 600, display: "flex", flexDirection: "column" }}>
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FolderKanban className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold leading-tight">Projects</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-64"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New project
          </Button>
        </div>
      </div>

      <div className="px-6 pt-3">
        <EntityViewTabs views={["board", "list"]} active={view} onChange={setView} onFilter={() => {}} onSort={() => {}} />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {view === "board" ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STAGES.map((stage) => {
              const items = projects.filter((p) => p.stage === stage.id);
              return (
                <div key={stage.id} className="flex flex-col rounded-xl bg-muted/30 border border-border/30 min-h-[200px] flex-1 min-w-[220px] max-w-[260px] shrink-0">
                  <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: `hsl(${stage.color})` }} />
                      <span className="text-xs font-medium truncate">{stage.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{items.length}</span>
                  </div>
                  <div className="p-2 space-y-2 flex-1">
                    {items.map((p) => (
                      <EntityCard
                        key={p.id}
                        kind="project"
                        title={p.title}
                        description={p.description}
                        dateLabel={p.days > 0 ? `${p.days}d in stage` : undefined}
                        dateIcon={Clock}
                        metadata={[{ icon: FolderKanban, value: `${p.tasks.filter((t) => t.status === "done").length}/${p.tasks.length}` }]}
                        onClick={() => setPeekId(p.id)}
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
        ) : (
          <DataTableShell>
            {projects.map((p) => (
              <EntityCard
                key={p.id}
                layout="row"
                kind="project"
                status={p.stage}
                title={p.title}
                description={p.description}
                dateLabel={p.days > 0 ? `${p.days}d in stage` : undefined}
                dateIcon={Clock}
                metadata={[{ icon: FolderKanban, value: `${p.tasks.filter((t) => t.status === "done").length}/${p.tasks.length}` }]}
                onClick={() => setPeekId(p.id)}
              />
            ))}
          </DataTableShell>
        )}
      </div>

      {peek && (
        <DetailSheet
          open={!!peek}
          onOpenChange={(o) => !o && setPeekId(null)}
          accentColor={STAGES.find((s) => s.id === peek.stage)?.color}
          typeBadge={<Badge variant="outline">Project</Badge>}
          statusSlot={<StatusPill kind="project" value={peek.stage} onChange={(v) => updateProject(peek.id, { stage: v })} />}
          name={peek.title}
          onNameChange={(v) => updateProject(peek.id, { title: v })}
          description={peek.description}
          onDescriptionChange={(v) => updateProject(peek.id, { description: v })}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: <p className="text-sm text-muted-foreground">{peek.description}</p>,
            },
            {
              // Project-specific tab — the linked work underneath it. Doesn't
              // generalize from Task's "Subtasks" — a project's children are
              // full task records, not checklist items, so it gets a table.
              value: "tasks",
              label: "Tasks",
              content: (
                <DataTableShell>
                  <DataTableHeader template={TASK_TEMPLATE}>
                    <span>Task</span><span>Status</span><span>Priority</span>
                  </DataTableHeader>
                  {peek.tasks.map((t) => (
                    <DataTableRow key={t.title} template={TASK_TEMPLATE}>
                      <span style={{ fontWeight: 600 }}>{t.title}</span>
                      <StatusPill
                        kind="task"
                        value={t.status}
                        size="sm"
                        onChange={(v) => updateLinkedTaskStatus(peek.id, t.title, v)}
                      />
                      <span className="capitalize text-xs text-muted-foreground">{t.priority}</span>
                    </DataTableRow>
                  ))}
                </DataTableShell>
              ),
            },
            {
              value: "docs",
              label: "Docs",
              content: <p className="text-sm text-muted-foreground">Linked documents and attachments.</p>,
            },
          ]}
        />
      )}
    </div>
  );
}

export const FullPage: Story = {
  render: () => <ProjectPageDemo />,
};
