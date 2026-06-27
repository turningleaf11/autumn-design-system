import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Inbox, Users, CheckSquare, FolderKanban, Target, BookOpen,
  Settings as SettingsIcon, Building2, Plus,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { CommandPalette, type CommandGroup } from "./CommandPalette";

const meta: Meta = {
  title: "Patterns/Command Palette",
  parameters: {
    docs: {
      description: {
        component:
          "Global search/quick-nav (⌘K). Built once AppShell existed, per the plan — there's no point shipping a command palette before there's more than one page to jump between. Per foundations/elevation.md, command palettes are level-4 floating chrome (one above Dialog/DropdownMenu's level 3), so it gets the glass recipe at a slightly heavier shadow.",
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

function CommandPaletteDemo() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const groups: CommandGroup[] = [
    {
      label: "Pages",
      items: NAV_ITEMS.map((item) => ({
        id: item.key,
        label: item.label,
        icon: item.icon,
        onSelect: () => { setActive(item.key); setLastAction(`Navigated to ${item.label}`); },
      })),
    },
    {
      label: "Actions",
      items: [
        { id: "new-task", label: "New task", icon: Plus, hint: "Tasks", onSelect: () => setLastAction("Opened new-task form") },
        { id: "new-deal", label: "New deal", icon: Plus, hint: "CRM", onSelect: () => setLastAction("Opened new-deal form") },
        { id: "invite", label: "Invite member", icon: Plus, hint: "Settings", onSelect: () => setLastAction("Opened invite-member dialog") },
      ],
    },
  ];

  return (
    <div style={{ width: 1000, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName="Evergreen Ventures"
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle={NAV_ITEMS.find((i) => i.key === active)?.label ?? "Dashboard"}
        onSearch={() => setOpen(true)}
      >
        <div className="p-8 text-sm text-muted-foreground space-y-2">
          <p>Press <kbd className="rounded border border-border/60 bg-card px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd> or click Search in the topbar to open the command palette.</p>
          {lastAction && <p className="text-foreground font-medium">Last action: {lastAction}</p>}
        </div>
      </AppShell>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
    </div>
  );
}

export const FullPage: Story = {
  render: () => <CommandPaletteDemo />,
};
