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
      ? "text-healthy"
      : state === "watch"
        ? "text-warning"
        : state === "critical"
          ? "text-danger"
          : "text-text-secondary";

  const iconBg =
    state === "healthy"
      ? "bg-healthy/10 text-healthy"
      : state === "watch"
        ? "bg-warning/10 text-warning"
        : state === "critical"
          ? "bg-danger/10 text-danger"
          : "bg-surface-soft text-text-secondary";

  return (
    <article className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        {Icon && (
          <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconBg)}>
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
        {unit && (
          <span className="text-sm font-medium text-text-secondary">{unit}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border">
        <span className={cn("text-xs font-semibold", accent)}>
          {change}
        </span>
        <span className="text-xs text-text-secondary">{note}</span>
      </div>
    </article>
  );
}
