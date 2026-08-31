import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  CreditCard,
  HelpCircle,
  Scale,
  Sparkles,
} from "lucide-react";

export function CreditBalanceCard({
  onOpenSell,
  onOpenRequest,
}: {
  onOpenSell: () => void;
  onOpenRequest: () => void;
}) {
  const { energySharing } = useDashboardData();

  const balanceKwh = energySharing?.credit_balance_kwh ?? 124.5;
  const ratePerKwh = energySharing?.credit_rate_inr_per_kwh ?? 6.80;
  const totalValueInr = Math.abs(balanceKwh * ratePerKwh);

  const isCredit = balanceKwh >= 0;

  return (
    <div
      className={cn(
        "border rounded-lg p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between",
        isCredit
          ? "border-[var(--healthy-ring)]/50 bg-[var(--healthy-bg)]/15 shadow-[var(--shadow-sm)]"
          : "border-[var(--warning)]/50 bg-[var(--warning)]/10 shadow-[var(--shadow-sm)]"
      )}
    >
      {/* Background subtle watermark icon */}
      <div className="absolute right-3 top-3 pointer-events-none opacity-5">
        <Scale size={120} />
      </div>

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border",
                isCredit
                  ? "border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)] text-[var(--healthy)]"
                  : "border-[var(--warning)]/40 bg-[var(--warning)]/20 text-[var(--warning)]"
              )}
            >
              <Coins size={17} />
            </div>
            <div>
              <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
                Settlement & Ledger
              </span>
              <h3 className="font-sans text-base font-bold text-foreground leading-tight">
                Energy Credit Balance
              </h3>
            </div>
          </div>

          <span
            className={cn(
              "pill !text-[9px] !py-0.5 !px-2 font-mono uppercase tracking-wider",
              isCredit ? "pill-healthy" : "pill-warning"
            )}
          >
            {isCredit ? "Credit Surplus" : "Deficit / Owed"}
          </span>
        </div>

        {/* Primary Large Balance Display */}
        <div className="space-y-4 my-2">
          <div>
            <span className="font-mono text-[0.68rem] text-text-secondary uppercase tracking-wider block">
              {isCredit ? "Available Energy Credit" : "Energy Deficit Owed"}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <p
                className={cn(
                  "font-sans text-4xl sm:text-5xl font-extrabold tracking-tighter tabular-nums",
                  isCredit ? "text-[var(--healthy)]" : "text-[var(--warning)]"
                )}
              >
                {isCredit ? `+${balanceKwh.toFixed(1)}` : balanceKwh.toFixed(1)}
              </p>
              <span className="font-mono text-sm sm:text-base font-semibold text-text-tertiary">
                kWh
              </span>
            </div>
          </div>

          {/* Monetary Valuation */}
          <div className="pt-3 border-t border-border/60">
            <span className="font-mono text-[0.68rem] text-text-secondary uppercase tracking-wider block">
              {isCredit ? "Estimated Settlement Value" : "Amount Owed to Microgrid"}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="font-sans text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                ₹{totalValueInr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="font-mono text-[0.72rem] text-text-tertiary">
                @ ₹{ratePerKwh.toFixed(2)}/kWh baseline
              </span>
            </div>
          </div>
        </div>

        {/* Informational note */}
        <div className="mt-4 p-3 rounded-md bg-surface border border-border/80 text-[0.75rem] text-text-secondary flex items-start gap-2">
          {isCredit ? (
            <CheckCircle2 size={15} className="text-[var(--healthy)] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={15} className="text-[var(--warning)] shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed">
            {isCredit
              ? "Your facility has surplus generation banked into the microgrid ledger. You can liquidate credits as revenue or offset future grid consumption."
              : "Your facility consumed energy from peer microgrid storage. Settle deficit during next generation cycle or transfer credits."}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={onOpenSell}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 transition-all"
        >
          <ArrowUpRight size={15} />
          <span>Sell Energy Now</span>
        </button>

        <button
          type="button"
          onClick={onOpenRequest}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-sans text-xs font-semibold text-foreground hover:bg-surface-soft transition-all"
        >
          <ArrowDownRight size={15} />
          <span>Request Energy Now</span>
        </button>
      </div>
    </div>
  );
}
