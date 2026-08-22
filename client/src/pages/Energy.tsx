import { Download } from "lucide-react";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { mockTelemetry, facility } from "@/data/mockData";
import { DayTimeline } from "@/components/dashboard/DayTimeline";

export default function Energy() {
  const t = mockTelemetry;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary mb-4">
            {facility.location}
          </div>
          <h1 className="heading-xl text-foreground">
            Energy
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Production, demand, storage, and grid behavior at {facility.name}.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-surface border border-border text-foreground px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-surface-soft active:scale-95">
          <Download size={16} />
          Export
        </button>
      </header>

      <section className="rounded-2xl border border-border bg-surface shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Solar vs facility demand
          </h2>
          <p className="text-sm text-text-secondary mt-1">PV-01 vs LOAD</p>
        </div>
        <div className="pt-2">
          <EnergyChart type="solar" height={320} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Battery state
            </h2>
            <p className="text-sm text-text-secondary mt-1">BESS-01</p>
          </div>
          <div className="pt-2">
            <EnergyChart type="battery" height={220} />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Grid import
            </h2>
            <p className="text-sm text-text-secondary mt-1">GRID-01</p>
          </div>
          <div className="pt-2">
            <EnergyChart type="grid" height={220} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Current supply composition
            </h2>
            <p className="text-sm text-text-secondary mt-1">Energy mix breakdown</p>
          </div>
          <div className="space-y-5">
            {[
              { label: "Solar", sub: "PV-01", value: 62, color: "var(--accent)", text: `${t.solarKw} kW` },
              { label: "Battery", sub: "BESS-01", value: 16, color: "var(--text-secondary)", text: `${t.batteryKw} kW` },
              { label: "Grid", sub: "GRID-01", value: 22, color: "var(--border-color)", text: `${t.gridKw} kW` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {item.label} <span className="text-text-secondary font-normal ml-1">{item.sub}</span>
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.value}% · {item.text}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-surface-soft overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-transparent bg-healthy text-white shadow-md p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
              BESS-01
            </div>
            <h2 className="text-2xl font-semibold">
              Battery reserve
            </h2>
          </div>
          <div>
            <p className="mt-4 text-6xl font-bold tracking-tight">
              {t.batterySoc}<span className="text-3xl ml-1">%</span>
            </p>
            <p className="mt-4 text-sm font-medium opacity-90">
              Charging at {t.batteryKw} kW — preserving reserve for peak window.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Energy timeline
          </h2>
          <p className="text-sm text-text-secondary mt-1">Day cycle schedule</p>
        </div>
        <div>
          <DayTimeline />
        </div>
      </section>
    </div>
  );
}
