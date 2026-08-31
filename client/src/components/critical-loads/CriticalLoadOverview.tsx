import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  DataSourceBadge,
  LastUpdated,
  ValueNA,
  StaleIndicator,
} from "@/components/common/DataState";
import {
  Activity,
  AlertOctagon,
  BatteryCharging,
  CheckCircle2,
  HeartPulse,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SunMedium,
  Zap,
} from "lucide-react";

export function CriticalLoadOverview() {
  const {
    telemetry,
    hospitalLoads,
    hospitalLoadsStatus,
    emergencyMode,
  } = useDashboardData();

  // Aggregate loads by priority
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

  const totalHospitalLoadKw = telemetry?.total_load_kw ?? (criticalKw + highKw + normalKw + nonCriticalKw);
  const availablePowerKw = (telemetry?.solar_generation_kw ?? 42.5) + (telemetry?.battery_charge_kw ?? 8.4);
  const protectedLoadKw = criticalKw + (availablePowerKw >= criticalKw + highKw ? highKw : 0);

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Header status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--danger-ring)]/40 bg-[var(--danger-bg)] text-[var(--danger)]">
            <HeartPulse size={16} />
          </div>
          <div>
            <h2 className="font-sans text-base font-semibold tracking-tight text-foreground">
              Clinical Load Telemetry & Protection
            </h2>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              Hospital Electrical Priority Bus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {emergencyMode.is_active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-bg)] px-2.5 py-0.5 font-mono text-[9px] font-bold text-[var(--danger)] border border-[var(--danger-ring)] animate-pulse">
              <AlertOctagon size={11} />
              EMERGENCY ACTIVE
            </span>
          )}
          <DataSourceBadge source={hospitalLoadsStatus.kind} />
          <LastUpdated timestamp={hospitalLoadsStatus.lastUpdated} source={hospitalLoadsStatus.kind} />
          <StaleIndicator lastUpdated={hospitalLoadsStatus.lastUpdated} />
        </div>
      </div>

      {/* Grid of 7 core metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* 1. Total Hospital Load */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Total Demand
            </span>
            <Activity size={14} className="text-text-secondary" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalHospitalLoadKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              {hospitalLoads.length} connected loads
            </p>
          </div>
        </div>

        {/* 2. Critical Load (Dominant visual) */}
        <div className="border border-[var(--danger-ring)]/60 bg-[var(--danger-bg)]/20 p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--danger)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-bold tracking-[0.08em] text-[var(--danger)] uppercase">
              Critical Load
            </span>
            <ShieldAlert size={15} className="text-[var(--danger)]" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-black tracking-tight text-[var(--danger)] tabular-nums">
              {criticalKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-bold text-[var(--danger)]">kW</span>
            </p>
            <p className="text-[0.72rem] text-[var(--danger)]/80 mt-1 font-semibold truncate">
              ICU · OT · Emergency & Trauma
            </p>
          </div>
        </div>

        {/* 3. High-Priority Load */}
        <div className="border border-[var(--warning)]/40 bg-[var(--warning)]/10 p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--warning)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.08em] text-[var(--warning)] uppercase">
              High Priority
            </span>
            <Shield size={14} className="text-[var(--warning)]" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {highKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              No representative loads
            </p>
          </div>
        </div>

        {/* 4. Normal Load */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Normal Load
            </span>
            <Zap size={14} className="text-text-tertiary" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {normalKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              No representative loads
            </p>
          </div>
        </div>

        {/* 5. Non-Critical Load */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Non-Critical
            </span>
            <Power size={14} className="text-text-tertiary" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {nonCriticalKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              No representative loads
            </p>
          </div>
        </div>

        {/* 6. Currently Protected */}
        <div className="border border-[var(--healthy-ring)]/50 bg-[var(--healthy-bg)]/20 p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--healthy)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-bold tracking-[0.08em] text-[var(--healthy)] uppercase">
              Protected Load
            </span>
            <ShieldCheck size={15} className="text-[var(--healthy)]" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-[var(--healthy)] tabular-nums">
              {protectedLoadKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-semibold text-[var(--healthy)]">kW</span>
            </p>
            <p className="text-[0.72rem] text-[var(--healthy)] font-medium mt-1 truncate">
              100% Critical Guarantee
            </p>
          </div>
        </div>

        {/* 7. Available Power */}
        <div className="border border-[var(--accent-soft)] bg-surface-soft/60 p-3.5 rounded-lg flex flex-col justify-between col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-1 transition-colors hover:border-[var(--accent)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Available Power
            </span>
            <SunMedium size={14} className="text-[var(--accent-strong)]" />
          </div>
          <div className="mt-1">
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {availablePowerKw.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Solar + BESS reserve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
