import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { LogOut, Settings, User, CreditCard } from "lucide-react";

const meta: Meta = {
  title: "Components/DropdownMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Glass surface per foundations/elevation.md — frosted, floats above the ambient backdrop rather than a flat opaque popover.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const AvatarMenu: Story = {
  render: () => (
    <div className="ambient-backdrop" style={{ padding: 64, borderRadius: 16, display: "flex", justifyContent: "center" }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <button style={{ borderRadius: "9999px" }}>
            <Avatar>
              <AvatarImage src="" alt="Autumn Alexander" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ width: 260 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 10px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Autumn Alexander</span>
              <Badge variant="pro">Pro</Badge>
            </div>
            <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>autumn@evergreen.com</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
