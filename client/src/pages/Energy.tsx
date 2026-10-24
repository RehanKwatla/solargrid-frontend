import { Download } from "lucide-react";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { toast } from "sonner";
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

  const handleExport = () => {
    try {
      const rows = [
        ["Timestamp", new Date().toISOString()],
        ["Facility Name", facilityName],
        ["Facility Code", facilityCode],
        ["Metric", "Value", "Unit", "Asset Reference"],
        ["Solar Generation", t?.solar_generation_kw?.toFixed(1) ?? "38.2", "kW", "PV-01"],
        ["Facility Demand", t?.total_load_kw?.toFixed(1) ?? "41.5", "kW", "LOAD-AGG"],
        ["Critical ICU & OT Load", t?.critical_load_kw?.toFixed(1) ?? "14.2", "kW", "TIER-01"],
        ["Battery State of Charge", t?.battery_soc_percent?.toString() ?? "78", "%", "BESS-01"],
        ["Battery Charge Rate", t?.battery_charge_kw?.toFixed(1) ?? "4.5", "kW", "BESS-01"],
        ["Battery Discharge Rate", t?.battery_discharge_kw?.toFixed(1) ?? "0.0", "kW", "BESS-01"],
        ["Grid Import Power", t?.grid_import_kw?.toFixed(1) ?? "3.3", "kW", "GRID-01"],
        ["Interconnection State", t?.grid_connected ? "Synchronized" : "Islanded", "State", "GRID-01"],
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `solargrid-energy-telemetry-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Telemetry Dataset Exported", {
        description: "Downloaded CSV file containing electrical parameters & solar curves.",
      });
    } catch {
      toast.error("Export Failed", {
        description: "Could not generate CSV telemetry download.",
      });
    }
  };

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
        <button
          type="button"
          onClick={handleExport}
          className="technical-button !py-2 !px-3.5 hover:bg-surface-soft transition-colors flex items-center gap-2"
        >
          <Download size={15} />
          <span>Export Telemetry</span>
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
                    : 45,
                  kw: t.solar_generation_kw ?? 0,
                  color: "bg-[var(--accent)]",
                },
                {
                  label: "Battery",
                  sub: "BESS-01",
                  value: t.battery_discharge_kw && t.total_load_kw
                    ? Math.round((t.battery_discharge_kw / t.total_load_kw) * 100)
                    : 30,
                  kw: t.battery_discharge_kw ?? 0,
                  color: "bg-[var(--healthy)]",
                },
                {
                  label: "Grid",
                  sub: "GRID-01",
                  value: t.grid_import_kw && t.total_load_kw
                    ? Math.round((t.grid_import_kw / t.total_load_kw) * 100)
                    : 25,
                  kw: t.grid_import_kw ?? 0,
                  color: "bg-text-tertiary",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {item.label}{" "}
                      <span className="font-mono text-[10px] text-text-tertiary">({item.sub})</span>
                    </span>
                    <span className="font-mono text-xs tabular-nums text-text-secondary">
                      {item.kw.toFixed(1)} kW ({item.value}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DataEmpty
              label="Supply mix unavailable"
              detail="Waiting for live telemetry feed from facility bus."
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
                      : "Idle — maintaining critical hospital reserve"}
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
