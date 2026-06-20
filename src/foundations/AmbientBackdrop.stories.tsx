import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Sparkles, ArrowRight, Plus } from "lucide-react";

const meta: Meta = {
  title: "Foundations/Ambient Backdrop",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Soft personality wash behind floating cards — different per theme. The cards stay flat; the backdrop carries the 'alive' feel. Switch the Theme toolbar to see light vs dark vs Midnight Slate vs Warm Sand react differently. Reserve this for hero/dashboard canvases, not every screen.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const DashboardComposition: Story = {
  render: () => (
    <div className="ambient-backdrop" style={{ minHeight: 480, width: "100%", padding: "3rem 2.5rem", borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ marginBottom: 4 }}>Good morning, Autumn</h2>
          <p className="text-sm text-muted-foreground">Here's what's moving across Evergreen today.</p>
        </div>
        <Button>
          <Plus /> New Goal
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline Health</CardTitle>
            <CardDescription>Reduce stale leads &gt;15 days by 20%</CardDescription>
          </CardHeader>
          <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <StatusBadge label="On Track" variant="success" dot />
            <span className="text-xs text-muted-foreground">Q2 2026</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smart List Redesign</CardTitle>
            <CardDescription>Cara · Raushanah · Due Jul 15</CardDescription>
          </CardHeader>
          <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <StatusBadge label="In Progress" variant="info" dot />
            <Button variant="ghost" size="sm">
              Open <ArrowRight />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ask Albus</CardTitle>
            <CardDescription>Summarize this week's activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              className="w-full bg-gradient-to-b from-foreground to-foreground/90 text-background hover:to-foreground/95"
            >
              <Sparkles /> Ask AI to start
            </Button>
          </CardContent>
        </Card>
      </div>

      <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>
        Note the "Ask Albus" button uses foreground/background instead of the brand primary — AI actions get their own
        visual language so they're recognizable anywhere in the app, distinct from regular brand-colored CTAs.
      </p>
    </div>
  ),
};

export const BackdropOnly: Story = {
  render: () => (
    <div className="ambient-backdrop" style={{ minHeight: 320, width: "100%", borderRadius: 16 }} />
  ),
};
