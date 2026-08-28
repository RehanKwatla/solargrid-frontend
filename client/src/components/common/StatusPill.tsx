import type { ReactNode } from "react";
import type { HealthState } from "@/data/mockData";
import { cn } from "@/lib/utils";

const styles: Record<HealthState, string> = {
  healthy: "pill-healthy",
  watch: "pill-warning",
  critical: "pill-danger",
  neutral: "pill-muted",
};

export function StatusPill({
  state,
  children,
  className,
}: {
  state: HealthState;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pill",
        styles[state],
        className
      )}
    >
      <span
        className={cn(
          "status-dot",
          state === "healthy" && "healthy pulse",
          state === "watch" && "warning",
          state === "critical" && "critical"
        )}
      />
      {children}
    </span>
  );
}

