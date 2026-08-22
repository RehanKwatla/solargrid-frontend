import type { AlertItem } from "@/data/mockData";
import { cn } from "@/lib/utils";

const severityLabel: Record<string, string> = {
  critical: "Critical",
  watch: "Warning",
  healthy: "Info",
};

export function EventStream({
  items,
  limit,
  acknowledgedIds = [],
  onAcknowledge,
}: {
  items: AlertItem[];
  limit?: number;
  acknowledgedIds?: number[];
  onAcknowledge?: (id: number) => void;
}) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-3">
      {visible.map((event) => {
        const acknowledged =
          event.status === "Acknowledged" || acknowledgedIds.includes(event.id);
        const severity = severityLabel[event.state] ?? event.state;

        return (
          <article
            key={event.id}
            className={cn(
              "flex flex-col sm:flex-row gap-4 rounded-xl border p-4 transition-all hover:bg-surface-soft",
              event.state === "critical" ? "border-danger/30 bg-danger/5" : 
              event.state === "watch" ? "border-warning/30 bg-warning/5" : 
              "border-border bg-surface"
            )}
          >
            <div className="flex sm:flex-col justify-between sm:justify-start min-w-[100px] gap-1.5">
              <time className="text-xs font-semibold text-text-secondary">
                {event.time}
              </time>
              <span className="inline-flex items-center rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-semibold text-text-secondary border border-border w-fit">
                {event.assetId ?? "SYSTEM"}
              </span>
            </div>
            
            <div className="flex-1">
              <p className={cn("text-base font-semibold leading-tight", event.state === "critical" ? "text-danger" : event.state === "watch" ? "text-warning" : "text-foreground")}>
                {event.title}
              </p>
              {!limit && (
                <p className="mt-1.5 text-sm text-text-secondary">
                  {event.detail}
                </p>
              )}
            </div>
            
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 mt-4 sm:mt-0">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  event.state === "critical" ? "bg-danger/10 text-danger" :
                  event.state === "watch" ? "bg-warning/10 text-warning" :
                  "bg-healthy/10 text-healthy"
                )}
              >
                {severity}
              </span>
              
              {onAcknowledge && (
                <button
                  disabled={acknowledged}
                  onClick={() => onAcknowledge(event.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors active:scale-95",
                    acknowledged 
                      ? "bg-surface-soft text-text-secondary cursor-not-allowed" 
                      : "bg-surface border border-border text-foreground hover:bg-surface-soft shadow-sm"
                  )}
                >
                  {acknowledged ? "Ack'd" : "Acknowledge"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
