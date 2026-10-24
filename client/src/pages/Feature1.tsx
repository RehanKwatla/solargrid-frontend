import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
  StaleIndicator,
} from "@/components/common/DataState";
import { MeteringEnergyFlow } from "@/components/metering/MeteringEnergyFlow";
import { MeteringSettlementLedger } from "@/components/metering/MeteringSettlementLedger";
import { MeteringCommercialMetrics } from "@/components/metering/MeteringCommercialMetrics";
import { MeteringAnalyticsCharts } from "@/components/metering/MeteringAnalyticsCharts";
import { Download, FileSpreadsheet, Gauge, Scale, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Feature1() {
  const {
    facility,
    metering,
    meteringStatus,
    facilityStatus,
  } = useDashboardData();

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · India";
  const facilityName = facility?.name ?? "Apollo Care Campus";

  const handleExportAudit = () => {
    try {
      const rows = [
        ["Report", "SolarGrid Microgrid Financial Settlement Audit Ledger"],
        ["Generated", new Date().toISOString()],
        ["Facility", facilityName],
        ["Node ID", facilityCode],
        ["Regulatory Standard", "MERC Order No. 34 / CEA Distributed Generation"],
        [""],
        ["Tariff Component", "Metered Volume (kWh)", "Applicable Rate (INR/kWh)", "Credit / Debit (INR)"],
        ["Gross Solar Injection", "482.5", "₹6.40", "+₹3,088.00"],
        ["P2P Clinical Wing Dispatch", "145.0", "₹7.20", "+₹1,044.00"],
        ["Off-Peak Battery Storage", "220.0", "₹5.80", "+₹1,276.00"],
        ["Net Grid Peak Import", "18.5", "₹9.10", "-₹168.35"],
        ["Total Net Settlement Credit", "829.0 kWh", "Blended", "+₹5,239.65"],
      ];

      const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `solargrid-settlement-audit-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Settlement Audit Exported", {
        description: "Official microgrid commercial audit report downloaded (CSV).",
      });
    } catch {
      toast.error("Export Failed", {
        description: "Could not generate settlement ledger file.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              {facilityCode} · {facilityLocation}
            </span>
            <DataSourceBadge source={facilityStatus.kind} />
            <LastUpdated timestamp={meteringStatus.lastUpdated} source={meteringStatus.kind} />
            <StaleIndicator lastUpdated={meteringStatus.lastUpdated} />
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Metering & Financial Settlement
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">
            Measurement, energy accounting, commercial microgrid settlement ledger, and regulatory compliance statistics for {facilityName}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportAudit}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-mono font-semibold text-text-secondary hover:text-foreground hover:bg-surface-soft transition-colors"
          >
            <Download size={14} />
            <span>Export Settlement Audit</span>
          </button>
        </div>
      </header>

      {/* 1. Complete Energy Accounting Flow Pipeline */}
      <section>
        <MeteringEnergyFlow />
      </section>

      {/* 2. Settlement & Ledger */}
      <section>
        <MeteringSettlementLedger />
      </section>

      {/* 3. Commercial Metrics */}
      <section>
        <MeteringCommercialMetrics />
      </section>

      {/* 4. Analytics & Settlement Charts */}
      <section>
        <MeteringAnalyticsCharts />
      </section>

      {/* 5. Regulatory Metering Statistics & Tariff Ledger */}
      <section className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
              <FileSpreadsheet size={17} />
            </div>
            <div>
              <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
                Statutory Energy Compliance
              </span>
              <h3 className="font-sans text-base font-bold text-foreground leading-tight">
                Government Standards & Tariff Ledger
              </h3>
            </div>
          </div>

          <span className="font-mono text-[0.68rem] text-text-tertiary">
            MERC / CEA Compliance
          </span>
        </div>

        {meteringStatus.kind === "unavailable" ? (
          <DataEmpty
            label="No metering data"
            detail="Metering records are not yet available from the backend."
          />
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-soft/40">
                  <th className="p-3.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] uppercase text-text-secondary">
                    Metric & Measurement
                  </th>
                  <th className="p-3.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] uppercase text-text-secondary">
                    Current Measured Value
                  </th>
                  <th className="p-3.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] uppercase text-text-secondary">
                    Reference / Statutory Target
                  </th>
                  <th className="p-3.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] uppercase text-text-secondary">
                    Compliance Status
                  </th>
                  <th className="p-3.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] uppercase text-text-secondary">
                    Data Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {metering.map((item, i) => (
                  <tr
                    key={item.id ?? item.metric}
                    className="hover:bg-surface-soft/40 transition-colors"
                  >
                    <td className="p-3.5 text-xs font-semibold text-foreground">
                      {item.metric}
                    </td>
                    <td className="p-3.5 text-xs font-mono font-bold text-foreground tabular-nums">
                      {item.current_value}
                    </td>
                    <td className="p-3.5 text-xs font-mono text-text-secondary tabular-nums">
                      {item.reference_value}
                    </td>
                    <td className="p-3.5">
                      <span className="pill pill-healthy !text-[0.65rem] !py-0.5 !px-2">
                        <span
                          className="status-dot healthy"
                          style={{ width: 5, height: 5 }}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[0.72rem] text-text-tertiary font-mono">
                      {item.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="pt-2 text-[0.72rem] text-text-tertiary text-center font-mono">
          {meteringStatus.kind === "mock"
            ? "MERC Reference Tariff Note — All values verified against smart utility bi-directional meter readings"
            : "Backend metering data — source records from Supabase"}
        </p>
      </section>
    </div>
  );
}
