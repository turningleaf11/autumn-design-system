import type { Meta, StoryObj } from "@storybook/react";
import { Trash2, Archive } from "lucide-react";
import { DataTable, type DataTableColumn } from "./data-table";

const meta: Meta = {
  title: "Components/DataTable",
  parameters: {
    docs: {
      description: {
        component:
          "Column-driven table with a \"Columns\" manager (drag to reorder, checkbox to show/hide) — per feedback (\"I want to organize the columns the way I want\"). Distinct from DataTableShell/DataTableHeader/DataTableRow in data-table-shell.tsx, which stay for hand-rolled tables that don't need reordering.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface Row {
  name: string;
  email: string;
  role: string;
  joined: string;
}

const DATA: Row[] = [
  { name: "Autumn Alexander", email: "autumn@evergreen.com", role: "Owner", joined: "Jan 2024" },
  { name: "Jordan Reyes", email: "jordan@evergreen.com", role: "Admin", joined: "Mar 2024" },
  { name: "Priya Shah", email: "priya@evergreen.com", role: "Member", joined: "Jun 2025" },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { key: "name", label: "Name", width: "2fr", hideable: false, render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: "email", label: "Email", width: "2fr", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
  { key: "role", label: "Role", width: "1fr", render: (r) => r.role },
  { key: "joined", label: "Joined", width: "1fr", render: (r) => <span className="text-muted-foreground">{r.joined}</span> },
];

export const Default: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <DataTable columns={COLUMNS} data={DATA} rowKey={(r) => r.email} onRowClick={() => {}} />
    </div>
  ),
};

export const WithBulkSelection: Story = {
  parameters: {
    docs: { description: { story: "selectable + bulkActions — check a row (or header checkbox for all) to reveal the floating action bar." } },
  },
  render: () => (
    <div style={{ width: 640 }}>
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey={(r) => r.email}
        onRowClick={() => {}}
        selectable
        bulkActions={[
          { label: "Archive", icon: Archive, onClick: (rows) => alert(`Archive: ${rows.map((r) => r.name).join(", ")}`) },
          { label: "Delete", icon: Trash2, variant: "destructive", onClick: (rows) => alert(`Delete: ${rows.map((r) => r.name).join(", ")}`) },
        ]}
      />
    </div>
  ),
};

const MANY_ROWS: Row[] = Array.from({ length: 34 }, (_, i) => ({
  name: `Member ${i + 1}`,
  email: `member${i + 1}@evergreen.com`,
  role: i === 0 ? "Owner" : i % 5 === 0 ? "Admin" : "Member",
  joined: "2025",
}));

export const WithPagination: Story = {
  parameters: {
    docs: { description: { story: "pageSize — 34 rows at 10/page. Pagination is client-side; pass pageSize to opt in." } },
  },
  render: () => (
    <div style={{ width: 640 }}>
      <DataTable columns={COLUMNS} data={MANY_ROWS} rowKey={(r) => r.email} pageSize={10} />
    </div>
  ),
};
