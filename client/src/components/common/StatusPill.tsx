import type { ReactNode } from "react";
import type { HealthState } from "@/data/mockData";
import { cn } from "@/lib/utils";

const styles: Record<HealthState, string> = {
  healthy: "border-[#d8ff3e]/30 bg-[#d8ff3e]/10 text-[#d8ff3e]",
  watch: "border-[#f1bf70]/30 bg-[#f1bf70]/10 text-[#f1bf70]",
  critical: "border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ff6b6b]",
  neutral: "border-white/15 bg-white/[.04] text-[#aeb8b4]",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]",
        styles[state],
        className
      )}
    >
      {state === "healthy" && <i className="live-dot" />}
      {children}
    </span>
  );
}
