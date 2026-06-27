// DetailSheet — the peek/side-panel pattern for viewing and editing a single
// record without leaving the current page. See patterns/detail-sheets.md.
//
//   ┌─ Header (shrink-0, border-left accent) ──────────┐
//   │  [type badge]  [owner pill]  [status]            │
//   │  Record Name ← editable inline                   │
//   │  Short description ← editable inline             │
//   ├─ Tab bar (shrink-0, border-b) ────────────────────┤
//   │  Overview | Notes | Map | Docs                   │
//   ├─ Tab content (flex-1, overflow-y-auto) ───────────┤
//   │  [content]                                        │
//   └────────────────────────────────────────────────────┘

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AvatarStackPerson } from "./AvatarStack";

export interface DetailSheetTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** Color driving the header's left-border accent (node_type color, e.g. "215 80% 55%"). */
  accentColor?: string;

  typeBadge?: React.ReactNode;
  statusSlot?: React.ReactNode;

  name: string;
  onNameChange: (value: string) => void;
  description?: string | null;
  onDescriptionChange?: (value: string) => void;

  owner?: AvatarStackPerson | null;
  members?: AvatarStackPerson[];
  onOwnerChange?: (person: AvatarStackPerson | null) => void;

  tabs: DetailSheetTab[];
  defaultTab?: string;
}

function OwnerPicker({
  owner,
  members,
  onOwnerChange,
}: {
  owner?: AvatarStackPerson | null;
  members?: AvatarStackPerson[];
  onOwnerChange?: (person: AvatarStackPerson | null) => void;
}) {
  if (!members) {
    // No member list provided — render owner as a static pill.
    return owner ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 pl-1 pr-2.5 py-1 text-xs font-medium text-foreground">
        <PersonAvatar person={owner} />
        {owner.full_name || "Unnamed"}
      </span>
    ) : null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-muted pl-1 pr-2 py-1 text-xs font-medium text-foreground transition-colors">
          {owner ? <PersonAvatar person={owner} /> : <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px]">?</AvatarFallback></Avatar>}
          {owner?.full_name || "Unassigned"}
          <ChevronDown className="h-3 w-3 text-muted-foreground/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {members.map((m) => (
          <DropdownMenuItem key={m.user_id} onClick={() => onOwnerChange?.(m)} className="justify-between">
            <span className="flex items-center gap-2">
              <PersonAvatar person={m} />
              {m.full_name || "Unnamed"}
            </span>
            {owner?.user_id === m.user_id && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
        {owner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onOwnerChange?.(null)} className="text-destructive">
              Remove owner
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PersonAvatar({ person }: { person: AvatarStackPerson }) {
  return (
    <Avatar className="h-5 w-5">
      {person.avatar_url && <AvatarImage src={person.avatar_url} alt={person.full_name || ""} />}
      <AvatarFallback className="text-[9px]">
        {(person.full_name || "?").charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export function DetailSheet({
  open,
  onOpenChange,
  accentColor,
  typeBadge,
  statusSlot,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  owner,
  members,
  onOwnerChange,
  tabs,
  defaultTab,
}: Props) {
  const [tab, setTab] = React.useState(defaultTab ?? tabs[0]?.value);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {/* Header — shrink-0, never scrolls, left-border accent for record type */}
        <div
          className="shrink-0 border-l-[3px] px-6 pt-6 pb-4 space-y-3"
          style={accentColor ? { borderLeftColor: `hsl(${accentColor})` } : undefined}
        >
          <div className="flex items-center gap-2 flex-wrap pr-8">
            {typeBadge}
            <OwnerPicker owner={owner} members={members} onOwnerChange={onOwnerChange} />
            {statusSlot}
          </div>

          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-xl font-bold text-foreground bg-transparent outline-none
                       border-b-2 border-transparent hover:border-border/30
                       focus:border-primary/40 pb-0.5 transition-colors"
          />
          <input
            value={description ?? ""}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            placeholder="Add a short description..."
            className="w-full text-sm text-muted-foreground bg-transparent outline-none
                       border-b-2 border-transparent hover:border-border/30
                       focus:border-primary/40 pb-0.5 transition-colors"
          />
        </div>

        {/* Tab bar — shrink-0, sheet-specific underline style (not the pill TabsList).
            Driven directly by local state rather than a nested Radix Tabs root —
            this sheet already lives inside a Dialog portal, and a second Tabs
            root here only adds context-plumbing risk for no benefit. */}
        <div className="flex flex-1 flex-col min-h-0">
          <div className="shrink-0 border-b border-border/60 px-6">
            <div role="tablist" className="flex gap-1 -mb-px">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 h-10 text-xs font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground",
                    tab === t.value && "border-primary text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content — the only scrollable region in the sheet */}
          {tabs.map((t) => (
            <div
              key={t.value}
              hidden={tab !== t.value}
              className="flex-1 min-h-0 overflow-y-auto px-6 py-5"
            >
              {t.content}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
