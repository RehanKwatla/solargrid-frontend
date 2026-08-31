import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Clock,
  DollarSign,
  Flame,
  IndianRupee,
  Receipt,
  TrendingUp,
  Zap,
} from "lucide-react";

export function EarningsSummary() {
  const { energySharing } = useDashboardData();

  const totalSoldKwh = energySharing?.total_energy_sold_kwh ?? 2713.2;
  const totalEarningsInr = energySharing?.total_earnings_inr ?? 18450;
  const todayEarningsInr = energySharing?.today_earnings_inr ?? 2614;
  const pendingEarningsInr = energySharing?.pending_earnings_inr ?? 1088;
  const avgSellingRate = energySharing?.avg_selling_rate_inr ?? 6.80;

  return (
    <div className="border border-border bg-surface rounded-lg p-5 sm:p-6 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--accent-soft)] bg-[var(--accent-bg)] text-[var(--accent-strong)]">
            <IndianRupee size={17} />
          </div>
          <div>
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Commercial Metrics
            </span>
            <h3 className="font-sans text-base font-bold text-foreground leading-tight">
              Microgrid Trading Earnings
            </h3>
          </div>
        </div>

        <span className="font-mono text-[0.68rem] text-text-tertiary">
          INR (₹) Realized
        </span>
      </div>

      {/* Primary Highlight Card */}
      <div className="border border-border bg-surface-soft/40 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[0.65rem] font-medium tracking-wider uppercase text-text-secondary">
            Cumulative Revenue Realized
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
              ₹{totalEarningsInr.toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[0.72rem] text-text-tertiary mt-0.5">
            Across {totalSoldKwh.toLocaleString("en-IN", { maximumFractionDigits: 1 })} kWh total energy dispatched
          </p>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
            Avg Selling Rate
          </span>
          <p className="font-mono text-xl font-bold text-[var(--accent-strong)] tabular-nums mt-0.5">
            ₹{avgSellingRate.toFixed(2)}
            <span className="text-xs text-text-tertiary font-normal"> / kWh</span>
          </p>
        </div>
      </div>

      {/* 3 Secondary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Today's Earnings */}
        <div className="border border-border bg-surface p-3.5 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Today's P&L
            </span>
            <TrendingUp size={14} className="text-[var(--healthy)]" />
          </div>
          <p className="font-sans text-xl font-bold text-foreground tabular-nums">
            ₹{todayEarningsInr.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.7rem] text-text-secondary mt-1">
            From today's dispatches
          </p>
        </div>

        {/* Pending Earnings */}
        <div className="border border-border bg-surface p-3.5 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Pending Clearing
            </span>
            <Clock size={14} className="text-[var(--warning)]" />
          </div>
          <p className="font-sans text-xl font-bold text-[var(--warning)] tabular-nums">
            ₹{pendingEarningsInr.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.7rem] text-text-secondary mt-1">
            Settlement at 18:00 IST
          </p>
        </div>

        {/* Total Energy Sold */}
        <div className="border border-border bg-surface p-3.5 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
              Total Volume
            </span>
            <Zap size={14} className="text-[var(--accent)]" />
          </div>
          <p className="font-sans text-xl font-bold text-foreground tabular-nums">
            {totalSoldKwh.toFixed(1)}
            <span className="text-xs font-mono text-text-tertiary font-normal ml-1">kWh</span>
          </p>
          <p className="text-[0.7rem] text-text-secondary mt-1">
            Renewable export count
          </p>
        </div>
      </div>
    </div>
  );
}
