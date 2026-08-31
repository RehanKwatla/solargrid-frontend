import { useState, useEffect } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import type { HospitalLoad, PriorityLevel } from "@/data/types";
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
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export function EditPriorityModal({
  load,
  open,
  onOpenChange,
}: {
  load: HospitalLoad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { updateHospitalLoadPriority } = useDashboardData();

  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>("CRITICAL");
  const [operatorName, setOperatorName] = useState("Dr. A. Sharma (Chief Medical Officer)");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (load) {
      setSelectedPriority(load.priority);
      setReason("");
      setErrorMsg(null);
    }
  }, [load]);

  if (!load) return null;

  const handleSave = async () => {
    if (!reason.trim()) {
      setErrorMsg("Please enter a mandatory clinical/operational justification for this priority change.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await updateHospitalLoadPriority(
        load.id,
        selectedPriority,
        reason.trim(),
        operatorName.trim()
      );

      toast.success("Priority Updated & Logged", {
        description: `Set ${load.equipment_name} to ${selectedPriority}. Recorded in hospital audit log.`,
      });

      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to persist priority change to backend.";
      setErrorMsg(msg);
      toast.error("Update Failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] !bg-[#10150f] border border-border p-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              <Edit3 size={17} />
            </div>
            <div>
              <DialogTitle className="font-sans text-lg font-bold text-foreground">
                Modify Load Priority Classification
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-text-tertiary">
                Authorized EMS Dispatch Overrides
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Target Load Information */}
          <div className="p-3.5 rounded-lg border border-border bg-surface-soft/60 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
                Target Equipment
              </span>
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {load.current_kw.toFixed(1)} kW demand
              </span>
            </div>
            <p className="font-sans text-sm font-bold text-foreground">
              {load.equipment_name}
            </p>
            <p className="font-mono text-[0.68rem] text-text-secondary">
              {load.room} · {load.department} ({load.floor})
            </p>
          </div>

          {/* Priority Level Selector */}
          <div className="space-y-2">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Assign Electrical Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["CRITICAL", "HIGH", "NORMAL", "NON-CRITICAL"] as PriorityLevel[]).map((p) => {
                const isSelected = selectedPriority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`flex items-center gap-2 p-2.5 rounded-md border text-xs font-mono transition-all text-left ${
                      isSelected
                        ? p === "CRITICAL"
                          ? "border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)] font-black ring-1 ring-[var(--danger)]"
                          : "border-primary bg-primary/10 text-foreground font-bold ring-1 ring-primary"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-soft"
                    }`}
                  >
                    {p === "CRITICAL" && <ShieldAlert size={14} className="text-[var(--danger)] shrink-0" />}
                    {p === "HIGH" && <Shield size={14} className="text-[var(--warning)] shrink-0" />}
                    {p === "NORMAL" && <ShieldCheck size={14} className="text-[var(--healthy)] shrink-0" />}
                    {p === "NON-CRITICAL" && <span className="h-2 w-2 rounded-full bg-text-tertiary shrink-0" />}
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operator Name */}
          <div className="space-y-1.5">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Authorized Operator / Role
            </label>
            <div className="relative">
              <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full rounded-md border border-border bg-surface pl-8 pr-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Mandatory Reason */}
          <div className="space-y-1.5">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Clinical / Operational Justification *
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Critical emergency surgery scheduled during peak window"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-ring)] text-[var(--danger)] text-xs">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-soft transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Persisting to Supabase…</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Save Priority & Audit</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
