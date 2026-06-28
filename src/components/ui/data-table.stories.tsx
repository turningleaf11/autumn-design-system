import type { Meta, StoryObj } from "@storybook/react";
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
