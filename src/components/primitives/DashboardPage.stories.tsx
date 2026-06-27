import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LayoutDashboard, Inbox, Users, CheckSquare, FolderKanban, Target, BookOpen,
  Settings as SettingsIcon, Building2, Clock, TrendingUp, AlertTriangle,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { Card } from "../ui/card";
import { DataTableShell } from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { ProgressBar } from "./ProgressBar";

const meta: Meta = {
  title: "Patterns/Dashboard Page",
  parameters: {
    docs: {
      description: {
        component:
          "First page built inside AppShell rather than as a standalone bordered box — proves the shell actually hosts real content. Aggregates across entities rather than listing one kind: stat cards, tasks due today, deals closing this week, goal progress. Every widget reuses an existing primitive (EntityCard row, StatusPill, ProgressBar) — nothing here is bespoke dashboard-only UI.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "crm", label: "CRM", icon: Users },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "goals", label: "Goals", icon: Target },
  { key: "docs", label: "Docs", icon: BookOpen },
  { key: "settings", label: "Settings", icon: SettingsIcon, section: "footer" },
];

const STATS = [
  { label: "Open deals", value: "12", sub: "$1.4M pipeline", icon: TrendingUp, tone: "215 80% 55%" },
  { label: "Tasks due today", value: "4", sub: "1 overdue", icon: Clock, tone: "32 92% 52%" },
  { label: "Active projects", value: "6", sub: "1 at risk", icon: FolderKanban, tone: "262 65% 60%" },
  { label: "Open issues", value: "3", sub: "1 urgent", icon: AlertTriangle, tone: "0 72% 52%" },
];

const TASKS_DUE_TODAY = [
  { title: "Draft Q3 investor update", description: "Pull numbers from finance, write narrative.", status: "todo", priority: "high" },
  { title: "Review Stripe webhook fix", description: "Confirm large-invoice timeout is resolved.", status: "in_progress", priority: "urgent" },
  { title: "Sign off on SOC 2 doc pass", description: "Final review before audit submission.", status: "todo", priority: "medium" },
];

const DEALS_CLOSING = [
  { title: "Coastal Acquisitions", description: "$92,500 · Lead", status: "open" },
  { title: "Sunbelt Holdings LLC", description: "$184,000 · Under Contract", status: "open" },
];

const GOALS = [
  { title: "Hit $2M ARR", progress: 68, hsl: "215 80% 55%" },
  { title: "Launch self-serve onboarding", progress: 30, hsl: "32 92% 52%" },
  { title: "SOC 2 Type II certified", progress: 45, hsl: "0 72% 52%" },
];

function DashboardDemo() {
  const [active, setActive] = useState("dashboard");

  return (
    <div style={{ width: 1100, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName="Evergreen Ventures"
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle="Dashboard"
        onSearch={() => {}}
      >
        <div className="p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `hsl(${s.tone} / 0.12)`, color: `hsl(${s.tone})` }}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.sub}</div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 items-start">
            {/* Tasks due today */}
            <div className="col-span-2 space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Tasks due today</h2>
              <DataTableShell>
                {TASKS_DUE_TODAY.map((t) => (
                  <EntityCard
                    key={t.title}
                    layout="row"
                    kind="task"
                    status={t.status}
                    title={t.title}
                    description={t.description}
                    priority={t.priority}
                    onClick={() => {}}
                  />
                ))}
              </DataTableShell>

              <h2 className="text-sm font-semibold text-foreground pt-2">Deals closing this week</h2>
              <DataTableShell>
                {DEALS_CLOSING.map((d) => (
                  <EntityCard key={d.title} layout="row" kind="deal" status={d.status} title={d.title} description={d.description} onClick={() => {}} />
                ))}
              </DataTableShell>
            </div>

            {/* Goal progress */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Goal progress</h2>
              <Card className="p-4 space-y-4">
                {GOALS.map((g) => (
                  <div key={g.title} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium truncate pr-2">{g.title}</span>
                      <span className="text-muted-foreground shrink-0">{g.progress}%</span>
                    </div>
                    <ProgressBar value={g.progress} hsl={g.hsl} />
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export const FullPage: Story = {
  render: () => <DashboardDemo />,
};
