import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Banknote,
  Coins,
  Cpu,
  Flame,
  Globe,
  IndianRupee,
  Layers,
  Power,
  Scale,
  ShieldAlert,
  SunMedium,
  Zap,
} from "lucide-react";

export function MeteringEnergyFlow() {
  const { telemetry, energySharing } = useDashboardData();

  const solarGenKw = telemetry?.solar_generation_kw ?? 42.5;
  const hospitalLoadKw = telemetry?.total_load_kw ?? 51.2;
  const gridImportKw = telemetry?.grid_import_kw ?? 12.3;
  const gridExportKw = telemetry?.grid_export_kw ?? 0.0;
  const energySharedKwh = energySharing?.energy_shared_kwh ?? 120.4;
  const creditBalanceKwh = energySharing?.credit_balance_kwh ?? 124.5;
  const totalEarningsInr = energySharing?.total_earnings_inr ?? 18450;
  const ratePerKwh = energySharing?.credit_rate_inr_per_kwh ?? 6.80;
  const estimatedSettlementInr = Math.abs(creditBalanceKwh * ratePerKwh);

  const isSurplus = creditBalanceKwh >= 0;

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Complete Energy Accounting Ledger
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--healthy-bg)] px-2 py-0.5 font-mono text-[9px] font-medium text-[var(--healthy)] border border-[var(--healthy-ring)]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] animate-pulse" />
              Live Balance
            </span>
          </div>
          <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight text-foreground mt-0.5">
            Generation to Financial Settlement Chain
          </h3>
        </div>

        <div className="text-right">
          <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
            Net Settlement Status
          </span>
          <span
            className={cn(
              "font-mono text-sm sm:text-base font-bold tabular-nums",
              isSurplus ? "text-[var(--healthy)]" : "text-[var(--warning)]"
            )}
          >
            {isSurplus ? `+₹${estimatedSettlementInr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Surplus` : `-₹${estimatedSettlementInr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Deficit`}
          </span>
        </div>
      </div>

      {/* 6-Stage Flow Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-1">
        {/* 1. Generated */}
        <div className="p-3 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-bg)]/20 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold text-text-tertiary uppercase">
              1. Generated
            </span>
            <SunMedium size={15} className="text-[var(--accent-strong)]" />
          </div>
          <div>
            <p className="font-sans text-lg font-bold text-foreground tabular-nums">
              {solarGenKw.toFixed(1)} <span className="font-mono text-xs font-normal text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.68rem] text-text-secondary mt-0.5 font-medium truncate">
              Onsite Solar PV-01
            </p>
          </div>
        </div>

        {/* 2. Consumed */}
        <div className="p-3 rounded-lg border border-border bg-surface-soft/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold text-text-tertiary uppercase">
              2. Consumed
            </span>
            <Zap size={15} className="text-text-secondary" />
          </div>
          <div>
            <p className="font-sans text-lg font-bold text-foreground tabular-nums">
              {hospitalLoadKw.toFixed(1)} <span className="font-mono text-xs font-normal text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.68rem] text-text-secondary mt-0.5 font-medium truncate">
              Hospital Load Demand
            </p>
          </div>
        </div>

        {/* 3. Grid Flow */}
        <div className="p-3 rounded-lg border border-border bg-surface-soft/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold text-text-tertiary uppercase">
              3. Grid Flow
            </span>
            <Globe size={15} className="text-text-tertiary" />
          </div>
          <div>
            <p className="font-sans text-lg font-bold text-foreground tabular-nums">
              {gridImportKw > 0 ? `+${gridImportKw.toFixed(1)}` : `${gridExportKw.toFixed(1)}`}{" "}
              <span className="font-mono text-xs font-normal text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.68rem] text-text-secondary mt-0.5 font-medium truncate">
              {gridImportKw > 0 ? "Grid Net Import" : "Grid Net Export"}
            </p>
          </div>
        </div>

        {/* 4. Shared */}
        <div className="p-3 rounded-lg border border-[var(--accent-soft)] bg-surface-soft/60 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold text-text-tertiary uppercase">
              4. Shared
            </span>
            <Flame size={15} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-sans text-lg font-bold text-foreground tabular-nums">
              {energySharedKwh.toFixed(1)} <span className="font-mono text-xs font-normal text-text-tertiary">kWh</span>
            </p>
            <p className="text-[0.68rem] text-text-secondary mt-0.5 font-medium truncate">
              Microgrid Dispatches
            </p>
          </div>
        </div>

        {/* 5. Credits/Debits */}
        <div
          className={cn(
            "p-3 rounded-lg border flex flex-col justify-between space-y-2",
            isSurplus
              ? "border-[var(--healthy-ring)]/50 bg-[var(--healthy-bg)]/20"
              : "border-[var(--warning)]/50 bg-[var(--warning)]/15"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold uppercase text-text-tertiary">
              5. Net Credits
            </span>
            <Coins size={15} className={isSurplus ? "text-[var(--healthy)]" : "text-[var(--warning)]"} />
          </div>
          <div>
            <p
              className={cn(
                "font-sans text-lg font-bold tabular-nums",
                isSurplus ? "text-[var(--healthy)]" : "text-[var(--warning)]"
              )}
            >
              {isSurplus ? `+${creditBalanceKwh.toFixed(1)}` : creditBalanceKwh.toFixed(1)}{" "}
              <span className="font-mono text-xs font-normal text-text-tertiary">kWh</span>
            </p>
            <p className="text-[0.68rem] text-text-secondary mt-0.5 font-medium truncate">
              {isSurplus ? "Credit Surplus" : "Energy Deficit"}
            </p>
          </div>
        </div>

        {/* 6. Settlement */}
        <div className="p-3 rounded-lg border border-[var(--healthy-ring)]/60 bg-surface flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-bold text-text-tertiary uppercase">
              6. Settlement
            </span>
            <IndianRupee size={15} className="text-[var(--healthy)]" />
          </div>
          <div>
            <p className="font-sans text-lg font-bold text-foreground tabular-nums">
              ₹{totalEarningsInr.toLocaleString("en-IN")}
            </p>
            <p className="text-[0.68rem] text-[var(--healthy)] mt-0.5 font-semibold truncate">
              Settled Revenue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
