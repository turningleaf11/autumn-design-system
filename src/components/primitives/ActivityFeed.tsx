// ActivityFeed — the Activity tab pattern named in patterns/detail-sheets.md
// ("change log, comments") but never built until now. Two item shapes in
// one timeline: system events (status changes, assignment changes — no
// avatar, just an icon) and comments (avatar + free text), plus a composer
// to add a new comment. Distinct from Goal Page's Check-ins timeline —
// check-ins are self-reported progress snapshots; this is a record's full
// history, system-generated and human, interleaved by time.

import * as React from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActivityEvent {
  id: string;
  type: "event";
  actor: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  time: string;
}

export interface ActivityComment {
  id: string;
  type: "comment";
  actor: string;
  text: string;
  time: string;
}

export type ActivityItem = ActivityEvent | ActivityComment;

interface Props {
  items: ActivityItem[];
  onComment?: (text: string) => void;
  currentUser?: string;
  className?: string;
}

export function ActivityFeed({ items, onComment, currentUser = "You", className }: Props) {
  const [draft, setDraft] = React.useState("");

  function submit() {
    const text = draft.trim();
    if (!text) return;
    onComment?.(text);
    setDraft("");
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              {item.type === "comment" ? (
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">{item.actor.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5" />
                </div>
              )}
              {i < items.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1.5" />}
            </div>
            <div className={cn("pb-4 min-w-0 flex-1", item.type === "comment" && "rounded-xl bg-muted/40 px-3 py-2")}>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-foreground">{item.actor}</span>
                {item.type === "event" && <span className="text-muted-foreground">{item.action}</span>}
                <span className="text-muted-foreground/70">· {item.time}</span>
              </div>
              {item.type === "comment" && <p className="text-sm text-foreground mt-0.5">{item.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {onComment && (
        // Sticky to the bottom of the tab's scroll container (not just the
        // end of the list) — per feedback, the composer should stay
        // anchored while the feed above it scrolls, chat-app style. The
        // negative margins bleed it out to DetailSheet's tab-content edges
        // (px-6 py-5) so it reads as a fixed footer, not just the last item.
        <div className="sticky bottom-0 -mx-6 -mb-5 bg-card/95 backdrop-blur-sm border-t border-border/40 px-6 pt-3 pb-5">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs">{currentUser.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                placeholder="Leave a comment… (⌘+Enter to send)"
                rows={3}
                className="flex-1 resize-none rounded-xl border border-border/50 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors min-h-[88px]"
              />
              <Button size="icon" disabled={!draft.trim()} onClick={submit} aria-label="Send comment" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
