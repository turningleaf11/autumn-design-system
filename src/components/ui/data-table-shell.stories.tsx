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

const TEMPLATE = "2fr 1.3fr 1fr 1fr 100px";

// Stage = small dot + plain text (matches evergreenops's real DealsTableView
// — stage is informational, not a status you'd scan for, so it stays quiet).
// Status = DataTablePill (matches the real app's Status column — status is
// the thing you scan for, so it gets the colored-bg treatment). Conflating
// the two and giving Stage a pill was the bug: DataTablePill's font-semibold
// reads bigger/bolder than the plain-text convention used everywhere else
// in the row, so it looked inconsistent across rows.
const ROWS = [
  { company: "Sunbelt Holdings LLC", stage: "Under Contract", stageColor: "32 92% 52%", status: "open", value: "$184,000" },
  { company: "Coastal Acquisitions", stage: "Lead", stageColor: "215 80% 55%", status: "open", value: "$92,500" },
  { company: "Ridgeline Capital", stage: "Closed", stageColor: "152 65% 42%", status: "won", value: "$310,000" },
  { company: "Harborview Partners", stage: "At Risk", stageColor: "0 72% 52%", status: "lost", value: "$48,200" },
];

const STATUS_COLOR: Record<string, string> = {
  open: "215 80% 55%",
  won: "152 65% 42%",
  lost: "0 72% 52%",
};

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
            <span>Status</span>
            <span>Value</span>
            <span></span>
          </DataTableHeader>
          {ROWS.map((row) => (
            <DataTableRow key={row.company} template={TEMPLATE} asButton onClick={() => {}}>
              <span style={{ fontWeight: 600 }}>{row.company}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: `hsl(${row.stageColor})`, flexShrink: 0 }} />
                {row.stage}
              </span>
              <DataTablePill hsl={STATUS_COLOR[row.status]} className="capitalize">{row.status}</DataTablePill>
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
