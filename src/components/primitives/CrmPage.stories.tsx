import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Users, Building2, Rocket, Plus, Search, Inbox, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  DataTableShell,
  DataTableHeader,
  DataTableRow,
  DataTablePill,
  DataTableEmpty,
} from "../ui/data-table-shell";
import { EntityCard } from "./EntityCard";
import { StatusPill } from "./StatusPill";
import { DetailSheet } from "./DetailSheet";
import { Badge } from "../ui/badge";
import { RichTextEditor } from "../ui/rich-text-editor";

const meta: Meta = {
  title: "Patterns/CRM Page",
  parameters: {
    docs: {
      description: {
        component:
          "Full page-level composition pulled from evergreenops's CrmPage.tsx: icon-chip header + search + contextual 'New X' button, a Tabs strip (Contacts/Inbox/Deals/Transactions/Companies), and per-tab content using the primitives already built (DataTableShell, EntityCard kanban/row, StatusPill). Presentational only — sample data, no Supabase/peek-sheet wiring.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

type Tab = "leads" | "contacts" | "companies" | "deals" | "transactions";

const TAB_META: Record<Tab, { label: string; icon: typeof Users; newLabel: string }> = {
  contacts: { label: "Contacts", icon: Users, newLabel: "New contact" },
  leads: { label: "Inbox", icon: Inbox, newLabel: "New lead" },
  deals: { label: "Deals", icon: Rocket, newLabel: "New deal" },
  transactions: { label: "Transactions", icon: FileText, newLabel: "New transaction" },
  companies: { label: "Companies", icon: Building2, newLabel: "New company" },
};

const CONTACTS_TEMPLATE = "2fr 1.6fr 1.2fr 100px";
const CONTACTS = [
  { name: "Marcus Webb", email: "marcus@coastalacq.com", status: "active" },
  { name: "Priya Shah", email: "priya@ridgeline.cap", status: "lead" },
  { name: "Devon Carter", email: "devon@harborview.co", status: "customer" },
];

const COMPANIES_TEMPLATE = "2.2fr 1.4fr 1fr 100px";
const COMPANIES = [
  { name: "Sunbelt Holdings LLC", industry: "Real Estate", deals: 3 },
  { name: "Coastal Acquisitions", industry: "Investment", deals: 1 },
  { name: "Ridgeline Capital", industry: "Private Equity", deals: 2 },
];

const DEAL_STAGES = [
  { id: "lead", name: "Lead", color: "215 80% 55%" },
  { id: "under_contract", name: "Under Contract", color: "32 92% 52%" },
  { id: "closed", name: "Closed", color: "152 65% 42%" },
];
const DEALS = [
  { id: "1", stage: "lead", title: "Coastal Acquisitions", value: "$92,500" },
  { id: "2", stage: "lead", title: "Harborview Partners", value: "$48,200" },
  { id: "3", stage: "under_contract", title: "Sunbelt Holdings LLC", value: "$184,000" },
  { id: "4", stage: "closed", title: "Ridgeline Capital", value: "$310,000" },
];

const TX_TEMPLATE = "2fr 1.3fr 1fr 1fr";
const TRANSACTIONS = [
  { company: "Sunbelt Holdings LLC", stage: "Under Contract", stageColor: "32 92% 52%", status: "open", value: "$184,000" },
  { company: "Ridgeline Capital", stage: "Closed", stageColor: "152 65% 42%", status: "won", value: "$310,000" },
];

const KIND_ACCENT = {
  contact: "215 80% 55%",
  lead: "265 70% 60%",
  deal: "32 92% 52%",
  company: "152 65% 42%",
  transaction: "32 92% 52%",
} as const;

interface PeekRecord {
  kind: keyof typeof KIND_ACCENT;
  name: string;
  description?: string;
  status?: string;
}

const LEADS = [
  { title: "New inbound — 184 Sunbelt Ave", description: "Submitted via website form, 12 min ago.", status: "new" },
  { title: "Referral — Jordan Reyes", description: "Via Coastal Acquisitions contact.", status: "working" },
];

function CrmPageDemo() {
  const [tab, setTab] = useState<Tab>("deals");
  const [search, setSearch] = useState("");
  const [peek, setPeek] = useState<PeekRecord | null>(null);
  const [contacts, setContacts] = useState(CONTACTS);

  function updateContactStatus(name: string, status: string) {
    setContacts((prev) => prev.map((c) => (c.name === name ? { ...c, status } : c)));
  }
  const meta = TAB_META[tab];

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background" style={{ width: 880, height: 560, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Rocket className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold leading-tight">Deals</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-64"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> {meta.newLabel}
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="px-6 pt-3 border-b border-border/40">
          <TabsList className="h-9 bg-transparent p-0 gap-1 border-0">
            {(Object.keys(TAB_META) as Tab[]).map((t) => {
              const Icon = TAB_META[t].icon;
              return (
                <TabsTrigger key={t} value={t} className="data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:ring-0 gap-1.5">
                  <Icon className="h-3.5 w-3.5" /> {TAB_META[t].label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="contacts" className="flex-1 overflow-auto m-0 p-4">
          <DataTableShell>
            <DataTableHeader template={CONTACTS_TEMPLATE}>
              <span>Name</span><span>Email</span><span>Status</span><span></span>
            </DataTableHeader>
            {contacts.map((c) => (
              <DataTableRow
                key={c.name}
                template={CONTACTS_TEMPLATE}
                onClick={() => setPeek({ kind: "contact", name: c.name, description: c.email, status: c.status })}
              >
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>{c.email}</span>
                {/* Row opens the peek via the div-row's own onClick (not asButton)
                    so this can hold a real <button> dropdown trigger without
                    nesting button-in-button. stopPropagation keeps the dropdown
                    click from also firing the row's peek-open. */}
                <span onClick={(e) => e.stopPropagation()}>
                  <StatusPill kind="contact" value={c.status} size="sm" onChange={(v) => updateContactStatus(c.name, v)} />
                </span>
                <span></span>
              </DataTableRow>
            ))}
          </DataTableShell>
        </TabsContent>

        <TabsContent value="leads" className="flex-1 overflow-auto m-0 p-4">
          <DataTableShell>
            {LEADS.map((l) => (
              <EntityCard
                key={l.title}
                layout="row"
                kind="lead"
                status={l.status}
                title={l.title}
                description={l.description}
                onClick={() => setPeek({ kind: "lead", name: l.title, description: l.description, status: l.status })}
              />
            ))}
          </DataTableShell>
        </TabsContent>

        <TabsContent value="companies" className="flex-1 overflow-auto m-0 p-4">
          <DataTableShell>
            <DataTableHeader template={COMPANIES_TEMPLATE}>
              <span>Company</span><span>Industry</span><span>Deals</span><span></span>
            </DataTableHeader>
            {COMPANIES.map((c) => (
              <DataTableRow
                key={c.name}
                template={COMPANIES_TEMPLATE}
                asButton
                onClick={() => setPeek({ kind: "company", name: c.name, description: `${c.industry} · ${c.deals} deals` })}
              >
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>{c.industry}</span>
                <span>{c.deals}</span>
                <span></span>
              </DataTableRow>
            ))}
          </DataTableShell>
        </TabsContent>

        <TabsContent value="deals" className="flex-1 overflow-auto m-0 p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {DEAL_STAGES.map((stage) => {
              const items = DEALS.filter((d) => d.stage === stage.id);
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
                    {items.map((d) => (
                      <EntityCard
                        key={d.id}
                        kind="deal"
                        title={d.title}
                        description={d.value}
                        onClick={() => setPeek({ kind: "deal", name: d.title, description: d.value, status: stage.id })}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="flex-1 overflow-auto m-0 p-4">
          {TRANSACTIONS.length === 0 ? (
            <DataTableEmpty title="No transactions yet" hint="New deals will show up here once they're created." />
          ) : (
            <DataTableShell>
              <DataTableHeader template={TX_TEMPLATE}>
                <span>Company</span><span>Stage</span><span>Status</span><span>Value</span>
              </DataTableHeader>
              {TRANSACTIONS.map((row) => (
                <DataTableRow
                  key={row.company}
                  template={TX_TEMPLATE}
                  asButton
                  onClick={() => setPeek({ kind: "transaction", name: row.company, description: row.value, status: row.status })}
                >
                  <span style={{ fontWeight: 600 }}>{row.company}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: `hsl(${row.stageColor})`, flexShrink: 0 }} />
                    {row.stage}
                  </span>
                  <DataTablePill hsl={row.status === "won" ? "152 65% 42%" : "215 80% 55%"} className="capitalize">{row.status}</DataTablePill>
                  <span>{row.value}</span>
                </DataTableRow>
              ))}
            </DataTableShell>
          )}
        </TabsContent>
      </Tabs>

      {peek && (
        <DetailSheet
          open={!!peek}
          onOpenChange={(o) => !o && setPeek(null)}
          accentColor={KIND_ACCENT[peek.kind]}
          typeBadge={<Badge variant="outline" className="capitalize">{peek.kind}</Badge>}
          statusSlot={
            peek.status ? (
              <StatusPill
                kind={peek.kind === "company" ? "deal" : (peek.kind as Exclude<typeof peek.kind, "company">)}
                value={peek.status}
                onChange={(v) => setPeek((p) => p && { ...p, status: v })}
              />
            ) : undefined
          }
          name={peek.name}
          onNameChange={(v) => setPeek((p) => p && { ...p, name: v })}
          description={peek.description}
          onDescriptionChange={(v) => setPeek((p) => p && { ...p, description: v })}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <p className="text-sm text-muted-foreground">
                  Summary, related items, and activity for <strong className="text-foreground">{peek.name}</strong> would render here.
                </p>
              ),
            },
            {
              value: "notes",
              label: "Notes",
              content: <RichTextEditor borderless showToolbar minHeight="280px" placeholder="Add notes…" />,
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
  render: () => <CrmPageDemo />,
};
