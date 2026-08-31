import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Clock,
  Coins,
  DollarSign,
  Flame,
  IndianRupee,
  Receipt,
  Scale,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

export function MeteringCommercialMetrics() {
  const { energySharing, telemetry } = useDashboardData();

  const totalSoldKwh = energySharing?.total_energy_sold_kwh ?? 2713.2;
  const totalEarningsInr = energySharing?.total_earnings_inr ?? 18450;
  const todayEarningsInr = energySharing?.today_earnings_inr ?? 2614;
  const pendingEarningsInr = energySharing?.pending_earnings_inr ?? 1088;
  const avgSellingRate = energySharing?.avg_selling_rate_inr ?? 6.80;
  const avgBuyingRate = energySharing?.avg_buying_rate_inr ?? 6.35;
  const avoidedCostInr = energySharing?.avoided_cost_inr ?? 34820;

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-5">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--accent-soft)] bg-[var(--accent-bg)] text-[var(--accent-strong)]">
            <IndianRupee size={17} />
          </div>
          <div>
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Commercial Metrics
            </span>
            <h3 className="font-sans text-lg font-bold text-foreground leading-tight">
              Commercial Performance & Tariff Optimization
            </h3>
          </div>
        </div>

        <span className="font-mono text-[0.68rem] text-text-tertiary">
          Values in INR (₹) & kWh
        </span>
      </div>

      {/* Hero Revenue & Avoided Cost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cumulative Revenue Realized */}
        <div className="border border-border bg-surface-soft/40 p-4 sm:p-5 rounded-lg flex flex-col justify-between space-y-3">
          <div>
            <span className="font-mono text-[0.65rem] font-semibold tracking-wider uppercase text-text-secondary">
              Cumulative Revenue Realized
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-foreground tabular-nums">
                ₹{totalEarningsInr.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="text-[0.72rem] text-text-secondary mt-1">
              Realized from peer-to-peer microgrid trades and renewable exports
            </p>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="font-mono text-[0.68rem] text-text-tertiary uppercase">Avg Selling Rate</span>
            <span className="font-mono font-bold text-[var(--accent-strong)] tabular-nums">
              ₹{avgSellingRate.toFixed(2)} / kWh
            </span>
          </div>
        </div>

        {/* Avoided Energy Cost */}
        <div className="border border-[var(--healthy-ring)]/50 bg-[var(--healthy-bg)]/15 p-4 sm:p-5 rounded-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.65rem] font-semibold tracking-wider uppercase text-[var(--healthy)]">
                Avoided Energy Cost
              </span>
              <ShieldCheck size={16} className="text-[var(--healthy)]" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[var(--healthy)] tabular-nums">
                ₹{avoidedCostInr.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="text-[0.72rem] text-text-secondary mt-1">
              Savings from self-consumption offsetting peak commercial grid tariffs
            </p>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="font-mono text-[0.68rem] text-text-tertiary uppercase">Avg Buying Rate</span>
            <span className="font-mono font-bold text-foreground tabular-nums">
              ₹{avgBuyingRate.toFixed(2)} / kWh
            </span>
          </div>
        </div>
      </div>

      {/* 4 Commercial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Today's P&L */}
        <div className="p-3.5 rounded-lg border border-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Today's P&L
            </span>
            <TrendingUp size={14} className="text-[var(--healthy)]" />
          </div>
          <p className="font-sans text-xl font-bold text-foreground tabular-nums">
            +₹{todayEarningsInr.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-text-secondary mt-1 truncate">
            Today's trading surplus
          </p>
        </div>

        {/* 2. Pending Clearing */}
        <div className="p-3.5 rounded-lg border border-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Pending Clearing
            </span>
            <Clock size={14} className="text-[var(--warning)]" />
          </div>
          <p className="font-sans text-xl font-bold text-[var(--warning)] tabular-nums">
            ₹{pendingEarningsInr.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-text-secondary mt-1 truncate">
            Settlement at 18:00 IST
          </p>
        </div>

        {/* 3. Total Energy Volume */}
        <div className="p-3.5 rounded-lg border border-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Total Volume
            </span>
            <Zap size={14} className="text-[var(--accent)]" />
          </div>
          <p className="font-sans text-xl font-bold text-foreground tabular-nums">
            {totalSoldKwh.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
            <span className="text-xs font-mono text-text-tertiary font-normal ml-1">kWh</span>
          </p>
          <p className="text-[0.68rem] text-text-secondary mt-1 truncate">
            Total dispatched energy
          </p>
        </div>

        {/* 4. Net Microgrid Margin */}
        <div className="p-3.5 rounded-lg border border-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Trading Margin
            </span>
            <Scale size={14} className="text-text-secondary" />
          </div>
          <p className="font-sans text-xl font-bold text-[var(--accent-strong)] tabular-nums">
            +₹{(avgSellingRate - avgBuyingRate).toFixed(2)}
            <span className="text-xs font-mono text-text-tertiary font-normal ml-1">/ kWh</span>
          </p>
          <p className="text-[0.68rem] text-text-secondary mt-1 truncate">
            Spread over buying rate
          </p>
        </div>
      </div>
    </div>
  );
}
