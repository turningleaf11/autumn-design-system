import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EntityCard } from "./EntityCard";
import { EntityViewTabs, type ViewType } from "./EntityViewTabs";
import { Clock } from "lucide-react";

const meta: Meta = {
  title: "Patterns/Kanban Board",
  parameters: {
    docs: {
      description: {
        component:
          "Column container styling pulled from evergreenops's DealsKanban (bg-muted/30, border-border/30, rounded-xl) — same convention used by every kanban in the app (Deals, Projects, Tasks) so they all feel like one system. EntityCard inside is the only thing that changes per entity kind.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface StageDef {
  id: string;
  name: string;
  color: string;
}

const STAGES: StageDef[] = [
  { id: "lead", name: "Lead", color: "215 80% 55%" },
  { id: "under_contract", name: "Under Contract", color: "32 92% 52%" },
  { id: "closed", name: "Closed", color: "152 65% 42%" },
];

const DEALS = [
  { id: "1", stage: "lead", title: "Coastal Acquisitions", value: "$92,500", days: 2 },
  { id: "2", stage: "lead", title: "Harborview Partners", value: "$48,200", days: 6 },
  { id: "3", stage: "under_contract", title: "Sunbelt Holdings LLC", value: "$184,000", days: 11 },
  { id: "4", stage: "closed", title: "Ridgeline Capital", value: "$310,000", days: 1 },
];

export const Board: Story = {
  render: () => {
    const Inner = () => {
      const [view, setView] = useState<ViewType>("board");
      return (
        <div className="ambient-backdrop" style={{ padding: 32, borderRadius: 16, width: 920 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <EntityViewTabs views={["board", "list", "table"]} active={view} onChange={setView} onFilter={() => {}} onSort={() => {}} />

            <div className="flex gap-3 overflow-x-auto pb-2">
              {STAGES.map((stage) => {
                const items = DEALS.filter((d) => d.stage === stage.id);
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col rounded-xl bg-muted/30 border border-border/30 min-h-[200px] flex-1 min-w-[260px] max-w-[300px] shrink-0"
                  >
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
                          dateLabel={`${d.days}d in stage`}
                          dateIcon={Clock}
                          onClick={() => {}}
                        />
                      ))}
                      {items.length === 0 && (
                        <div className="text-[11px] text-muted-foreground/60 text-center py-4">Drop here</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};
