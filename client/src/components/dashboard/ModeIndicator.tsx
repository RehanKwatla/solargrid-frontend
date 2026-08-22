import type { OperatingMode } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

type ModeIndicatorProps = {
  mode: OperatingMode;
  detail: string;
};

const modeColors: Record<OperatingMode, string> = {
  "Self-Powered": "text-healthy bg-healthy/10",
  "Cost Saving": "text-accent bg-accent/10",
  "Emergency Watch": "text-danger bg-danger/10",
  "Grid Backup": "text-warning bg-warning/10",
};

export function ModeIndicator({ mode, detail }: ModeIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", modeColors[mode])}>
          <Activity size={12} />
          {mode}
        </span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{mode} Mode</h2>
      <p className="text-sm text-text-secondary leading-relaxed">{detail}</p>
    </div>
  );
}
