import { cn } from "@/lib/utils";
import { Check, CheckCircle2 } from "lucide-react";

/** Flexible alert item type — works with both mock AlertItem and Supabase AlertRecord */
type AlertItemLike = {
  id: number | string;
  title: string;
  detail: string;
  time: string;
  state: "critical" | "watch" | "healthy";
  site: string;
  status: "Open" | "Acknowledged";
  assetId?: string;
  asset_id?: string;
};

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
  items: AlertItemLike[];
  limit?: number;
  acknowledgedIds?: number[];
  onAcknowledge?: (id: number) => void;
}) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className={cn(limit ? "space-y-2" : "space-y-3")}>
      {visible.map((event) => {
        const numericId =
          typeof event.id === "number" ? event.id : parseInt(String(event.id), 10) || 0;
        const acknowledged =
          event.status === "Acknowledged" || acknowledgedIds.includes(numericId);
        const severity = severityLabel[event.state] ?? event.state;
        const assetLabel = event.assetId ?? event.asset_id ?? "SYSTEM";

        return (
          <article
            key={event.id}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-lg border p-3 sm:p-3.5 transition-colors",
              event.state === "critical"
                ? "border-[var(--danger-ring)]/30 bg-[var(--danger-bg)]/50"
                : event.state === "watch"
                  ? "border-[var(--warning-ring)]/30 bg-[var(--warning-bg)]/50"
                  : "border-border bg-surface hover:bg-surface-soft/50"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span
                className={cn(
                  "status-dot shrink-0",
                  event.state === "critical" && "critical",
                  event.state === "watch" && "warning",
                  event.state === "healthy" && "healthy"
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[0.65rem] font-medium text-text-tertiary tabular-nums">
                    {event.time}
                  </span>
                  <span className="pill pill-muted !py-0 !px-1.5 !text-[0.6rem]">
                    {assetLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.81rem] font-semibold text-foreground leading-snug truncate">
                  {event.title}
                </p>
                {!limit && event.detail && (
                  <p className="mt-0.5 text-[0.75rem] text-text-secondary leading-relaxed">
                    {event.detail}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <span
                className={cn(
                  "pill !text-[0.62rem] !py-0.5 !px-2",
                  event.state === "critical" && "pill-danger",
                  event.state === "watch" && "pill-warning",
                  event.state === "healthy" && "pill-healthy"
                )}
              >
                {severity}
              </span>

              {onAcknowledge && (
                <button
                  disabled={acknowledged}
                  onClick={() => onAcknowledge(numericId)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.72rem] font-medium transition-colors",
                    acknowledged
                      ? "bg-surface-muted text-text-tertiary cursor-not-allowed opacity-70"
                      : "border border-border bg-surface text-text-secondary hover:bg-surface-soft hover:text-foreground shadow-[var(--shadow-xs)] active:scale-[0.97]"
                  )}
                >
                  {acknowledged ? (
                    <>
                      <CheckCircle2 size={12} className="text-[var(--healthy)]" />
                      <span>Ack&apos;d</span>
                    </>
                  ) : (
                    <>
                      <Check size={12} />
                      <span>Acknowledge</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
