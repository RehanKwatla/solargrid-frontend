import type { AlertItem } from "@/data/mockData";
import { cn } from "@/lib/utils";

const severityLabel: Record<string, string> = {
  critical: "Critical",
  watch: "Warning",
  healthy: "Info",
};

/** Clean operational event stream — no card wrappers. */
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
    <div>
      {visible.map((event) => {
        const acknowledged =
          event.status === "Acknowledged" || acknowledgedIds.includes(event.id);
        const severity = severityLabel[event.state] ?? event.state;

        return (
          <article
            key={event.id}
            className={cn(
              "event-stream-item",
              event.state === "critical" && "event-critical",
              event.state === "watch" && "event-watch"
            )}
          >
            <time className="event-time">{event.time}</time>
            <span className="event-asset">{event.assetId ?? "—"}</span>
            <div>
              <p className="event-title">{event.title}</p>
              {!limit && (
                <p className="mt-1 text-sm leading-relaxed text-[#6d7874]">
                  {event.detail}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-wider",
                  event.state === "critical" && "text-[#c47060]",
                  event.state === "watch" && "text-[#b89860]",
                  event.state === "healthy" && "text-[#6d7874]"
                )}
              >
                {severity}
              </span>
              {onAcknowledge && (
                <button
                  disabled={acknowledged}
                  onClick={() => onAcknowledge(event.id)}
                  className="text-[10px] text-[#6d7874] transition enabled:hover:text-[#c8e64a] disabled:text-[#4a5450]"
                >
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
