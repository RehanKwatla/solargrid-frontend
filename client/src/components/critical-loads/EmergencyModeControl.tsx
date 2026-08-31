import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Info,
  Loader2,
  Power,
  ShieldAlert,
} from "lucide-react";

export function EmergencyModeControl() {
  const { emergencyMode, toggleEmergencyMode } = useDashboardData();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [operator, setOperator] = useState("Chief Medical Director / EMS Controller");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive = emergencyMode.is_active;

  const handleToggle = async () => {
    setIsSubmitting(true);
    try {
      await toggleEmergencyMode(
        !isActive,
        operator,
        reason || (!isActive ? "Emergency grid failure load preservation lock" : "Deactivated emergency mode")
      );

      toast.success(
        !isActive ? "Emergency Mode Engaged" : "Emergency Mode Disengaged",
        {
          description: !isActive
            ? "EMS is strictly prioritizing Tier 01 ICU & Life Support loads. Non-critical loads shed."
            : "Standard hospital energy management schedule restored.",
        }
      );

      setConfirmOpen(false);
      setReason("");
    } catch (err) {
      toast.error("Operation Failed", {
        description: err instanceof Error ? err.message : "Failed to toggle emergency mode.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full min-w-0 border rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all",
          isActive
            ? "border-[var(--danger)] bg-[var(--danger-bg)]/25 shadow-lg shadow-[var(--danger)]/10"
            : "border-border bg-surface-soft/40"
        )}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md shrink-0",
              isActive
                ? "bg-[var(--danger)] text-white animate-pulse"
                : "border border-border bg-surface text-text-secondary"
            )}
          >
            {isActive ? <AlertOctagon size={18} /> : <HeartPulse size={18} />}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-sans text-sm font-bold text-foreground">
                {isActive
                  ? "EMERGENCY LOAD PRESERVATION MODE ACTIVE"
                  : "Hospital Emergency Load Shedding Lock"}
              </h4>
              <span className="font-mono text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-surface border border-border text-text-tertiary">
                SIMULATION / OPTIMIZATION MODE
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {isActive
                ? "All non-critical and deferrable loads are actively shed. 100% of solar and battery capacity is locked onto ICU, OT, and cold storage circuits."
                : "When enabled during grid faults or capacity crises, the EMS optimizer instantly sheds non-critical power to guarantee patient life support."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold transition-all shadow-sm",
              isActive
                ? "bg-surface border border-border text-foreground hover:bg-surface-soft"
                : "bg-[var(--danger)] text-white hover:opacity-95"
            )}
          >
            {isActive ? (
              <>
                <Power size={14} />
                <span>Disengage Emergency Mode</span>
              </>
            ) : (
              <>
                <AlertOctagon size={14} />
                <span>ENGAGE EMERGENCY MODE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[460px] bg-surface border border-border p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md",
                  !isActive ? "bg-[var(--danger)] text-white" : "bg-primary text-primary-foreground"
                )}
              >
                <AlertOctagon size={18} />
              </div>
              <div>
                <DialogTitle className="font-sans text-lg font-bold text-foreground">
                  {!isActive ? "Confirm Emergency Mode Activation" : "Disengage Emergency Mode"}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-text-tertiary">
                  Hospital EMS Life-Safety Protocol Confirmation
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-3">
            <div className="p-3.5 rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 text-xs space-y-1.5">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Info size={14} className="text-[var(--warning)] shrink-0" />
                Operational Impact Notice:
              </p>
              <p className="text-text-secondary leading-relaxed">
                {!isActive
                  ? "Activating this mode will instruct the EMS optimizer to curtail all Normal and Non-Critical circuits (Wards, Kitchen, Administrative HVAC) to maximize runtime for critical ICU and Operating Theatre equipment."
                  : "Disengaging this mode will restore standard scheduled power distribution across all hospital departments."}
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
                Operator / Approver ID
              </label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
                Emergency Activation Reason
              </label>
              <input
                type="text"
                placeholder="e.g., Grid blackout simulation / severe storm advisory"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={isSubmitting}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-soft transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleToggle}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-xs font-mono font-bold transition-all",
                !isActive
                  ? "bg-[var(--danger)] text-white hover:opacity-95"
                  : "bg-primary text-primary-foreground hover:opacity-95"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Recording…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>{!isActive ? "Confirm Emergency Activation" : "Confirm Disengagement"}</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
