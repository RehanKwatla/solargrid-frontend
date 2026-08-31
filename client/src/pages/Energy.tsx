import { Download } from "lucide-react";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import {
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
  ValueNA,
} from "@/components/common/DataState";

export default function Energy() {
  const {
    telemetry,
    telemetryStatus,
    facility,
    facilityStatus,
  } = useDashboardData();

  const t = telemetry;

  const facilityCode = facility?.code ?? "—";
  const facilityLocation = facility?.location ?? "—";
  const facilityName = facility?.name ?? "Facility";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="instrument-label">
              {facilityCode} · {facilityLocation}
            </div>
            <DataSourceBadge source={facilityStatus.kind} />
          </div>
          <h1 className="heading-xl text-foreground">Energy</h1>
          <p className="mt-2 text-[0.84rem] text-text-secondary">
            Production, demand, storage, and grid behavior at {facilityName}
            {telemetryStatus.lastUpdated && (
              <>
                {" · "}
                <LastUpdated timestamp={telemetryStatus.lastUpdated} source={telemetryStatus.kind} />
              </>
            )}
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
          {t ? (
            <div className="space-y-4">
              {[
                {
                  label: "Solar",
                  sub: "PV-01",
                  value: t.solar_generation_kw && t.total_load_kw
                    ? Math.round((t.solar_generation_kw / t.total_load_kw) * 100)
                    : 0,
                  color: "var(--accent)",
                  text: t.solar_generation_kw != null ? `${t.solar_generation_kw.toFixed(1)} kW` : "—",
                },
                {
                  label: "Battery",
                  sub: "BESS-01",
                  value: t.battery_charge_kw && t.total_load_kw
                    ? Math.round((t.battery_charge_kw / t.total_load_kw) * 100)
                    : 0,
                  color: "var(--text-tertiary)",
                  text: t.battery_charge_kw != null ? `${t.battery_charge_kw.toFixed(1)} kW` : "—",
                },
                {
                  label: "Grid",
                  sub: "GRID-01",
                  value: t.grid_import_kw && t.total_load_kw
                    ? Math.round((t.grid_import_kw / t.total_load_kw) * 100)
                    : 0,
                  color: "var(--border-strong)",
                  text: t.grid_import_kw != null ? `${t.grid_import_kw.toFixed(1)} kW` : "—",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[0.81rem] font-medium text-foreground">
                      {item.label}{" "}
                      <span className="text-text-tertiary font-normal ml-1 text-[0.75rem]">
                        {item.sub}
                      </span>
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
          ) : (
            <DataEmpty
              label="No telemetry data"
              detail="Supply composition will appear when live telemetry is available."
            />
          )}
        </div>

        {/* Battery reserve */}
        <div className="border border-[var(--healthy-ring)]/30 bg-[var(--healthy-bg)] rounded-lg p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pill pill-healthy mb-4">
              <span className="status-dot healthy" />
              BESS-01
            </div>
            <h2 className="heading-sm text-foreground">Battery reserve</h2>
          </div>
          <div className="mt-6">
            {t?.battery_soc_percent != null ? (
              <>
                <p className="text-5xl sm:text-6xl font-bold tracking-tighter leading-none text-foreground tabular-nums">
                  {t.battery_soc_percent}
                  <span className="text-2xl ml-0.5 font-semibold text-text-secondary">%</span>
                </p>
                <p className="mt-4 text-[0.81rem] font-medium text-text-secondary leading-relaxed">
                  {t.battery_charge_kw != null && t.battery_charge_kw > 0
                    ? `Charging at ${t.battery_charge_kw.toFixed(1)} kW — preserving reserve for peak window`
                    : t.battery_discharge_kw != null && t.battery_discharge_kw > 0
                      ? `Discharging at ${t.battery_discharge_kw.toFixed(1)} kW — supporting facility demand`
                      : "Idle — not charging or discharging"}
                </p>
              </>
            ) : (
              <div>
                <p className="text-5xl sm:text-6xl font-bold tracking-tighter leading-none text-text-tertiary">
                  <ValueNA />
                </p>
                <p className="mt-4 text-[0.81rem] font-medium text-text-secondary leading-relaxed">
                  Battery SOC data not available from backend
                </p>
              </div>
            )}
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
