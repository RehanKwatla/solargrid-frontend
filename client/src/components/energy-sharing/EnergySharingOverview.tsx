import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  DataSourceBadge,
  LastUpdated,
  ValueNA,
  StaleIndicator,
} from "@/components/common/DataState";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BatteryCharging,
  Coins,
  Radio,
  Share2,
  TrendingUp,
} from "lucide-react";

export function EnergySharingOverview() {
  const { energySharing, energySharingStatus } = useDashboardData();

  const availableKwh = energySharing?.available_energy_kwh;
  const sharedKwh = energySharing?.energy_shared_kwh;
  const receivedKwh = energySharing?.energy_received_kwh;
  const balanceKwh = energySharing?.credit_balance_kwh;
  const creditsEarned = energySharing?.credits_earned;
  const estimatedEarnings = energySharing?.today_earnings_inr;
  const sharingStatus = energySharing?.sharing_status ?? "Active Sharing";

  const isPositiveBalance = (balanceKwh ?? 0) >= 0;

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Header status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--accent-soft)] bg-[var(--accent-bg)] text-[var(--accent-strong)]">
            <Share2 size={15} />
          </div>
          <div>
            <h2 className="font-sans text-base font-semibold tracking-tight text-foreground">
              Energy Sharing Overview
            </h2>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              Microgrid Peer-to-Peer Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source={energySharingStatus.kind} />
          <LastUpdated timestamp={energySharingStatus.lastUpdated} source={energySharingStatus.kind} />
          <StaleIndicator lastUpdated={energySharingStatus.lastUpdated} />
        </div>
      </div>

      {/* Grid of 7 core metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* 1. Available to Share */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Available
            </span>
            <BatteryCharging size={14} className="text-[var(--healthy)]" />
          </div>
          <div className="mt-1">
            {availableKwh !== undefined && availableKwh !== null ? (
              <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {availableKwh.toFixed(1)}
                <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kWh</span>
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Surplus ready
            </p>
          </div>
        </div>

        {/* 2. Energy Shared */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Exported
            </span>
            <ArrowUpRight size={14} className="text-[var(--accent)]" />
          </div>
          <div className="mt-1">
            {sharedKwh !== undefined && sharedKwh !== null ? (
              <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {sharedKwh.toFixed(1)}
                <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kWh</span>
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Total shared
            </p>
          </div>
        </div>

        {/* 3. Energy Received */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Imported
            </span>
            <ArrowDownLeft size={14} className="text-text-secondary" />
          </div>
          <div className="mt-1">
            {receivedKwh !== undefined && receivedKwh !== null ? (
              <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {receivedKwh.toFixed(1)}
                <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kWh</span>
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Peer received
            </p>
          </div>
        </div>

        {/* 4. Energy Balance */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Net Balance
            </span>
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                isPositiveBalance ? "bg-[var(--healthy)]" : "bg-[var(--warning)]"
              )}
            />
          </div>
          <div className="mt-1">
            {balanceKwh !== undefined && balanceKwh !== null ? (
              <p
                className={cn(
                  "font-sans text-2xl font-bold tracking-tight tabular-nums",
                  isPositiveBalance ? "text-[var(--healthy)]" : "text-[var(--warning)]"
                )}
              >
                {isPositiveBalance ? `+${balanceKwh.toFixed(1)}` : balanceKwh.toFixed(1)}
                <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">kWh</span>
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              {isPositiveBalance ? "Credit surplus" : "Deficit owed"}
            </p>
          </div>
        </div>

        {/* 5. Credits Earned */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Credits
            </span>
            <Coins size={14} className="text-[var(--accent-strong)]" />
          </div>
          <div className="mt-1">
            {creditsEarned !== undefined && creditsEarned !== null ? (
              <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {creditsEarned}
                <span className="ml-1 font-mono text-xs font-medium text-text-tertiary">pts</span>
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Green tokens
            </p>
          </div>
        </div>

        {/* 6. Today's Earnings */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Today
            </span>
            <TrendingUp size={14} className="text-[var(--healthy)]" />
          </div>
          <div className="mt-1">
            {estimatedEarnings !== undefined && estimatedEarnings !== null ? (
              <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums">
                ₹{estimatedEarnings.toLocaleString("en-IN")}
              </p>
            ) : (
              <ValueNA />
            )}
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              Est. earnings
            </p>
          </div>
        </div>

        {/* 7. Current Status */}
        <div className="border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-1 transition-colors hover:border-[var(--accent-soft)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[0.65rem] font-medium tracking-[0.08em] text-text-tertiary uppercase">
              Status
            </span>
            <Radio size={14} className="text-[var(--healthy)] animate-pulse" />
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--healthy-bg)] px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-[var(--healthy)] border border-[var(--healthy-ring)]/40 truncate max-w-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] shrink-0" />
              {sharingStatus}
            </span>
            <p className="text-[0.72rem] text-text-secondary mt-1 font-medium truncate">
              P2P microgrid active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
