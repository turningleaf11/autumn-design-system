import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";

const meta: Meta = {
  title: "Components/Card",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Smart List Redesign</CardTitle>
        <CardDescription>Rebuild list logic to cut stale leads &gt;15 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
          Card body content goes here — description, metadata, whatever the surface needs.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open project</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "For click-target cards (list items, project cards). Hover lifts and deepens the tinted shadow — static containers should leave `interactive` off.",
      },
    },
  },
  render: () => (
    <Card interactive style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Smart List Redesign</CardTitle>
        <CardDescription>Rebuild list logic to cut stale leads &gt;15 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
          Hover me — this card is a click target.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open project</Button>
      </CardFooter>
    </Card>
  ),
};
