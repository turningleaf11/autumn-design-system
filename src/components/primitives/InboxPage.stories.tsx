import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LayoutDashboard, Inbox as InboxIcon, Users, CheckSquare, FolderKanban, Target, BookOpen,
  Settings as SettingsIcon, Building2, AtSign, UserPlus, CheckCircle2, MessageSquare,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Inbox Page",
  parameters: {
    docs: {
      description: {
        component:
          "System notification feed — mentions, assignments, status changes, comments. Distinct from CRM Page's \"Inbox\" tab, which is lead intake, not notifications. Grouped by day, unread state is a left accent + dot (not a separate badge component) so it reads consistently with how DetailSheet already marks record-type accents.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "inbox", label: "Inbox", icon: InboxIcon },
  { key: "crm", label: "CRM", icon: Users },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "goals", label: "Goals", icon: Target },
  { key: "docs", label: "Docs", icon: BookOpen },
  { key: "settings", label: "Settings", icon: SettingsIcon, section: "footer" },
];

type NotifKind = "mention" | "assignment" | "status" | "comment";

interface Notification {
  id: string;
  kind: NotifKind;
  actor: string;
  message: string;
  time: string;
  read: boolean;
  group: "Today" | "Yesterday" | "This week";
}

const KIND_META: Record<NotifKind, { icon: typeof AtSign; tone: string }> = {
  mention: { icon: AtSign, tone: "262 65% 60%" },
  assignment: { icon: UserPlus, tone: "215 80% 55%" },
  status: { icon: CheckCircle2, tone: "152 65% 42%" },
  comment: { icon: MessageSquare, tone: "32 92% 52%" },
};

const INITIAL: Notification[] = [
  { id: "1", kind: "assignment", actor: "Jordan Reyes", message: "assigned you a task: “Draft Q3 investor update”", time: "10m ago", read: false, group: "Today" },
  { id: "2", kind: "mention", actor: "Priya Shah", message: "mentioned you in Coastal Acquisitions: “@Autumn can you confirm the closing date?”", time: "1h ago", read: false, group: "Today" },
  { id: "3", kind: "status", actor: "System", message: "Deal “Ridgeline Capital” moved to Closed", time: "3h ago", read: true, group: "Today" },
  { id: "4", kind: "comment", actor: "Devon Carter", message: "commented on “Migrate billing to Stripe”: “Webhook fix is live in staging.”", time: "Yesterday, 4:12 PM", read: true, group: "Yesterday" },
  { id: "5", kind: "assignment", actor: "Autumn Alexander", message: "added you as owner of “SOC 2 readiness”", time: "2 days ago", read: true, group: "This week" },
];

function InboxDemo() {
  const [active, setActive] = useState("inbox");
  const [notifs, setNotifs] = useState(INITIAL);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const groups: Notification["group"][] = ["Today", "Yesterday", "This week"];

  return (
    <div style={{ width: 1000, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName="Evergreen Ventures"
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle={unreadCount > 0 ? `Inbox (${unreadCount})` : "Inbox"}
        topbarActions={
          unreadCount > 0 ? (
            <Button size="sm" variant="outline" onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}>
              Mark all as read
            </Button>
          ) : undefined
        }
      >
        <div className="max-w-2xl mx-auto p-6">
          {notifs.length === 0 ? (
            <EmptyState icon={<InboxIcon className="h-8 w-8" />} title="Inbox zero" hint="Mentions, assignments, and status changes will show up here." />
          ) : (
            <div className="space-y-6">
              {groups.map((g) => {
                const items = notifs.filter((n) => n.group === g);
                if (items.length === 0) return null;
                return (
                  <div key={g} className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 pb-1">{g}</h2>
                    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                      {items.map((n) => {
                        const { icon: Icon, tone } = KIND_META[n.kind];
                        return (
                          <button
                            key={n.id}
                            onClick={() => setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                            className={cn(
                              "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border/30 last:border-b-0 transition-colors",
                              "hover:bg-accent/40",
                              !n.read && "bg-primary/[0.03]",
                            )}
                          >
                            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                              <AvatarFallback className="text-xs">{n.actor.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <p className="text-sm leading-snug text-foreground">
                                <span className="font-semibold">{n.actor}</span> {n.message}
                              </p>
                              <span className="text-xs text-muted-foreground">{n.time}</span>
                            </div>
                            <div
                              className="h-6 w-6 rounded-md flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `hsl(${tone} / 0.12)`, color: `hsl(${tone})` }}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AppShell>
    </div>
  );
}

export const FullPage: Story = {
  render: () => <InboxDemo />,
};

export const EmptyInbox: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState("inbox");
      return (
        <div style={{ width: 1000, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
          <AppShell
            items={NAV_ITEMS}
            activeItem={active}
            onNavigate={setActive}
            workspaceName="Evergreen Ventures"
            workspaceIcon={Building2}
            user={{ name: "Autumn Alexander" }}
            pageTitle="Inbox"
          >
            <div className="max-w-2xl mx-auto p-6">
              <EmptyState icon={<InboxIcon className="h-8 w-8" />} title="Inbox zero" hint="Mentions, assignments, and status changes will show up here." />
            </div>
          </AppShell>
        </div>
      );
    };
    return <Demo />;
  },
};
