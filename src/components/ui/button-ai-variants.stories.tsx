import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles } from "lucide-react";
import { Button } from "./button";

const meta: Meta = {
  title: "Components/Button/AI Variant Exploration",
  parameters: {
    docs: {
      description: {
        component:
          "Feedback: the current `ai` button variant (gradient from primary toward --ai) feels too close to the regular primary CTA — same shape, same lift-on-hover, just a hue shift. These are comparison options, not a committed change — nothing here touches the real Button component yet.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const SideBySide: Story = {
  render: () => (
    <div className="space-y-8" style={{ width: 480 }}>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Baseline — primary CTA (for comparison)</p>
        <Button>New Goal</Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Current "ai" variant — the complaint</p>
        <Button variant="ai">
          <Sparkles /> Ask AI to start
        </Button>
        <p className="text-[11px] text-muted-foreground/70">Same shape/shadow/lift as primary, just a violet-shifted gradient. Easy to mistake for "just another CTA" at a glance.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Option A — Shimmer sweep</p>
        <button
          className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-primary to-ai px-5 py-2 text-sm font-medium text-ai-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <span
            className="absolute inset-0 animate-shimmer"
            style={{
              backgroundImage: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.45) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
          <Sparkles className="relative h-4 w-4" /> <span className="relative">Ask AI to start</span>
        </button>
        <p className="text-[11px] text-muted-foreground/70">Same gradient identity, but a continuous light sweep reads as "alive"/processing without touching color.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Option B — Distinct color, no shared hue with primary</p>
        <Button className="bg-gradient-to-b from-ai to-[hsl(258_70%_42%)] text-ai-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:to-[hsl(258_70%_38%)] active:translate-y-0 active:scale-[0.98]">
          <Sparkles /> Ask AI to start
        </Button>
        <p className="text-[11px] text-muted-foreground/70">Drops primary from the gradient entirely — fully violet, top to bottom. Unmistakable at a glance, no animation needed.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Option C — Pulsing glow ring + icon accent</p>
        <Button variant="ai" className="animate-ai-glow">
          <Sparkles className="animate-pulse" /> Ask AI to start
        </Button>
        <p className="text-[11px] text-muted-foreground/70">Keeps the current gradient, adds a soft breathing glow ring + pulsing sparkle — telegraphs "AI" through motion rather than color alone.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Option D — A + C combined</p>
        <button
          className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-ai to-[hsl(258_70%_42%)] px-5 py-2 text-sm font-medium text-ai-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] animate-ai-glow"
        >
          <span
            className="absolute inset-0 animate-shimmer"
            style={{
              backgroundImage: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.4) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
          <Sparkles className="relative h-4 w-4" /> <span className="relative">Ask AI to start</span>
        </button>
        <p className="text-[11px] text-muted-foreground/70">Distinct color + shimmer + glow ring. Most differentiated, but check it doesn't feel "too busy" for a button that appears often.</p>
      </div>
    </div>
  ),
};
