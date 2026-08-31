import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/data/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Filter,
  History,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";

export function TransactionHistoryTable() {
  const { energyTransactions, energyTransactionsStatus } = useDashboardData();
  const [filterType, setFilterType] = useState<string>("All");

  const transactions = energyTransactions.filter((tx) => {
    if (filterType === "All") return true;
    return tx.type === filterType;
  });

  const getBadgeStyle = (type: TransactionType) => {
    switch (type) {
      case "Sold":
        return "bg-[var(--healthy-bg)] text-[var(--healthy)] border-[var(--healthy-ring)]/40";
      case "Shared":
        return "bg-[var(--accent-bg)] text-[var(--accent-strong)] border-[var(--accent-soft)]";
      case "Bought":
        return "bg-surface text-foreground border-border";
      case "Received":
        return "bg-surface-soft text-text-secondary border-border";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Settled":
        return "pill-healthy";
      case "Pending":
        return "pill-warning";
      case "Failed":
        return "pill-danger";
      default:
        return "pill-muted";
    }
  };

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Table Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
            <History size={15} />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-foreground leading-tight">
              Transaction & Settlement Ledger
            </h3>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              Microgrid Trading Log
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Sold", "Bought", "Shared", "Received"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={cn(
                "px-2.5 py-1 rounded-md font-mono text-xs font-medium transition-colors",
                filterType === tab
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-soft/60 text-text-secondary hover:text-foreground hover:bg-surface-soft border border-border/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[0.68rem] font-mono uppercase text-text-tertiary tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Timestamp</th>
              <th className="py-2.5 px-3 font-semibold">Type</th>
              <th className="py-2.5 px-3 font-semibold">Peer / Feeder Entity</th>
              <th className="py-2.5 px-3 font-semibold text-right">Energy (kWh)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Rate</th>
              <th className="py-2.5 px-3 font-semibold text-right">Total Amount</th>
              <th className="py-2.5 px-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const dateObj = new Date(tx.created_at);
                const formattedDate = dateObj.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <tr key={tx.id} className="hover:bg-surface-soft/40 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-3 font-mono text-[0.75rem] text-text-secondary whitespace-nowrap">
                      <div className="font-semibold text-foreground">{formattedDate}</div>
                      <div className="text-[0.68rem] text-text-tertiary">{formattedTime} IST</div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[0.68rem] font-bold border",
                          getBadgeStyle(tx.type)
                        )}
                      >
                        {tx.type === "Sold" && <ArrowUpRight size={12} />}
                        {tx.type === "Bought" && <ArrowDownLeft size={12} />}
                        {tx.type === "Shared" && <Share2 size={12} />}
                        {tx.type === "Received" && <ArrowDownLeft size={12} />}
                        {tx.type}
                      </span>
                    </td>

                    {/* Peer Entity */}
                    <td className="py-3 px-3 font-medium text-foreground">
                      <div className="font-sans font-semibold truncate max-w-[200px]">{tx.peer_entity}</div>
                      {tx.notes && (
                        <div className="font-mono text-[0.65rem] text-text-tertiary truncate max-w-[240px]">
                          {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Energy */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground tabular-nums whitespace-nowrap">
                      {tx.amount_kwh.toFixed(1)} kWh
                    </td>

                    {/* Rate */}
                    <td className="py-3 px-3 text-right font-mono text-text-secondary tabular-nums whitespace-nowrap">
                      ₹{tx.rate_inr.toFixed(2)}/kWh
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-3 text-right font-sans font-bold text-foreground tabular-nums whitespace-nowrap">
                      ₹{tx.total_amount_inr.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={cn("pill !text-[9px] !py-0.5", getStatusBadge(tx.status))}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-tertiary font-mono text-xs">
                  No {filterType !== "All" ? filterType : ""} transactions recorded in backend ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-2.5">
        {transactions.length > 0 ? (
          transactions.map((tx) => {
            const dateObj = new Date(tx.created_at);
            const dateStr = dateObj.toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return (
              <div
                key={tx.id}
                className="p-3 rounded-lg border border-border bg-surface-soft/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[0.68rem] font-bold border",
                        getBadgeStyle(tx.type)
                      )}
                    >
                      {tx.type}
                    </span>
                    <span className="font-mono text-[0.68rem] text-text-tertiary">
                      {dateStr} · {timeStr}
                    </span>
                  </div>
                  <span className={cn("pill !text-[9px] !py-0.5", getStatusBadge(tx.status))}>
                    {tx.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs font-semibold text-foreground truncate pr-2">
                    {tx.peer_entity}
                  </p>
                  <p className="font-mono text-xs font-bold text-foreground tabular-nums shrink-0">
                    {tx.amount_kwh.toFixed(1)} kWh
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-[0.72rem]">
                  <span className="font-mono text-text-tertiary">@ ₹{tx.rate_inr.toFixed(2)}/kWh</span>
                  <span className="font-sans font-bold text-foreground">₹{tx.total_amount_inr.toFixed(2)}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-text-tertiary font-mono text-xs">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
