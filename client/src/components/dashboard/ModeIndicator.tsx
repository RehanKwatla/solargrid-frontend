import type { OperatingMode } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

type ModeIndicatorProps = {
  mode: OperatingMode;
  detail: string;
};

const modePillClass: Record<OperatingMode, string> = {
  "Self-Powered": "pill-healthy",
  "Grid Backup": "pill-warning",
  "Emergency Watch": "pill-danger",
  "Cost Saving": "pill-accent",
};

export function ModeIndicator({ mode, detail }: ModeIndicatorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <span className={cn("pill", modePillClass[mode])}>
          <Activity size={10} strokeWidth={2.5} />
          {mode}
        </span>
      </div>
      <h2 className="heading-sm text-foreground">{mode} Mode</h2>
      <p className="text-[0.81rem] leading-[1.55] text-text-secondary">{detail}</p>
    </div>
  );
}
