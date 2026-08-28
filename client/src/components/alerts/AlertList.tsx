import type { AlertItem } from "@/data/mockData";
import { Check, CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/common/StatusPill";
import { cn } from "@/lib/utils";

export function AlertList({
  items,
  compact = false,
  acknowledgedIds = [],
  onAcknowledge,
}: {
  items: AlertItem[];
  compact?: boolean;
  acknowledgedIds?: number[];
  onAcknowledge?: (id: number) => void;
}) {
  return (
    <div className="divide-y divide-border">
      {items.slice(0, compact ? 3 : items.length).map((alert, index) => {
        const acknowledged =
          alert.status === "Acknowledged" || acknowledgedIds.includes(alert.id);

        return (
          <article
            key={alert.id}
            className={cn(
              "grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-start transition-colors",
              !compact && "pl-2"
            )}
            style={!compact ? { animationDelay: `${index * 60}ms` } : undefined}
          >
            <StatusPill state={alert.state} className="w-fit shrink-0">
              {alert.state}
            </StatusPill>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {alert.title}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-secondary">
                  {alert.site}
                </span>
              </div>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
                {alert.detail}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:block shrink-0">
              <time className="font-mono text-xs text-text-secondary">
                {alert.time}
              </time>
              {onAcknowledge && (
                <button
                  disabled={acknowledged}
                  onClick={() => onAcknowledge(alert.id)}
                  className={cn(
                    "mt-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                    acknowledged
                      ? "border-border bg-surface-muted text-text-secondary cursor-not-allowed opacity-75"
                      : "border-border bg-surface text-text-primary hover:border-accent hover:text-accent active:scale-95"
                  )}
                >
                  {acknowledged ? (
                    <CheckCircle2 size={12} className="text-healthy" />
                  ) : (
                    <Check size={12} />
                  )}
                  {acknowledged ? "Acknowledged" : "Acknowledge"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

