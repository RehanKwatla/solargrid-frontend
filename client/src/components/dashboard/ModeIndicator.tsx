import { useState } from "react";
import type { OperatingMode } from "@/data/mockData";
import type { OperatingModeName } from "@/data/types";
import { cn } from "@/lib/utils";
import { Activity, ChevronDown, Check } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { toast } from "sonner";

type ModeIndicatorProps = {
  mode: OperatingMode;
  detail: string;
};

const ALL_MODES: OperatingModeName[] = [
  "Self-Powered",
  "Cost Saving",
  "Emergency Watch",
  "Grid Backup",
];

const modePillClass: Record<OperatingModeName, string> = {
  "Self-Powered": "pill-healthy",
  "Grid Backup": "pill-warning",
  "Emergency Watch": "pill-danger",
  "Cost Saving": "pill-accent",
};

export function ModeIndicator({ mode, detail }: ModeIndicatorProps) {
  const { updateOperatingMode } = useDashboardData();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectMode = async (newMode: OperatingModeName) => {
    if (newMode === mode) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    setIsOpen(false);
    try {
      await updateOperatingMode(newMode);
      toast.success("Operating Mode Updated", {
        description: `Facility operating mode changed to ${newMode}. Dispatched to BESS controller.`,
      });
    } catch {
      toast.error("Failed to update operating mode");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
          className={cn(
            "pill cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5",
            modePillClass[mode as OperatingModeName] || "pill-healthy"
          )}
          title="Click to change operating mode"
        >
          <Activity size={10} strokeWidth={2.5} className={isUpdating ? "animate-spin" : ""} />
          <span>{mode}</span>
          <ChevronDown size={11} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-8 left-0 z-50 w-56 p-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl space-y-1">
          <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
            Switch Operating Mode
          </p>
          {ALL_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleSelectMode(m)}
              className={cn(
                "w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-colors",
                m === mode
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground hover:bg-surface-soft"
              )}
            >
              <span>{m}</span>
              {m === mode && <Check size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      )}

      <h2 className="heading-sm text-foreground">{mode} Mode</h2>
      <p className="text-[0.81rem] leading-[1.55] text-text-secondary">{detail}</p>
    </div>
  );
}
