import { Download } from "lucide-react";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { mockTelemetry, facility } from "@/data/mockData";
import { DayTimeline } from "@/components/dashboard/DayTimeline";

export default function Energy() {
  const t = mockTelemetry;

  return (
    <div className="dashboard-canvas px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="facility-location">{facility.location}</p>
          <h1 className="facility-name mt-1">Energy</h1>
          <p className="mt-2 max-w-xl text-sm text-[#8a9692]">
            Production, demand, storage, and grid behavior at {facility.name}.
          </p>
        </div>
        <button className="action-button">
          <Download size={14} />
          Export
        </button>
      </header>

      <section className="mt-10">
        <p className="asset-id">PV-01 vs LOAD</p>
        <h2 className="section-heading mt-1">Solar vs facility demand</h2>
        <div className="mt-6 border-t border-white/[.06] pt-6">
          <EnergyChart type="solar" height={280} />
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="asset-id">BESS-01</p>
          <h2 className="section-heading mt-1">Battery state</h2>
          <div className="mt-4 border-t border-white/[.06] pt-4">
            <EnergyChart type="battery" height={180} />
          </div>
        </div>
        <div>
          <p className="asset-id">GRID-01</p>
          <h2 className="section-heading mt-1">Grid import</h2>
          <div className="mt-4 border-t border-white/[.06] pt-4">
            <EnergyChart type="grid" height={180} />
          </div>
        </div>
      </section>

      <div className="section-divider mt-10" />

      <section className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_.6fr]">
        <div>
          <p className="asset-id">Energy mix</p>
          <h2 className="section-heading mt-1">Current supply composition</h2>
          <div className="mt-6 space-y-5">
            {[
              { label: "Solar · PV-01", value: 62, color: "bg-[#a8c44a]", text: `${t.solarKw} kW` },
              { label: "Battery · BESS-01", value: 16, color: "bg-[#8a7eb8]", text: `${t.batteryKw} kW` },
              { label: "Grid · GRID-01", value: 22, color: "bg-[#b89860]", text: `${t.gridKw} kW` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a9692]">{item.label}</span>
                  <span className="text-[#e7ece9]">
                    {item.value}% · {item.text}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="asset-id">BESS-01</p>
          <h2 className="section-heading mt-1">Battery reserve</h2>
          <p className="mt-6 text-5xl font-semibold tracking-tight text-[#e7ece9]">
            {t.batterySoc}
            <span className="ml-1 text-lg text-[#6d7874]">%</span>
          </p>
          <p className="mt-2 text-sm text-[#8a9692]">
            Charging at {t.batteryKw} kW — preserving reserve for peak window.
          </p>
        </div>
      </section>

      <div className="section-divider mt-10" />

      <section className="mt-8">
        <p className="asset-id">Day cycle</p>
        <h2 className="section-heading mt-1">Energy timeline</h2>
        <div className="mt-4">
          <DayTimeline />
        </div>
      </section>
    </div>
  );
}
