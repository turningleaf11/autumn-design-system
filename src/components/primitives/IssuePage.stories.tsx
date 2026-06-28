import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bug, Plus, Search, Clock, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { StatusPill } from "./StatusPill";
import { PriorityPill } from "./PriorityPill";
import { DetailSheet } from "./DetailSheet";
import { Badge } from "../ui/badge";
import { RichTextEditor } from "../ui/rich-text-editor";
import { ActivityFeed, type ActivityItem } from "./ActivityFeed";

const meta: Meta = {
  title: "Patterns/Issue Page",
  parameters: {
    docs: {
      description: {
        component:
          "Fifth full-page composition — testing the DetailSheet/EntityCard pattern at its fifth entity (statusTone.ts already registered \"issue\" but no page had used it). Same shell as Task/Project/Goal/Deal; the unique tab this time is Related (cross-linked issues/tasks), distinct from Subtasks, the linked-task table, and Check-ins.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const STAGES = [
  { id: "open", name: "Open", color: "32 92% 52%" },
  { id: "in_review", name: "In Review", color: "215 80% 55%" },
  { id: "resolved", name: "Resolved", color: "152 65% 42%" },
  { id: "closed", name: "Closed", color: "220 12% 55%" },
];

interface RelatedItem {
  title: string;
  kind: "issue" | "task";
  status: string;
}

interface IssueRecord {
  id: string;
  stage: string;
  title: string;
  description: string;
  priority: string;
  days: number;
  related: RelatedItem[];
  activity: ActivityItem[];
}

const INITIAL_ISSUES: IssueRecord[] = [
  {
    id: "1", stage: "open", title: "Stripe webhook drops on >50 line items", description: "Timeout on large invoices during the billing migration cutover.",
    priority: "urgent", days: 1,
    related: [{ title: "Migrate billing to Stripe", kind: "task", status: "in_progress" }],
    activity: [
      { id: "a1", type: "event", actor: "Autumn Alexander", action: "opened this issue", icon: Bug, time: "1d ago" },
      { id: "a2", type: "comment", actor: "Devon Carter", text: "Repro'd on staging — looks like the timeout is on Stripe's side, not ours. Filing a support ticket with them too.", time: "20h ago" },
      { id: "a3", type: "event", actor: "Devon Carter", action: "changed priority to Urgent", icon: RefreshCw, time: "20h ago" },
    ],
  },
  {
    id: "2", stage: "open", title: "Avatar fallback shows initials, not silhouette", description: "Regression from the DataTable pass — should use the neutral silhouette per AvatarStack.",
    priority: "low", days: 6,
    related: [],
    activity: [{ id: "a1", type: "event", actor: "Autumn Alexander", action: "opened this issue", icon: Bug, time: "6d ago" }],
  },
  {
    id: "3", stage: "in_review", title: "Kanban column count off by one", description: "Stage header count doesn't update until a manual refresh.",
    priority: "medium", days: 2,
    related: [{ title: "Duplicate report from #47", kind: "issue", status: "closed" }],
    activity: [
      { id: "a1", type: "event", actor: "Jordan Reyes", action: "opened this issue", icon: Bug, time: "2d ago" },
      { id: "a2", type: "event", actor: "Autumn Alexander", action: "changed status to In Review", icon: RefreshCw, time: "1d ago" },
    ],
  },
  {
    id: "4", stage: "closed", title: "Select chevron rendered inside chip", description: "Fixed — chevron moved to plain trigger treatment.",
    priority: "low", days: 0,
    related: [],
    activity: [{ id: "a1", type: "event", actor: "Autumn Alexander", action: "closed this issue", icon: Bug, time: "3d ago" }],
  },
];

const RELATED_TEMPLATE = "2.4fr 1fr 110px";

function IssuePageDemo() {
  const [view, setView] = useState<ViewType>("board");
  const [search, setSearch] = useState("");
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [peekId, setPeekId] = useState<string | null>(null);

  const peek = issues.find((i) => i.id === peekId) ?? null;

  function updateIssue(id: string, patch: Partial<IssueRecord>) {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addComment(id: string, text: string) {
    setIssues((prev) =>
      prev.map((i) =>
        i.id !== id
          ? i
          : { ...i, activity: [...i.activity, { id: `c${Date.now()}`, type: "comment", actor: "You", text, time: "Just now" }] },
      ),
    );
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 940, height: 600, display: "flex", flexDirection: "column" }}>
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Bug className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold leading-tight">Issues</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search issues…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-64"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New issue
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
              const items = issues.filter((i) => i.stage === stage.id);
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
                    {items.map((i) => (
                      <EntityCard
                        key={i.id}
                        kind="issue"
                        title={i.title}
                        description={i.description}
                        priority={i.priority}
                        dateLabel={i.days === 0 ? "Today" : `${i.days}d in stage`}
                        dateIcon={Clock}
                        onClick={() => setPeekId(i.id)}
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
            {issues.map((i) => (
              <EntityCard
                key={i.id}
                layout="row"
                kind="issue"
                status={i.stage}
                onStatusChange={(v) => updateIssue(i.id, { stage: v })}
                title={i.title}
                description={i.description}
                priority={i.priority}
                onPriorityChange={(v) => updateIssue(i.id, { priority: v })}
                dateLabel={i.days === 0 ? "Today" : `${i.days}d in stage`}
                dateIcon={Clock}
                onClick={() => setPeekId(i.id)}
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
          typeBadge={<Badge variant="outline">Issue</Badge>}
          statusSlot={<StatusPill kind="issue" value={peek.stage} onChange={(v) => updateIssue(peek.id, { stage: v })} />}
          name={peek.title}
          onNameChange={(v) => updateIssue(peek.id, { title: v })}
          description={peek.description}
          onDescriptionChange={(v) => updateIssue(peek.id, { description: v })}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">Priority</span>
                    <PriorityPill value={peek.priority} onChange={(v) => updateIssue(peek.id, { priority: v })} />
                  </div>
                  <p className="text-muted-foreground">{peek.description}</p>
                </div>
              ),
            },
            {
              // Issue-specific tab — cross-references to other records, not
              // a checklist (Task), a linked-items table of one kind
              // (Project), or a timeline (Goal). Reuses DataTableShell since
              // it's still tabular, but the rows span two different kinds.
              value: "related",
              label: "Related",
              content: peek.related.length === 0 ? (
                <p className="text-sm text-muted-foreground">No related issues or tasks linked yet.</p>
              ) : (
                <DataTableShell>
                  <DataTableHeader template={RELATED_TEMPLATE}>
                    <span>Title</span><span>Kind</span><span>Status</span>
                  </DataTableHeader>
                  {peek.related.map((r) => (
                    <DataTableRow key={r.title} template={RELATED_TEMPLATE}>
                      <span style={{ fontWeight: 600 }}>{r.title}</span>
                      <span className="capitalize text-xs text-muted-foreground">{r.kind}</span>
                      <StatusPill kind={r.kind} value={r.status} size="sm" />
                    </DataTableRow>
                  ))}
                </DataTableShell>
              ),
            },
            {
              value: "notes",
              label: "Notes",
              content: <RichTextEditor borderless showToolbar minHeight="280px" placeholder="Add notes…" />,
            },
            {
              // The Activity tab named in detail-sheets.md but never built —
              // change log + comments interleaved by time, distinct from
              // Goal Page's Check-ins (self-reported snapshots, not a full
              // system-generated history).
              value: "activity",
              label: "Activity",
              content: <ActivityFeed items={peek.activity} onComment={(text) => addComment(peek.id, text)} />,
            },
          ]}
        />
      )}
    </div>
  );
}

export const FullPage: Story = {
  render: () => <IssuePageDemo />,
};
