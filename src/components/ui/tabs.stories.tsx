import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta = {
  title: "Components/Tabs",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: 420 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>Overview panel content.</p>
      </TabsContent>
      <TabsContent value="activity">
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>Activity panel content.</p>
      </TabsContent>
      <TabsContent value="files">
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>Files panel content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>Settings panel content.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabsScroll: Story = {
  parameters: {
    docs: {
      description: {
        story: "Narrow container forces horizontal scroll — scrollbar is hidden via the scrollbar-hide utility.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="t1" style={{ width: 280 }}>
      <TabsList>
        {Array.from({ length: 8 }, (_, i) => (
          <TabsTrigger key={i} value={`t${i + 1}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  ),
};
