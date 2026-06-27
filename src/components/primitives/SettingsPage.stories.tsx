import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LayoutDashboard, Inbox, Users, CheckSquare, FolderKanban, Target, BookOpen,
  Settings as SettingsIcon, Building2, Plus, CreditCard,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { DataTableShell, DataTableHeader, DataTableRow } from "../ui/data-table-shell";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "../ui/dialog";
import { Toaster } from "../ui/toaster";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Settings Page",
  parameters: {
    docs: {
      description: {
        component:
          "Forms-heavy — leans on patterns/forms.md rather than the entity-card system. Demonstrates both form conventions from the spec in one page: inline edit with save-on-blur (Workspace name) and explicit multi-field forms with a Save button (Profile). Toasts only fire on error, per forms.md's \"never show Saved toast for every inline edit.\" Members uses Dialog (not Sheet) for the invite flow — a short, one-shot action, not a full record.",
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

const SECTIONS = [
  { key: "profile", label: "Profile" },
  { key: "workspace", label: "Workspace" },
  { key: "members", label: "Members" },
  { key: "billing", label: "Billing" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

const MEMBERS = [
  { name: "Autumn Alexander", email: "autumn@evergreen.com", role: "Owner" },
  { name: "Jordan Reyes", email: "jordan@evergreen.com", role: "Admin" },
  { name: "Priya Shah", email: "priya@evergreen.com", role: "Member" },
];

const MEMBER_TEMPLATE = "2fr 2fr 140px";

function InlineNameField({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onSave(draft)}
      onKeyDown={(e) => e.key === "Enter" && onSave(draft)}
      className="block w-full text-sm bg-transparent outline-none border-b-2 border-transparent hover:border-border/30 focus:border-primary/40 transition-colors py-0.5"
    />
  );
}

function SettingsPageDemo() {
  const [active, setActive] = useState("settings");
  const [section, setSection] = useState<SectionKey>("profile");
  const [workspaceName, setWorkspaceName] = useState("Evergreen Ventures");
  const [profileEmail, setProfileEmail] = useState("autumn@evergreen.com");
  const [theme, setTheme] = useState("default-light");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  function saveWorkspaceName(v: string) {
    if (!v.trim()) return; // forms.md: validate at the boundary, not every keystroke
    setWorkspaceName(v);
    // No "Saved" toast — per forms.md, inline edits stay silent on success.
  }

  function saveProfile() {
    if (!profileEmail.trim()) {
      toast({ variant: "destructive", title: "Email is required", description: "Add an email before saving your profile." });
      return;
    }
    // Silent success, same rule as inline edits.
  }

  return (
    <div style={{ width: 1100, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName={workspaceName}
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle="Settings"
      >
        <div className="flex h-full">
          <div className="w-48 shrink-0 border-r border-border/40 p-3 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={cn(
                  "w-full text-left rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  section === s.key ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent/60",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-md space-y-6">
              {section === "profile" && (
                <>
                  <h2 className="text-base font-semibold">Profile</h2>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-base">A</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline">Change photo</Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">Name</Label>
                    <Input id="profile-name" defaultValue="Autumn Alexander" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input id="profile-email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                  <Button onClick={saveProfile}>Save changes</Button>
                </>
              )}

              {section === "workspace" && (
                <>
                  <h2 className="text-base font-semibold">Workspace</h2>
                  <div className="space-y-1.5">
                    <Label>Workspace name</Label>
                    <InlineNameField value={workspaceName} onSave={saveWorkspaceName} />
                    <p className="text-xs text-muted-foreground/70">Saves automatically — no save button needed.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default-light">Default — Light</SelectItem>
                        <SelectItem value="default-dark">Default — Dark</SelectItem>
                        <SelectItem value="midnight-slate">Midnight Slate</SelectItem>
                        <SelectItem value="warm-sand">Warm Sand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email notifications</Label>
                      <p className="text-xs text-muted-foreground/70">Status changes and mentions.</p>
                    </div>
                    <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
                  </div>
                </>
              )}

              {section === "members" && (
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Members</h2>
                    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Invite member</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite member</DialogTitle>
                          <DialogDescription>They'll get an email with a link to join Evergreen Ventures.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input id="invite-email" type="email" placeholder="name@company.com" autoFocus />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Role</Label>
                            <Select defaultValue="member">
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                          <Button onClick={() => setInviteOpen(false)}>Send invite</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <DataTableShell>
                    <DataTableHeader template={MEMBER_TEMPLATE}>
                      <span>Name</span><span>Email</span><span>Role</span>
                    </DataTableHeader>
                    {MEMBERS.map((m) => (
                      <DataTableRow key={m.email} template={MEMBER_TEMPLATE}>
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                        <span className="text-muted-foreground text-sm">{m.email}</span>
                        <span className="text-sm">{m.role}</span>
                      </DataTableRow>
                    ))}
                  </DataTableShell>
                </div>
              )}

              {section === "billing" && (
                <>
                  <h2 className="text-base font-semibold">Billing</h2>
                  <Card className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Pro plan</p>
                        <p className="text-xs text-muted-foreground">$49/mo · renews Jul 1</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Upgrade</Button>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </AppShell>
      <Toaster />
    </div>
  );
}

export const FullPage: Story = {
  render: () => <SettingsPageDemo />,
};
