import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { EnergySharingOverview } from "@/components/energy-sharing/EnergySharingOverview";
import { NeighbourEnergyMeter } from "@/components/energy-sharing/NeighbourEnergyMeter";
import { CreditBalanceCard } from "@/components/energy-sharing/CreditBalanceCard";
import { EarningsSummary } from "@/components/energy-sharing/EarningsSummary";
import { TransactionHistoryTable } from "@/components/energy-sharing/TransactionHistoryTable";
import { SellEnergyModal } from "@/components/energy-sharing/SellEnergyModal";
import { RequestEnergyModal } from "@/components/energy-sharing/RequestEnergyModal";
import { ArrowDownRight, ArrowUpRight, Share2, Sparkles } from "lucide-react";

export default function EnergySharing() {
  const { facility } = useDashboardData();
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · India";

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8 space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              {facilityCode} · {facilityLocation}
            </span>
            <span className="pill pill-healthy !text-[9px] !py-0.5">P2P Microgrid</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
            Energy Sharing & Peer Trading
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">
            Monetize and dispatch surplus renewable energy to connected hospital wings, clinical cold-chain storage, and local microgrid feeders.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setSellModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 transition-all"
          >
            <ArrowUpRight size={16} />
            <span>Sell Energy Now</span>
          </button>

          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-sans text-xs font-semibold text-foreground hover:bg-surface-soft transition-all"
          >
            <ArrowDownRight size={16} />
            <span>Request Energy Now</span>
          </button>
        </div>
      </section>

      {/* 1. Energy Sharing Overview */}
      <section>
        <EnergySharingOverview />
      </section>

      {/* 2. Neighbour Energy Meter */}
      <section>
        <NeighbourEnergyMeter />
      </section>

      {/* 3 & 4. Credit Balance & Earnings (2 columns on desktop/tablet, stacked on mobile) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditBalanceCard
          onOpenSell={() => setSellModalOpen(true)}
          onOpenRequest={() => setRequestModalOpen(true)}
        />
        <EarningsSummary />
      </section>

      {/* 5. Transaction History Table */}
      <section>
        <TransactionHistoryTable />
      </section>

      {/* Modals */}
      <SellEnergyModal open={sellModalOpen} onOpenChange={setSellModalOpen} />
      <RequestEnergyModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
    </div>
  );
}
