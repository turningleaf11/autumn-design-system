import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Target, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { StatusPill } from "./StatusPill";
import { DetailSheet } from "./DetailSheet";
import { Badge } from "../ui/badge";

const meta: Meta = {
  title: "Patterns/Goal Page",
  parameters: {
    docs: {
      description: {
        component:
          "Fourth full-page composition. Goals don't kanban naturally (there's no useful 'column' to drag between), so this page only offers List — EntityViewTabs is built to take whichever views make sense per entity, not all four every time. The DetailSheet swaps in a progress bar + Check-ins tab in place of Subtasks/Tasks.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface CheckIn {
  date: string;
  note: string;
  progress: number;
}

interface GoalRecord {
  id: string;
  status: string;
  title: string;
  description: string;
  progress: number;
  checkIns: CheckIn[];
}

const INITIAL_GOALS: GoalRecord[] = [
  {
    id: "1", status: "on_track", title: "Hit $2M ARR", description: "Cross $2M in recurring revenue by year end.",
    progress: 68,
    checkIns: [
      { date: "Jun 20", note: "Closed Ridgeline Capital deal, +$24K MRR.", progress: 68 },
      { date: "Jun 1", note: "On pace, pipeline coverage at 3.2x.", progress: 58 },
    ],
  },
  {
    id: "2", status: "behind", title: "Launch self-serve onboarding", description: "Cut sales-assisted onboarding time by 70%.",
    progress: 30,
    checkIns: [{ date: "Jun 18", note: "Blocked on billing migration finishing first.", progress: 30 }],
  },
  {
    id: "3", status: "at_risk", title: "SOC 2 Type II certified", description: "Pass audit before the enterprise deal closes.",
    progress: 45,
    checkIns: [{ date: "Jun 15", note: "Vendor risk review slipping — see linked project.", progress: 45 }],
  },
  {
    id: "4", status: "done", title: "Rebrand shipped", description: "New logo, palette, and marketing site live.",
    progress: 100,
    checkIns: [{ date: "May 30", note: "Shipped. Closing out.", progress: 100 }],
  },
];

function ProgressBar({ value, hsl }: { value: number; hsl: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${value}%`, backgroundColor: `hsl(${hsl})` }}
      />
    </div>
  );
}

function GoalPageDemo() {
  const [view] = useState<ViewType>("list");
  const [search, setSearch] = useState("");
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [peekId, setPeekId] = useState<string | null>(null);

  const peek = goals.find((g) => g.id === peekId) ?? null;

  function updateGoal(id: string, patch: Partial<GoalRecord>) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 880, height: 600, display: "flex", flexDirection: "column" }}>
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Target className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold leading-tight">Goals</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search goals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-64"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New goal
          </Button>
        </div>
      </div>

      {/* Only List — Board/Table/Timeline don't add anything for goals. */}
      <div className="px-6 pt-3">
        <EntityViewTabs views={["list"]} active={view} onChange={() => {}} onSort={() => {}} />
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {goals.map((g) => (
          <div key={g.id} className="space-y-1.5">
            <EntityCard
              layout="row"
              kind="goal"
              status={g.status}
              title={g.title}
              description={g.description}
              onClick={() => setPeekId(g.id)}
            />
          </div>
        ))}
      </div>

      {peek && (
        <DetailSheet
          open={!!peek}
          onOpenChange={(o) => !o && setPeekId(null)}
          typeBadge={<Badge variant="outline">Goal</Badge>}
          statusSlot={<StatusPill kind="goal" value={peek.status} onChange={(v) => updateGoal(peek.id, { status: v })} />}
          name={peek.title}
          onNameChange={(v) => updateGoal(peek.id, { title: v })}
          description={peek.description}
          onDescriptionChange={(v) => updateGoal(peek.id, { description: v })}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{peek.progress}%</span>
                    </div>
                    <ProgressBar value={peek.progress} hsl={peek.status === "done" ? "152 65% 42%" : peek.status === "at_risk" ? "0 72% 52%" : peek.status === "behind" ? "32 92% 52%" : "215 80% 55%"} />
                  </div>
                  <p className="text-sm text-muted-foreground">{peek.description}</p>
                </div>
              ),
            },
            {
              // Goal-specific tab — a timeline of check-ins rather than a
              // checklist (Tasks) or a linked-items table (Projects). Goals
              // don't decompose into children; they accrue status updates.
              value: "checkins",
              label: "Check-ins",
              content: (
                <div className="space-y-4">
                  {peek.checkIns.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {i < peek.checkIns.length - 1 && <div className="w-px flex-1 bg-border/60 mt-1" />}
                      </div>
                      <div className="pb-4 space-y-0.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{c.date}</span>
                          <span>· {c.progress}%</span>
                        </div>
                        <p className="text-sm text-foreground">{c.note}</p>
                      </div>
                    </div>
                  ))}
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
  render: () => <GoalPageDemo />,
};
