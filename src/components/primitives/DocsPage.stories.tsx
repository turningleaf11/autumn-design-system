import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LayoutDashboard, Inbox, Users, CheckSquare, FolderKanban, Target, BookOpen,
  Settings as SettingsIcon, Building2, ChevronRight, FileText, Folder, Plus, Search,
} from "lucide-react";
import { AppShell, type NavItem } from "./AppShell";
import { Input } from "../ui/input";
import { RichTextEditor } from "../ui/rich-text-editor";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Patterns/Docs Page",
  parameters: {
    docs: {
      description: {
        component:
          "Docs/Wiki — flagged as not fitting the entity-card pattern (no status, no kanban, no DetailSheet peek). Its own shape: a doc tree sidebar nested inside AppShell's content area (a second level of navigation, not a replacement for the primary sidebar) + a canvas using RichTextEditor as the body. First surface with two sidebar levels at once.",
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

interface DocNode {
  id: string;
  title: string;
  children?: DocNode[];
}

const TREE: DocNode[] = [
  {
    id: "getting-started", title: "Getting Started",
    children: [
      { id: "welcome", title: "Welcome" },
      { id: "setup-guide", title: "Setup guide" },
    ],
  },
  {
    id: "playbooks", title: "Playbooks",
    children: [
      { id: "sales-playbook", title: "Sales playbook" },
      { id: "onboarding-checklist", title: "Onboarding checklist" },
    ],
  },
  { id: "brand-guidelines", title: "Brand guidelines" },
];

const DOC_CONTENT: Record<string, string> = {
  welcome: "<h1>Welcome to Evergreen Ventures</h1><p>This is the team wiki. Start here if you're new.</p>",
  "setup-guide": "<h1>Setup guide</h1><p>Accounts, tools, and access you'll need in your first week.</p>",
  "sales-playbook": "<h1>Sales playbook</h1><p>How we qualify, pitch, and close deals.</p><ul><li><p>Discovery call structure</p></li><li><p>Objection handling</p></li></ul>",
  "onboarding-checklist": "<h1>Onboarding checklist</h1><p>Run through this with every new hire.</p>",
  "brand-guidelines": "<h1>Brand guidelines</h1><p>Voice, tone, and visual direction across all products.</p>",
};

function findNode(nodes: DocNode[], id: string): DocNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function TreeItem({
  node, depth, activeId, onSelect, expanded, onToggle,
}: {
  node: DocNode; depth: number; activeId: string;
  onSelect: (id: string) => void;
  expanded: Set<string>; onToggle: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isActive = node.id === activeId;

  return (
    <div>
      <button
        onClick={() => (hasChildren ? onToggle(node.id) : onSelect(node.id))}
        className={cn(
          "w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors text-left",
          isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent/60",
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {hasChildren ? (
          <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        {hasChildren && <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        <span className="truncate">{node.title}</span>
      </button>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} activeId={activeId} onSelect={onSelect} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocsPageDemo() {
  const [active, setActive] = useState("docs");
  const [activeDoc, setActiveDoc] = useState("welcome");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["getting-started", "playbooks"]));
  const [content, setContent] = useState(DOC_CONTENT);
  const [search, setSearch] = useState("");

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const doc = findNode(TREE, activeDoc);

  return (
    <div style={{ width: 1100, height: 680 }} className="border border-border/40 rounded-xl overflow-hidden">
      <AppShell
        items={NAV_ITEMS}
        activeItem={active}
        onNavigate={setActive}
        workspaceName="Evergreen Ventures"
        workspaceIcon={Building2}
        user={{ name: "Autumn Alexander" }}
        pageTitle="Docs"
      >
        <div className="flex h-full">
          {/* Doc tree — a second sidebar level, nested inside AppShell's content area */}
          <div className="w-56 shrink-0 border-r border-border/40 flex flex-col">
            <div className="p-2.5 border-b border-border/40 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search docs…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border/50 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/60 transition-colors">
                <Plus className="h-3.5 w-3.5" /> New doc
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {TREE.map((node) => (
                <TreeItem key={node.id} node={node} depth={0} activeId={activeDoc} onSelect={setActiveDoc} expanded={expanded} onToggle={toggle} />
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-10 py-10">
              <p className="text-xs text-muted-foreground mb-3">Docs / {doc?.title}</p>
              <RichTextEditor
                key={activeDoc}
                content={content[activeDoc]}
                onChange={(html) => setContent((prev) => ({ ...prev, [activeDoc]: html }))}
                borderless
                showToolbar
                minHeight="400px"
                placeholder="Start writing…"
              />
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export const FullPage: Story = {
  render: () => <DocsPageDemo />,
};
