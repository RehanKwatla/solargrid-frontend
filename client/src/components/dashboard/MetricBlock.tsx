import type { HealthState } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function MetricBlock({
  label,
  value,
  unit,
  change,
  note,
  state,
}: {
  label: string;
  value: string;
  unit: string;
  change: string;
  note: string;
  state: HealthState;
}) {
  const accent =
    state === "healthy"
      ? "text-[#d8ff3e]"
      : state === "watch"
        ? "text-[#f1bf70]"
        : state === "critical"
          ? "text-[#ff6b6b]"
          : "text-[#aeb8b4]";

  return (
    <article className="metric-block operational-panel relative p-5 sm:p-6">
      <p className="section-label">{label}</p>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-[-0.06em] text-white">{value}</span>
        {unit && <span className="font-mono text-[11px] text-[#9aa5a0]">{unit}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.1em]", accent)}>{change}</span>
        <span className="text-xs text-[#919c98]">{note}</span>
      </div>
    </article>
  );
}
