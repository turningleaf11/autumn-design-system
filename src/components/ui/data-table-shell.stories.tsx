import type { Meta, StoryObj } from "@storybook/react";
import {
  DataTableShell,
  DataTableHeader,
  DataTableRow,
  DataTablePill,
  DataTableFilterBar,
  DataTableEmpty,
} from "./data-table-shell";
import { Input } from "./input";
import { Button } from "./button";
import { Inbox, Search } from "lucide-react";

const meta: Meta = {
  title: "Components/DataTable",
  parameters: {
    docs: {
      description: {
        component:
          "Grid-based 'list table' (not a semantic <table>) — pulled from evergreenops's CRM Companies/Contacts/Transactions tables, the actively-used pattern. The generic shadcn <table> primitives have zero usages in the app and were skipped. Cohesion fixes applied: shadow-card-lift instead of a flat black shadow, theme-aware hover instead of a hardcoded #F9F9F9 hex (which silently broke on Midnight Slate/Warm Sand).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const TEMPLATE = "2.2fr 1fr 1fr 1fr 100px";

const ROWS = [
  { company: "Sunbelt Holdings LLC", stage: "Under Contract", channel: "Realtor", value: "$184,000", color: "152 60% 38%" },
  { company: "Coastal Acquisitions", stage: "Lead", channel: "Broker", value: "$92,500", color: "220 65% 48%" },
  { company: "Ridgeline Capital", stage: "Closed", channel: "Realtor", value: "$310,000", color: "152 60% 38%" },
  { company: "Harborview Partners", stage: "At Risk", channel: "Broker", value: "$48,200", color: "0 72% 51%" },
];

export const TransactionsList: Story = {
  render: () => (
    <div className="ambient-backdrop" style={{ padding: 32, borderRadius: 16, width: 760 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DataTableFilterBar
          right={<Button size="sm">New transaction</Button>}
        >
          <div style={{ position: "relative" }}>
            <Search className="h-4 w-4" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))" }} />
            <Input placeholder="Search transactions..." style={{ paddingLeft: 32, height: 36, width: 220 }} />
          </div>
        </DataTableFilterBar>

        <DataTableShell>
          <DataTableHeader template={TEMPLATE}>
            <span>Company</span>
            <span>Stage</span>
            <span>Channel</span>
            <span>Value</span>
            <span></span>
          </DataTableHeader>
          {ROWS.map((row) => (
            <DataTableRow key={row.company} template={TEMPLATE} asButton onClick={() => {}}>
              <span style={{ fontWeight: 600 }}>{row.company}</span>
              <DataTablePill hsl={row.color}>{row.stage}</DataTablePill>
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{row.channel}</span>
              <span>{row.value}</span>
              <span></span>
            </DataTableRow>
          ))}
        </DataTableShell>
      </div>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <DataTableEmpty
        icon={<Inbox className="h-8 w-8" />}
        title="No transactions yet"
        hint="New deals will show up here once they're created."
      />
    </div>
  ),
};
