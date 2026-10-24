import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Clock,
  Gauge,
  HeartPulse,
  Info,
  Lock,
  Shield,
  Thermometer,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function BatteryManagementPanel() {
  const { telemetry: dbTelemetry, telemetryStatus } = useDashboardData();
  const sim = useTelemetry();

  const soc = dbTelemetry?.battery_soc_percent ?? sim.batterySoc ?? 78;
  const chargeKw = dbTelemetry?.battery_charge_kw ?? (sim.batteryKw > 0 ? sim.batteryKw : 4.4);
  const dischargeKw = dbTelemetry?.battery_discharge_kw ?? (sim.batteryKw < 0 ? Math.abs(sim.batteryKw) : 0);
  const isCharging = chargeKw > 0.1;
  const isDischarging = dischargeKw > 0.1;
  const isIdle = !isCharging && !isDischarging;

  const criticalLoadKw = dbTelemetry?.critical_load_kw ?? sim.criticalLoadKw ?? 14.2;
  // Estimated runtime on battery at critical load (assuming 100kWh pack)
  const remainingKwh = Math.max(0, (soc / 100) * 100);
  const hoursRemaining = (remainingKwh / Math.max(criticalLoadKw, 1)).toFixed(1);

  // Number of active cell blocks (out of 10)
  const activeCells = Math.round((soc / 100) * 10);
  const reserveThresholdIndex = 3.5; // 35% reserve

  return (
    <div className="card p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
              ASSET: BESS-01 · 100 kWh LFP RACK
            </span>
            <span
              className={cn(
                "pill !text-[9px] !py-0.5",
                isCharging
                  ? "pill-healthy"
                  : isDischarging
                  ? "pill-warning"
                  : "pill-muted"
              )}
            >
              {isCharging ? "Charging" : isDischarging ? "Discharging" : "Standby Reserve"}
            </span>
          </div>
          <h3 className="font-sans text-base font-bold text-foreground">
            Battery Storage &amp; Autonomy Management
          </h3>
        </div>

        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)] text-xs font-mono font-semibold text-[var(--healthy)] cursor-help">
              <Lock size={12} />
              <span>35% ICU Floor Locked</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            SolarGrid safety constraint: The bottom 35% capacity is reserved exclusively for ICU, surgical theatres, and vaccine refrigeration.
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Custom Architectural Battery Cell Matrix (Section 4.D requirement) */}
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary block">
              State of Charge (SOC)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-4xl sm:text-5xl font-black text-foreground tabular-nums tracking-tight">
                {soc}%
              </span>
              <span className="font-mono text-xs font-semibold text-text-secondary">
                {isCharging ? `(+${chargeKw.toFixed(1)} kW)` : isDischarging ? `(-${dischargeKw.toFixed(1)} kW)` : "Floating"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary block">
              ICU Autonomy Remaining
            </span>
            <span className="font-mono text-lg font-bold text-[var(--healthy)] tabular-nums">
              ~{hoursRemaining} Hours
            </span>
          </div>
        </div>

        {/* Custom 10-Segment Modular Rack Visualization */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-10 gap-1.5 p-2 rounded-xl border border-border bg-surface-soft/60 relative">
            {Array.from({ length: 10 }).map((_, idx) => {
              const filled = idx < activeCells;
              const isLockedReserve = idx < 4; // First 3-4 segments represent the 35% reserve

              return (
                <div
                  key={idx}
                  className={cn(
                    "h-8 sm:h-10 rounded-md border transition-all duration-300 relative flex flex-col justify-end p-1",
                    filled
                      ? isLockedReserve
                        ? "bg-[#6F7F5F] border-[#5A7347]"
                        : "bg-[#B5543A] border-[#8F3B25]"
                      : "bg-surface border-border/60 opacity-40"
                  )}
                  title={`Module ${idx + 1}: ${filled ? "Charged" : "Depleted"} ${isLockedReserve ? "(Protected Clinical Reserve)" : ""}`}
                >
                  {filled && (
                    <div className="w-full h-1 rounded-full bg-white/40 mb-0.5" />
                  )}
                  <span className="font-mono text-[8px] text-white/90 font-bold block text-center leading-none">
                    M{idx + 1}
                  </span>
                </div>
              );
            })}

            {/* Threshold marker for 35% */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--healthy)] border-r border-background pointer-events-none"
              style={{ left: "37%" }}
            >
              <div className="absolute -top-3 -translate-x-1/2 bg-[var(--healthy)] text-white font-mono text-[8px] font-bold px-1 rounded">
                35% FLOOR
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary px-1">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#6F7F5F]" />
              Locked Clinical Reserve (35 kWh)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#B5543A]" />
              Active Dispatch Buffer ({Math.max(0, soc - 35)} kWh)
            </span>
          </div>
        </div>
      </div>

      {/* Operating Limits & Physical Metrics Ledger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/80 text-xs">
        <div className="p-2.5 rounded-lg border border-border/60 bg-surface-soft/40 space-y-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block flex items-center gap-1">
            <Thermometer size={11} />
            Pack Temp
          </span>
          <span className="font-mono text-sm font-bold text-foreground">27.4°C</span>
          <span className="text-[10px] text-[var(--healthy)] block">Optimal</span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-surface-soft/40 space-y-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block flex items-center gap-1">
            <Zap size={11} />
            Inverter Limit
          </span>
          <span className="font-mono text-sm font-bold text-foreground">50.0 kW</span>
          <span className="text-[10px] text-text-secondary block">Max Dispatch</span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-surface-soft/40 space-y-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block flex items-center gap-1">
            <Gauge size={11} />
            Cell Balance
          </span>
          <span className="font-mono text-sm font-bold text-foreground">99.8%</span>
          <span className="text-[10px] text-[var(--healthy)] block">Equalized</span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-surface-soft/40 space-y-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block flex items-center gap-1">
            <Clock size={11} />
            Cycle Health
          </span>
          <span className="font-mono text-sm font-bold text-foreground">98.2% SOH</span>
          <span className="text-[10px] text-text-secondary block">412 Cycles</span>
        </div>
      </div>
    </div>
  );
}
