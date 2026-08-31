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
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Loader2,
  Zap,
} from "lucide-react";

export function SellEnergyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { energySharing, energyPeers, recordEnergyTransaction } = useDashboardData();

  const maxAvailableKwh = energySharing?.available_energy_kwh ?? 142.8;
  const defaultRate = energySharing?.credit_rate_inr_per_kwh ?? 7.10;

  const [amountKwh, setAmountKwh] = useState<number>(Math.min(30, maxAvailableKwh));
  const [selectedPeerId, setSelectedPeerId] = useState<string>(energyPeers[0]?.id ?? "peer-01");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPeer = energyPeers.find((p) => p.id === selectedPeerId) ?? energyPeers[0];
  const activeRate = selectedPeer?.current_rate_inr ?? defaultRate;
  const estimatedEarnings = amountKwh * activeRate;

  const handleConfirm = async () => {
    if (amountKwh <= 0) {
      setErrorMsg("Please specify an energy quantity greater than 0 kWh.");
      return;
    }
    if (amountKwh > maxAvailableKwh) {
      setErrorMsg(`Cannot exceed available surplus of ${maxAvailableKwh.toFixed(1)} kWh.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await recordEnergyTransaction({
        facility_id: "SG-ACC-01",
        type: "Sold",
        amount_kwh: Number(amountKwh.toFixed(1)),
        rate_inr: Number(activeRate.toFixed(2)),
        total_amount_inr: Number(estimatedEarnings.toFixed(2)),
        status: "Completed",
        peer_entity: selectedPeer?.name ?? "Microgrid Peer Feeder",
        notes: `Direct surplus sale via SolarGrid P2P clearing`,
      });

      toast.success("Energy Sale Confirmed", {
        description: `Dispatched ${amountKwh.toFixed(1)} kWh to ${selectedPeer?.name} for ₹${estimatedEarnings.toFixed(2)}.`,
      });

      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to record transaction in backend.";
      setErrorMsg(msg);
      toast.error("Transaction Failed", {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              <ArrowUpRight size={18} />
            </div>
            <div>
              <DialogTitle className="font-sans text-lg font-bold text-foreground">
                Sell Surplus Energy
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-text-tertiary">
                P2P Microgrid Dispatch & Credit Settlement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Available Surplus Notice */}
          <div className="flex items-center justify-between p-3 rounded-md bg-surface-soft/60 border border-border">
            <span className="font-mono text-xs text-text-secondary uppercase">
              Current Available Surplus
            </span>
            <span className="font-sans text-base font-bold text-[var(--healthy)] tabular-nums">
              {maxAvailableKwh.toFixed(1)} kWh
            </span>
          </div>

          {/* Destination Peer Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider block">
              Destination Microgrid Peer / Feeder
            </label>
            <select
              value={selectedPeerId}
              onChange={(e) => setSelectedPeerId(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              {energyPeers.map((peer) => (
                <option key={peer.id} value={peer.id}>
                  {peer.name} — ₹{peer.current_rate_inr.toFixed(2)}/kWh ({peer.demand_status})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity to sell */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[0.68rem] font-semibold text-text-secondary uppercase tracking-wider">
                Quantity to Sell (kWh)
              </label>
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {amountKwh.toFixed(1)} kWh
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={Math.max(1, Math.floor(maxAvailableKwh))}
              step={0.5}
              value={amountKwh}
              onChange={(e) => setAmountKwh(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface-soft rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />

            <div className="flex gap-2">
              {[10, 25, 50, Math.floor(maxAvailableKwh)].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountKwh(Math.min(preset, maxAvailableKwh))}
                  className="flex-1 py-1 px-2 rounded border border-border text-[0.7rem] font-mono hover:bg-surface-soft transition-colors"
                >
                  {preset} kWh
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Earnings Calculation Card */}
          <div className="p-3.5 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-bg)]/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Clearing Rate:</span>
              <span className="font-mono font-semibold text-foreground">₹{activeRate.toFixed(2)} / kWh</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Energy Dispatched:</span>
              <span className="font-mono font-semibold text-foreground">{amountKwh.toFixed(1)} kWh</span>
            </div>
            <div className="pt-2 border-t border-border/40 flex justify-between items-center">
              <span className="font-sans font-bold text-xs text-foreground uppercase">Estimated Realized Value:</span>
              <span className="font-sans text-lg font-extrabold text-[var(--healthy)] tabular-nums">
                ₹{estimatedEarnings.toFixed(2)}
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
            disabled={isSubmitting || amountKwh <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Recording to Supabase…</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Confirm & Sell Now</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
