import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta: Meta = {
  title: "Components/Pagination",
  parameters: {
    docs: {
      description: {
        component:
          "Every list/table built so far silently assumed \"small enough to show all rows.\" Plain page-number pagination with ellipsis collapsing for many pages. Also usable directly via DataTable's pageSize prop.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} totalItems={114} pageSize={10} />;
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <PaginationDemo />
    </div>
  ),
};
