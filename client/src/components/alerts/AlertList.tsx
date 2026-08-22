import type { AlertItem } from "@/data/mockData";
import { Check, CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/common/StatusPill";
import { cn } from "@/lib/utils";

/** Grid Atlas: event actions remain honest prototype interactions with clear severity and acknowledgement state. */
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
    <div className="divide-y divide-white/[0.07]">
      {items.slice(0, compact ? 3 : items.length).map((alert, index) => {
        const acknowledged =
          alert.status === "Acknowledged" || acknowledgedIds.includes(alert.id);
        const severityClass =
          alert.state === "critical"
            ? "alert-critical"
            : alert.state === "watch"
              ? "alert-watch"
              : "alert-info";

        return (
          <article
            key={alert.id}
            className={cn(
              "grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-start",
              severityClass,
              !compact && "pl-3"
            )}
            style={!compact ? { animationDelay: `${index * 60}ms` } : undefined}
          >
            <StatusPill state={alert.state} className="w-fit">
              {alert.state}
            </StatusPill>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-sm font-medium text-[#ecf0ee]">
                  {alert.title}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#77817e]">
                  {alert.site}
                </span>
              </div>
              <p className="mt-1.5 max-w-xl text-sm leading-5 text-[#9ba5a1]">
                {alert.detail}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:block">
              <time className="font-mono text-[10px] text-[#7d8784]">
                {alert.time}
              </time>
              {onAcknowledge && (
                <button
                  disabled={acknowledged}
                  onClick={() => onAcknowledge(alert.id)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#b7c0bc] transition enabled:hover:border-[#d8ff3e]/35 enabled:hover:text-[#d8ff3e] disabled:border-[#d8ff3e]/20 disabled:text-[#d8ff3e]"
                >
                  <>
                    {acknowledged ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <Check size={12} />
                    )}
                    {acknowledged ? "Acknowledged" : "Acknowledge"}
                  </>
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
