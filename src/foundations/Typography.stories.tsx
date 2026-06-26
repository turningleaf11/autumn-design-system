import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    docs: {
      description: {
        component:
          "Body text is rendered at 15px app-wide (a deliberate density choice, set on <html>). Typeface is Inter (UI) + JetBrains Mono (monospace) — matches what evergreenops actually loads via Google Fonts. The 'Geist-inspired' language in the old foundations doc was aspirational and didn't match the shipped app; it's been corrected to Inter.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const SCALE = [
  { label: "Display", cls: "text-4xl font-bold tracking-tight", px: "36px / 700" },
  { label: "H1", cls: "text-[1.75rem] font-bold tracking-tight", px: "28px / 700" },
  { label: "H2", cls: "text-[1.375rem] font-semibold tracking-tight", px: "22px / 600" },
  { label: "H3", cls: "text-lg font-semibold", px: "18px / 600" },
  { label: "Body large", cls: "text-base", px: "16px / 400" },
  { label: "Body (default)", cls: "text-[15px]", px: "15px / 400" },
  { label: "Body small", cls: "text-sm", px: "14px / 400" },
  { label: "Label", cls: "text-xs font-medium", px: "12px / 500" },
  { label: "Caption", cls: "text-[11px] font-medium", px: "11px / 500" },
  { label: "Micro", cls: "text-[10px] font-bold", px: "10px / 700" },
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 640 }}>
      {SCALE.map((s) => (
        <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 16, borderBottom: "1px solid hsl(var(--border))", paddingBottom: 10 }}>
          <div style={{ width: 110, fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>{s.px}</div>
          <div className={s.cls}>{s.label} — The quick brown fox</div>
        </div>
      ))}
    </div>
  ),
};

export const EyebrowPattern: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(var(--muted-foreground) / 0.6)" }}>
        Active Deals · Pipeline
      </span>
      <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>
        10px / 700 weight / 0.1em tracking / muted-foreground at 50–60% opacity / uppercase.
      </p>
    </div>
  ),
};
