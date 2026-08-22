import type { HealthState } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function MetricBlock({
  label,
  value,
  unit,
  change,
  note,
  state,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit: string;
  change: string;
  note: string;
  state: HealthState;
  icon?: LucideIcon;
}) {
  const accent =
    state === "healthy"
      ? "text-[#d8ff3e]"
      : state === "watch"
        ? "text-[#f1bf70]"
        : state === "critical"
          ? "text-[#ff6b6b]"
          : "text-[#aeb8b4]";

  const iconBg =
    state === "healthy"
      ? "bg-[#d8ff3e]/8 border-[#d8ff3e]/20"
      : state === "watch"
        ? "bg-[#f1bf70]/8 border-[#f1bf70]/20"
        : state === "critical"
          ? "bg-[#ff6b6b]/8 border-[#ff6b6b]/20"
          : "bg-white/[.04] border-white/[.1]";

  return (
    <article className="metric-block operational-panel relative overflow-hidden p-4 sm:p-5">
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[.06] to-transparent" />

      <div className="flex items-start justify-between gap-2">
        <p className="section-label">{label}</p>
        {Icon && (
          <span className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border", iconBg)}>
            <Icon size={14} className={accent} />
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="kpi-value">{value}</span>
        {unit && (
          <span className="font-mono text-[11px] text-[#9aa5a0]">{unit}</span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.1em]", accent)}>
          {change}
        </span>
        <span className="text-xs text-[#7d8784]">{note}</span>
      </div>
    </article>
  );
}
