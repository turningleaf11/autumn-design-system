import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen", docs: { description: { component: "Live CSS-variable swatches. Switch the Theme toolbar above to see every role re-flow." } } },
};
export default meta;
type Story = StoryObj;

function useCssVar(name: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const update = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [name]);
  return value;
}

function Swatch({ token }: { token: string }) {
  const raw = useCssVar(`--${token}`);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          height: 64,
          borderRadius: 10,
          background: `hsl(var(--${token}))`,
          border: "1px solid hsl(var(--border))",
        }}
      />
      <div style={{ fontSize: 12, fontWeight: 600 }}>{token}</div>
      <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>hsl({raw || "…"})</div>
    </div>
  );
}

const ROLES = ["background", "foreground", "card", "popover", "primary", "secondary", "muted", "accent", "destructive", "border", "input", "ring", "success", "warning", "info"];
const BRAND = ["brand-azure", "brand-mint", "brand-tangerine", "brand-coral", "brand-violet", "brand-purple-muted"];

export const SemanticRoles: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, maxWidth: 900 }}>
      {ROLES.map((t) => <Swatch key={t} token={t} />)}
    </div>
  ),
};

export const BrandPalette: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20, maxWidth: 900 }}>
      {BRAND.map((t) => <Swatch key={t} token={t} />)}
    </div>
  ),
};

export const Rules: Story = {
  render: () => (
    <div style={{ maxWidth: 640, fontSize: 14, lineHeight: 1.7, color: "hsl(var(--foreground))" }}>
      <ul style={{ paddingLeft: 20 }}>
        <li>Never hardcode a hex value or raw Tailwind color (<code>bg-red-100</code>, <code>text-gray-500</code>) in a component.</li>
        <li>Use <code>hsl(var(--token))</code> in CSS, or <code>bg-card</code> / <code>text-foreground</code> in Tailwind.</li>
        <li>Status/priority chips always go through <code>StatusBadge</code> — see Components/StatusBadge.</li>
        <li>Adding a new semantic color? Define it in all four themes at once (Default light, Default dark, Midnight Slate, Warm Sand).</li>
      </ul>
    </div>
  ),
};
