import type { OperatingMode } from "@/data/mockData";
import { cn } from "@/lib/utils";

type ModeIndicatorProps = {
  mode: OperatingMode;
  detail: string;
};

const modeColors: Record<OperatingMode, string> = {
  "Self-Powered": "text-[#c8e64a]",
  "Cost Saving": "text-[#7eb8d4]",
  "Emergency Watch": "text-[#c47060]",
  "Grid Backup": "text-[#b89860]",
};

export function ModeIndicator({ mode, detail }: ModeIndicatorProps) {
  return (
    <div className="mode-state">
      <span className={cn("mode-state-label", modeColors[mode])}>{mode}</span>
      <h2 className="mode-state-title">{mode}</h2>
      <p className="mode-state-detail">{detail}</p>
    </div>
  );
}
