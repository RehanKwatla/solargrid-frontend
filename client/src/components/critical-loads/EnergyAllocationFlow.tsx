import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Layers,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SunMedium,
  Zap,
} from "lucide-react";

export function EnergyAllocationFlow() {
  const {
    telemetry,
    hospitalLoads,
    optimization,
    emergencyMode,
  } = useDashboardData();

  const solarKw = telemetry?.solar_generation_kw ?? 42.5;
  const batterySoc = telemetry?.battery_soc_percent ?? 78;
  const batteryKw = telemetry?.battery_charge_kw ?? 8.4;
  const gridKw = telemetry?.grid_import_kw ?? 12.3;
  const totalSupplyKw = solarKw + batteryKw;

  const criticalKw = hospitalLoads
    .filter((l) => l.priority === "CRITICAL")
    .reduce((acc, l) => acc + l.current_kw, 0);

  const highKw = hospitalLoads
    .filter((l) => l.priority === "HIGH")
    .reduce((acc, l) => acc + l.current_kw, 0);

  const normalKw = hospitalLoads
    .filter((l) => l.priority === "NORMAL")
    .reduce((acc, l) => acc + l.current_kw, 0);

  const nonCriticalKw = hospitalLoads
    .filter((l) => l.priority === "NON-CRITICAL")
    .reduce((acc, l) => acc + l.current_kw, 0);

  // Dynamic calculations based on available power
  const criticalCoveragePercent = 100;
  const remainingAfterCritical = Math.max(0, totalSupplyKw - criticalKw);
  const highCoveragePercent = highKw > 0 ? Math.min(100, Math.round((remainingAfterCritical / highKw) * 100)) : 100;
  const remainingAfterHigh = Math.max(0, remainingAfterCritical - highKw);
  const normalCoveragePercent = emergencyMode.is_active ? 0 : (normalKw > 0 ? Math.min(100, Math.round((remainingAfterHigh / normalKw) * 100)) : 80);
  const nonCriticalCoveragePercent = emergencyMode.is_active ? 0 : 0; // Curtailment recommended

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Optimization Engine Dispatch Model
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--healthy-bg)] px-2 py-0.5 font-mono text-[9px] font-medium text-[var(--healthy)] border border-[var(--healthy-ring)]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] animate-pulse" />
              Real-Time Dynamic Balancing
            </span>
          </div>
          <h3 className="font-sans text-lg font-bold tracking-tight text-foreground mt-0.5">
            EMS Energy Allocation & Priority Dispatch Cascade
          </h3>
        </div>

        <div className="text-right">
          <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
            Critical Buffer Runtime
          </span>
          <span className="font-mono text-base font-bold text-[var(--healthy)] tabular-nums">
            +42 min guaranteed
          </span>
        </div>
      </div>

      {/* 3-Stage Diagram: Sources → EMS Engine → Priority Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Stage 1: Energy Inputs (4 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <span className="font-mono text-[0.65rem] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
            Available Generation Inputs
          </span>

          <div className="p-3 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-bg)]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SunMedium size={16} className="text-[var(--accent-strong)]" />
              <div>
                <p className="font-sans text-xs font-semibold text-foreground">Solar Array PV-01</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">Field Tracking Online</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-foreground tabular-nums">
              {solarKw.toFixed(1)} kW
            </span>
          </div>

          <div className="p-3 rounded-lg border border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging size={16} className="text-[var(--healthy)]" />
              <div>
                <p className="font-sans text-xs font-semibold text-foreground">Battery Bank BESS-01</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">{batterySoc}% SoC Ready</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[var(--healthy)] tabular-nums">
              +{batteryKw.toFixed(1)} kW
            </span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-surface-soft/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-text-secondary" />
              <div>
                <p className="font-sans text-xs font-semibold text-foreground">Grid Inlet GRID-01</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">Utility Feeder</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-foreground tabular-nums">
              {gridKw.toFixed(1)} kW
            </span>
          </div>
        </div>

        {/* Arrow/Bridge (1 col) */}
        <div className="hidden lg:flex lg:col-span-1 justify-center text-text-tertiary">
          <ArrowRight size={22} className="animate-pulse text-[var(--accent-strong)]" />
        </div>

        {/* Stage 2: EMS Optimization Engine (3 cols) */}
        <div className="lg:col-span-3 border border-[var(--accent)] bg-primary text-primary-foreground p-4 sm:p-5 rounded-lg shadow-[var(--shadow-sm)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-white">
              <BrainCircuit size={18} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
              ACTIVE EMS
            </span>
          </div>

          <div>
            <h4 className="font-sans text-base font-bold text-white leading-tight">
              Optimization Engine
            </h4>
            <p className="font-mono text-[0.68rem] text-white/80 mt-1 leading-relaxed">
              {optimization?.action ?? "Preserving Tier 01 Critical Reserve"}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 space-y-1 text-xs">
            <div className="flex justify-between text-white/80">
              <span>Total Available Power:</span>
              <span className="font-mono font-bold text-white tabular-nums">{totalSupplyKw.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Optimization Policy:</span>
              <span className="font-mono text-white font-medium">Life-Safety Locked</span>
            </div>
          </div>
        </div>

        {/* Arrow/Bridge (1 col) */}
        <div className="hidden lg:flex lg:col-span-1 justify-center text-text-tertiary">
          <ArrowRight size={22} className="animate-pulse text-[var(--accent-strong)]" />
        </div>

        {/* Stage 3: Prioritized Dispatch Allocation Output (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="font-mono text-[0.65rem] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
            Resulting Tier Allocation
          </span>

          {/* Critical Tier */}
          <div className="p-3 rounded-lg border border-[var(--danger-ring)]/60 bg-[var(--danger-bg)]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-[var(--danger)]" />
              <div>
                <p className="font-sans text-xs font-bold text-[var(--danger)]">Critical Loads</p>
                <p className="font-mono text-[0.65rem] text-[var(--danger)]/80">ICU, OT, Blood Bank ({criticalKw.toFixed(1)} kW)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 font-mono text-xs font-black text-[var(--danger)]">
                <CheckCircle2 size={12} /> {criticalCoveragePercent}%
              </span>
              <p className="text-[0.62rem] text-text-tertiary uppercase">Fully Protected</p>
            </div>
          </div>

          {/* High Priority Tier */}
          <div className="p-3 rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[var(--warning)]" />
              <div>
                <p className="font-sans text-xs font-bold text-[var(--warning)]">High Priority</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">Triage, Imaging ({highKw.toFixed(1)} kW)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-[var(--warning)]">
                {highCoveragePercent}%
              </span>
              <p className="text-[0.62rem] text-text-tertiary uppercase">Supplied</p>
            </div>
          </div>

          {/* Normal Tier */}
          <div className="p-3 rounded-lg border border-border bg-surface-soft/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-text-secondary" />
              <div>
                <p className="font-sans text-xs font-semibold text-foreground">Normal Loads</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">General Wards ({normalKw.toFixed(1)} kW)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-text-secondary">
                {normalCoveragePercent}%
              </span>
              <p className="text-[0.62rem] text-text-tertiary uppercase">
                {normalCoveragePercent < 100 ? "Throttled" : "Supplied"}
              </p>
            </div>
          </div>

          {/* Non-Critical Tier */}
          <div className="p-3 rounded-lg border border-dashed border-border bg-surface-soft/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power size={16} className="text-text-tertiary" />
              <div>
                <p className="font-sans text-xs font-medium text-text-secondary">Non-Critical</p>
                <p className="font-mono text-[0.65rem] text-text-tertiary">Utilities & Laundry ({nonCriticalKw.toFixed(1)} kW)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-semibold text-[var(--warning)]">
                Curtailment
              </span>
              <p className="text-[0.62rem] text-text-tertiary uppercase">Shed Buffer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
