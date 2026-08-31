import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Flame,
  IndianRupee,
  Layers,
  Receipt,
  Scale,
  Zap,
} from "lucide-react";

export function MeteringSettlementLedger() {
  const { energySharing, energyTransactions } = useDashboardData();

  const availableCreditKwh = energySharing?.available_energy_kwh ?? 45.8;
  const balanceKwh = energySharing?.credit_balance_kwh ?? 124.5;
  const ratePerKwh = energySharing?.credit_rate_inr_per_kwh ?? 6.80;
  const estimatedSettlementValueInr = Math.abs(balanceKwh * ratePerKwh);
  const totalSoldKwh = energySharing?.total_energy_sold_kwh ?? 2713.2;
  const energySharedKwh = energySharing?.energy_shared_kwh ?? 120.4;
  const energyReceivedKwh = energySharing?.energy_received_kwh ?? 34.2;
  const pendingSettlementInr = energySharing?.pending_earnings_inr ?? 1088;

  // Calculate energy bought from transactions
  const totalBoughtKwh = energyTransactions
    .filter((tx) => tx.type === "Bought")
    .reduce((acc, tx) => acc + tx.amount_kwh, 25.0);

  const isSurplus = balanceKwh >= 0;

  // Recent transactions
  const recentTransactions = energyTransactions.slice(0, 5);

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border",
              isSurplus
                ? "border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)] text-[var(--healthy)]"
                : "border-[var(--warning)]/40 bg-[var(--warning)]/20 text-[var(--warning)]"
            )}
          >
            <Scale size={17} />
          </div>
          <div>
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Energy Accounting & Reconciliation
            </span>
            <h3 className="font-sans text-lg font-bold text-foreground leading-tight">
              Settlement & Ledger
            </h3>
          </div>
        </div>

        <span
          className={cn(
            "pill !text-[9px] !py-0.5 !px-2.5 font-mono uppercase tracking-wider",
            isSurplus ? "pill-healthy" : "pill-warning"
          )}
        >
          {isSurplus ? "Surplus Credit Balance" : "Deficit Owed to Grid"}
        </span>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Available Energy Credit */}
        <div className="p-3.5 rounded-lg border border-border bg-surface-soft/40 flex flex-col justify-between">
          <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
            Available Energy Credit
          </span>
          <div className="mt-2">
            <p className="font-sans text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {availableCreditKwh.toFixed(1)}
              <span className="ml-1 font-mono text-xs text-text-tertiary">kWh</span>
            </p>
            <p className="text-[0.7rem] text-text-secondary mt-0.5">
              Available to liquidate / dispatch
            </p>
          </div>
        </div>

        {/* 2. Current Credit (+/-) */}
        <div
          className={cn(
            "p-3.5 rounded-lg border flex flex-col justify-between",
            isSurplus
              ? "border-[var(--healthy-ring)]/50 bg-[var(--healthy-bg)]/20"
              : "border-[var(--warning)]/50 bg-[var(--warning)]/15"
          )}
        >
          <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
            Current Credit (+/-)
          </span>
          <div className="mt-2">
            <p
              className={cn(
                "font-sans text-xl sm:text-2xl font-black tabular-nums",
                isSurplus ? "text-[var(--healthy)]" : "text-[var(--warning)]"
              )}
            >
              {isSurplus ? `+${balanceKwh.toFixed(1)}` : balanceKwh.toFixed(1)}
              <span className="ml-1 font-mono text-xs font-semibold">kWh</span>
            </p>
            <p className="text-[0.7rem] font-medium mt-0.5">
              {isSurplus ? "Surplus Position" : "Deficit Position"}
            </p>
          </div>
        </div>

        {/* 3. Estimated Settlement Value */}
        <div className="p-3.5 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-bg)]/20 flex flex-col justify-between">
          <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
            Estimated Settlement Value
          </span>
          <div className="mt-2">
            <p className="font-sans text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              ₹{estimatedSettlementValueInr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[0.7rem] text-text-secondary mt-0.5">
              @ ₹{ratePerKwh.toFixed(2)}/kWh baseline
            </p>
          </div>
        </div>

        {/* 4. Pending Settlement */}
        <div className="p-3.5 rounded-lg border border-border bg-surface-soft/40 flex flex-col justify-between">
          <span className="font-mono text-[0.65rem] text-text-tertiary uppercase">
            Pending Settlement
          </span>
          <div className="mt-2">
            <p className="font-sans text-xl sm:text-2xl font-bold text-[var(--warning)] tabular-nums">
              ₹{pendingSettlementInr.toLocaleString("en-IN")}
            </p>
            <p className="text-[0.7rem] text-text-secondary mt-0.5">
              Clearing cycle at 18:00 IST
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Ledger 4 Columns (Sold, Bought, Shared, Received) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
          <div>
            <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
              Energy Sold
            </span>
            <p className="font-mono text-sm font-bold text-foreground tabular-nums mt-0.5">
              {totalSoldKwh.toLocaleString("en-IN", { maximumFractionDigits: 1 })} kWh
            </p>
          </div>
          <ArrowUpRight size={16} className="text-[var(--healthy)]" />
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
          <div>
            <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
              Energy Bought
            </span>
            <p className="font-mono text-sm font-bold text-foreground tabular-nums mt-0.5">
              {totalBoughtKwh.toFixed(1)} kWh
            </p>
          </div>
          <ArrowDownLeft size={16} className="text-[var(--warning)]" />
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
          <div>
            <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
              Energy Shared
            </span>
            <p className="font-mono text-sm font-bold text-foreground tabular-nums mt-0.5">
              {energySharedKwh.toFixed(1)} kWh
            </p>
          </div>
          <Flame size={16} className="text-[var(--accent)]" />
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
          <div>
            <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
              Energy Received
            </span>
            <p className="font-mono text-sm font-bold text-foreground tabular-nums mt-0.5">
              {energyReceivedKwh.toFixed(1)} kWh
            </p>
          </div>
          <Zap size={16} className="text-text-secondary" />
        </div>
      </div>

      {/* Compact Settlement / Transaction Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
            Recent Settlement Ledger Entries
          </h4>
          <span className="font-mono text-[0.68rem] text-text-tertiary">
            {energyTransactions.length} Total Records
          </span>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-soft/40 font-mono text-[0.65rem] uppercase text-text-tertiary">
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Counterparty / Node</th>
                <th className="py-2.5 px-3 font-semibold text-right">Volume</th>
                <th className="py-2.5 px-3 font-semibold text-right">Rate</th>
                <th className="py-2.5 px-3 font-semibold text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {recentTransactions.map((tx) => {
                const dateObj = new Date(tx.created_at);
                const formattedDate = dateObj.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <tr key={tx.id} className="hover:bg-surface-soft/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase",
                          tx.type === "Sold"
                            ? "bg-[var(--healthy-bg)] text-[var(--healthy)]"
                            : tx.type === "Bought"
                            ? "bg-[var(--warning)]/15 text-[var(--warning)]"
                            : "bg-surface-soft text-text-secondary"
                        )}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground max-w-[220px] truncate">
                      {tx.peer_entity}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-foreground font-semibold tabular-nums">
                      {tx.amount_kwh.toFixed(1)} kWh
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-text-secondary tabular-nums">
                      ₹{tx.rate_inr.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-foreground tabular-nums">
                      ₹{tx.total_amount_inr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "pill !text-[9px] !py-0.5",
                          tx.status === "Settled" || tx.status === "Completed"
                            ? "pill-healthy"
                            : tx.status === "Pending"
                            ? "pill-warning"
                            : "pill-muted"
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-[0.68rem] text-text-tertiary whitespace-nowrap">
                      {formattedDate} · {formattedTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
