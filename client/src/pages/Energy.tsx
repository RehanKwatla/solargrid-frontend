import { Download } from "lucide-react";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { mockTelemetry, facility } from "@/data/mockData";
import { DayTimeline } from "@/components/dashboard/DayTimeline";

export default function Energy() {
  const t = mockTelemetry;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3">
        <div>
          <div className="instrument-label mb-2">{facility.code} · {facility.location}</div>
          <h1 className="heading-xl text-foreground">
            Energy
          </h1>
          <p className="mt-2 text-[0.84rem] text-text-secondary">
            Production, demand, storage, and grid behavior at {facility.name}
          </p>
        </div>
        <button className="technical-button !py-2 !px-3.5">
          <Download size={15} />
          Export
        </button>
      </header>

      {/* Solar vs demand chart */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <p className="instrument-label mb-1">PV-01 vs LOAD</p>
          <h2 className="heading-sm">Solar vs facility demand</h2>
        </div>
        <div className="pt-1">
          <EnergyChart type="solar" height={300} />
        </div>
      </section>

      {/* Battery + Grid charts */}
      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-5 sm:p-6">
          <div className="mb-5">
            <p className="instrument-label mb-1">BESS-01</p>
            <h2 className="heading-sm">Battery state</h2>
          </div>
          <div className="pt-1">
            <EnergyChart type="battery" height={200} />
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-5">
            <p className="instrument-label mb-1">GRID-01</p>
            <h2 className="heading-sm">Grid import</h2>
          </div>
          <div className="pt-1">
            <EnergyChart type="grid" height={200} />
          </div>
        </div>
      </section>

      {/* Supply composition + Battery reserve */}
      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-5 sm:p-6">
          <div className="mb-5">
            <p className="instrument-label mb-1">Energy mix</p>
            <h2 className="heading-sm">Current supply composition</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Solar", sub: "PV-01", value: 62, color: "var(--accent)", text: `${t.solarKw} kW` },
              { label: "Battery", sub: "BESS-01", value: 16, color: "var(--text-tertiary)", text: `${t.batteryKw} kW` },
              { label: "Grid", sub: "GRID-01", value: 22, color: "var(--border-strong)", text: `${t.gridKw} kW` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[0.81rem] font-medium text-foreground">
                    {item.label} <span className="text-text-tertiary font-normal ml-1 text-[0.75rem]">{item.sub}</span>
                  </span>
                  <span className="text-[0.81rem] font-semibold tabular-nums text-foreground">
                    {item.value}% · {item.text}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battery reserve — industrial panel, not decorative */}
        <div className="border border-[var(--healthy-ring)]/30 bg-[var(--healthy-bg)] rounded-lg p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pill pill-healthy mb-4">
              <span className="status-dot healthy" />
              BESS-01
            </div>
            <h2 className="heading-sm text-foreground">
              Battery reserve
            </h2>
          </div>
          <div className="mt-6">
            <p className="text-5xl sm:text-6xl font-bold tracking-tighter leading-none text-foreground tabular-nums">
              {t.batterySoc}<span className="text-2xl ml-0.5 font-semibold text-text-secondary">%</span>
            </p>
            <p className="mt-4 text-[0.81rem] font-medium text-text-secondary leading-relaxed">
              Charging at {t.batteryKw} kW — preserving reserve for peak window
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <p className="instrument-label mb-1">Day cycle</p>
          <h2 className="heading-sm">Energy timeline</h2>
        </div>
        <div>
          <DayTimeline />
        </div>
      </section>
    </div>
  );
}
