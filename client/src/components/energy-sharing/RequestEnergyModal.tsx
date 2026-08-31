import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
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
  ArrowDownRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function RequestEnergyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { energyPeers, recordEnergyTransaction } = useDashboardData();

  const [requestedKwh, setRequestedKwh] = useState<number>(25);
  const [priorityTier, setPriorityTier] = useState<string>("Tier 01 · Critical Load Protection");
  const [selectedSourcePeerId, setSelectedSourcePeerId] = useState<string>(energyPeers[3]?.id ?? "peer-04");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPeer = energyPeers.find((p) => p.id === selectedSourcePeerId) ?? energyPeers[0];
  const activeRate = selectedPeer?.current_rate_inr ?? 6.60;
  const estimatedCost = requestedKwh * activeRate;

  const handleConfirm = async () => {
    if (requestedKwh <= 0) {
      setErrorMsg("Please specify an energy quantity greater than 0 kWh.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await recordEnergyTransaction({
        facility_id: "SG-ACC-01",
        type: "Bought",
        amount_kwh: Number(requestedKwh.toFixed(1)),
        rate_inr: Number(activeRate.toFixed(2)),
        total_amount_inr: Number(estimatedCost.toFixed(2)),
        status: "Completed",
        peer_entity: selectedPeer?.name ?? "Microgrid Feeder Bus",
        notes: `Energy import request for ${priorityTier}`,
      });

      toast.success("Energy Request Dispatched", {
        description: `Requested ${requestedKwh.toFixed(1)} kWh from ${selectedPeer?.name} for ${priorityTier}.`,
      });

      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to record energy request in backend.";
      setErrorMsg(msg);
      toast.error("Request Failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-surface border border-border p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground font-bold">
              <ArrowDownRight size={18} />
            </div>
            <div>
              <DialogTitle className="font-sans text-lg font-bold text-foreground">
                Request Microgrid Energy
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-text-tertiary">
                Peer Power Transfer & Emergency Reserve Top-Up
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Priority Requirement Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Operational Priority / Reason
            </label>
            <select
              value={priorityTier}
              onChange={(e) => setPriorityTier(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="Tier 01 · Critical Load Protection (ICU / Emergency)">
                Tier 01 · Critical Load Protection (ICU / Emergency)
              </option>
              <option value="Tier 02 · Vaccine Cold Storage Protection">
                Tier 02 · Vaccine Cold Storage Protection
              </option>
              <option value="Standard Night Reserve Buffer Top-Up">
                Standard Night Reserve Buffer Top-Up
              </option>
              <option value="Grid Peak Shaving / Tariff Arbitrage">
                Grid Peak Shaving / Tariff Arbitrage
              </option>
            </select>
          </div>

          {/* Source Peer / Feeder Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Source Microgrid Feeder / Supplier
            </label>
            <select
              value={selectedSourcePeerId}
              onChange={(e) => setSelectedSourcePeerId(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              {energyPeers.map((peer) => (
                <option key={peer.id} value={peer.id}>
                  {peer.name} ({peer.available_capacity_kwh} kWh available @ ₹{peer.current_rate_inr.toFixed(2)}/kWh)
                </option>
              ))}
            </select>
          </div>

          {/* Requested kWh input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider">
                Requested Energy Quantity
              </label>
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {requestedKwh.toFixed(1)} kWh
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={200}
                step={1}
                value={requestedKwh}
                onChange={(e) => setRequestedKwh(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-28 rounded-md border border-border bg-surface px-3 py-2 text-sm font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
              <div className="flex-1 flex gap-1.5">
                {[15, 25, 50, 75].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRequestedKwh(preset)}
                    className="flex-1 py-1.5 px-2 rounded border border-border text-[0.72rem] font-mono hover:bg-surface-soft transition-colors"
                  >
                    {preset}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cost Estimate Card */}
          <div className="p-3.5 rounded-lg border border-border bg-surface-soft/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Source Feed Rate:</span>
              <span className="font-mono font-semibold text-foreground">₹{activeRate.toFixed(2)} / kWh</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Import Volume:</span>
              <span className="font-mono font-semibold text-foreground">{requestedKwh.toFixed(1)} kWh</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-center">
              <span className="font-sans font-bold text-xs text-foreground uppercase">Estimated Energy Cost:</span>
              <span className="font-sans text-lg font-bold text-foreground tabular-nums">
                ₹{estimatedCost.toFixed(2)}
              </span>
            </div>
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
            onClick={handleConfirm}
            disabled={isSubmitting || requestedKwh <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 py-2 text-xs font-semibold text-foreground hover:bg-surface-soft disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Recording to Supabase…</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Confirm Energy Request</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
