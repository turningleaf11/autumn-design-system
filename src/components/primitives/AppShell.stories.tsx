import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LayoutDashboard, Inbox, Users, CheckSquare, FolderKanban, Target, BookOpen, Settings as SettingsIcon, Plus, Building2,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { Button } from "../ui/button";

const meta: Meta = {
  title: "Patterns/App Shell",
  parameters: {
    docs: {
      description: {
        component:
          "The navigation frame every OpsHQ page lives inside — sidebar with workspace switcher + primary nav + user menu, and a topbar with page title, search trigger, and per-page actions. This story swaps a lightweight placeholder per nav item rather than the full Deal/Task/Project/Goal page demos, since the shell's job is chrome, not page content.",
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

const PAGE_META: Record<string, { title: string; newLabel?: string }> = {
  dashboard: { title: "Dashboard" },
  inbox: { title: "Inbox" },
  crm: { title: "CRM", newLabel: "New contact" },
  tasks: { title: "Tasks", newLabel: "New task" },
  projects: { title: "Projects", newLabel: "New project" },
  goals: { title: "Goals", newLabel: "New goal" },
  docs: { title: "Docs", newLabel: "New doc" },
  settings: { title: "Settings" },
};

function AppShellDemo() {
  const [active, setActive] = useState("tasks");
  const meta = PAGE_META[active];

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden" style={{ width: 1100, height: 640 }}>
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName="Evergreen Ventures"
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle={meta.title}
        onSearch={() => {}}
        topbarActions={meta.newLabel ? <Button size="sm"><Plus className="h-4 w-4 mr-1" />{meta.newLabel}</Button> : undefined}
      >
        <div className="p-8 flex items-center justify-center h-full text-sm text-muted-foreground">
          <div className="text-center space-y-1">
            <p className="font-medium text-foreground">{meta.title} page content renders here</p>
            <p>(see the dedicated Patterns/{meta.title} Page story for the real composition)</p>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export const FullShell: Story = {
  render: () => <AppShellDemo />,
};
