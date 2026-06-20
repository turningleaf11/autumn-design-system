import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Spacing",
};
export default meta;
type Story = StoryObj;

const SCALE = [
  { label: "xs", px: 4 },
  { label: "sm", px: 8 },
  { label: "md", px: 12 },
  { label: "lg", px: 16 },
  { label: "xl", px: 20 },
  { label: "2xl", px: 24 },
  { label: "3xl", px: 32 },
];

const RADII = [
  { label: "sm", px: 6 },
  { label: "md", px: 8 },
  { label: "lg", px: 12 },
  { label: "xl", px: 16 },
  { label: "full", px: 999 },
];

export const SpacingScale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {SCALE.map((s) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 50, fontSize: 12, fontFamily: "monospace" }}>{s.label}</div>
          <div style={{ width: s.px, height: 20, background: "hsl(var(--primary))", borderRadius: 4 }} />
          <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{s.px}px</div>
        </div>
      ))}
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      {RADII.map((r) => (
        <div key={r.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 64, height: 64, borderRadius: r.px, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <div style={{ fontSize: 12, fontFamily: "monospace" }}>{r.label} · {r.px}px</div>
        </div>
      ))}
    </div>
  ),
};
