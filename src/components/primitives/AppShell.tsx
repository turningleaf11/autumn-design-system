// AppShell — the primary navigation frame every OpsHQ page lives inside.
// Sidebar (workspace switcher + primary nav + user menu) + Topbar (page
// title/breadcrumb + global actions) + content slot.
//
// Usage:
//   <AppShell
//     items={NAV_ITEMS}
//     activeItem="tasks"
//     onNavigate={setActiveItem}
//     pageTitle="Tasks"
//     user={{ name: "Autumn Alexander" }}
//   >
//     {/* page content */}
//   </AppShell>

import * as React from "react";
import { ChevronDown, Search, LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Visually separated into its own group below a divider (e.g. Settings). */
  section?: "main" | "footer";
}

interface AppShellProps {
  items: NavItem[];
  activeItem: string;
  onNavigate: (key: string) => void;

  workspaceName: string;
  workspaceIcon?: React.ComponentType<{ className?: string }>;

  user: { name: string; avatarUrl?: string | null };
  onLogout?: () => void;

  pageTitle: string;
  /** Right-side topbar action cluster (e.g. "New deal" button). */
  topbarActions?: React.ReactNode;
  /** ⌘K command palette trigger handler — omit to hide the search affordance. */
  onSearch?: () => void;

  children: React.ReactNode;
}

export function AppShell({
  items, activeItem, onNavigate,
  workspaceName, workspaceIcon: WorkspaceIcon,
  user, onLogout,
  pageTitle, topbarActions, onSearch,
  children,
}: AppShellProps) {
  const mainItems = items.filter((i) => i.section !== "footer");
  const footerItems = items.filter((i) => i.section === "footer");

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-60 shrink-0 border-r border-border/40 bg-card flex flex-col">
        <div className="h-14 shrink-0 flex items-center px-3 border-b border-border/40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 -ml-2 hover:bg-accent/60 transition-colors min-w-0 flex-1">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {WorkspaceIcon ? <WorkspaceIcon className="h-4 w-4" /> : <span className="text-xs font-bold">{workspaceName.charAt(0)}</span>}
                </div>
                <span className="text-sm font-semibold truncate flex-1 text-left">{workspaceName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuItem>{workspaceName}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
          {mainItems.map((item) => (
            <NavButton key={item.key} item={item} active={activeItem === item.key} onClick={() => onNavigate(item.key)} />
          ))}
        </nav>

        {footerItems.length > 0 && (
          <div className="px-2.5 py-2 border-t border-border/40 space-y-0.5">
            {footerItems.map((item) => (
              <NavButton key={item.key} item={item} active={activeItem === item.key} onClick={() => onNavigate(item.key)} />
            ))}
          </div>
        )}

        <div className="px-2.5 py-2 border-t border-border/40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-accent/60 transition-colors">
                <Avatar className="h-7 w-7">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="text-[10px]">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate flex-1 text-left">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <UserIcon className="h-3.5 w-3.5 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="h-3.5 w-3.5 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="h-3.5 w-3.5 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 shrink-0 border-b border-border/40 px-6 flex items-center justify-between gap-4">
          <h1 className="text-base font-semibold truncate">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            {onSearch && (
              <button
                onClick={onSearch}
                className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/70 transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                Search
                <kbd className="ml-1 rounded border border-border/60 bg-card px-1 font-mono text-[10px]">⌘K</kbd>
              </button>
            )}
            {topbarActions}
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </button>
  );
}
