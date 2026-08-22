import { Activity, ArrowUpRight, BatteryCharging, CircleGauge, ShieldCheck } from "lucide-react";
import { MetricBlock } from "@/components/dashboard/MetricBlock";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { operatingState } from "@/data/mockData";
import { StatusPill } from "@/components/common/StatusPill";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import type { HealthState } from "@/data/mockData";

/** Grid Atlas: overview makes the current critical-infrastructure energy state understandable in one field of view. */
export default function Overview() {
  const { telemetry, formattedTime } = useSolarTracking();

  const kpis = [
    {
      label: "Solar generation",
      value: telemetry.solarKw.toFixed(1),
      unit: "kW",
      change: telemetry.solarKw > 35 ? "+tracking" : "Low sun",
      note: "from 3D sim",
      state: "healthy" as HealthState,
    },
    {
      label: "Battery",
      value: String(telemetry.batterySoc),
      unit: "%",
      change: telemetry.batteryKw > 0 ? "Charging" : "Idle",
      note: `${telemetry.batteryKw} kW`,
      state: "healthy" as HealthState,
    },
    {
      label: "Grid",
      value: telemetry.gridKw.toFixed(1),
      unit: "kW",
      change: telemetry.gridConnected ? "Connected" : "Offline",
      note: telemetry.gridKw > 0 ? "importing" : "minimal",
      state: "neutral" as HealthState,
    },
    {
      label: "Facility load",
      value: telemetry.loadKw.toFixed(1),
      unit: "kW",
      change: "Normal",
      note: "all systems",
      state: "healthy" as HealthState,
    },
    {
      label: "Critical load",
      value: telemetry.criticalLoadKw.toFixed(1),
      unit: "kW",
      change: "Protected",
      note: "Tier 1",
      state: "healthy" as HealthState,
    },
    {
      label: "Estimated savings",
      value: "₹1,240",
      unit: "",
      change: "Today",
      note: "demo estimate",
      state: "healthy" as HealthState,
    },
  ];

  return (
    <div className="dashboard-canvas px-5 py-7 sm:px-7 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">
            Apollo Care Campus · demo telemetry · {formattedTime} local
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.065em] text-white sm:text-[38px]">
            Energy overview.
          </h1>
          <p className="mt-2 text-sm text-[#98a39f]">
            Real-time energy management for critical infrastructure.
          </p>
        </div>
        <button type="button" className="action-button">
          <Activity size={15} />
          Demo telemetry
        </button>
      </div>

      <section className="mt-7">
        <SolarTrackingSection />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <PowerFlow />
        <article className="hero-reading min-h-[370px] overflow-hidden p-5 sm:p-6">
          <div
            className="hero-reading-art"
            style={{ backgroundImage: "url('/manus-storage/solargrid-hero_7ff8dba3.png')" }}
          />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label text-[#d8ff3e]">Operating mode</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">
                  {operatingState.mode}
                </h2>
              </div>
              <StatusPill state="healthy">Active</StatusPill>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#d1d9d5]">
              {operatingState.modeDetail}
            </p>
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="flex items-center gap-2 text-sm text-white">
                  <ShieldCheck size={17} className="text-[#d8ff3e]" />
                  Tier 1 protection
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[#d8ff3e]">
                  Held
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-white">
                  <BatteryCharging size={17} className="text-[#d8ff3e]" />
                  Battery strategy
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[#d8ff3e]">
                  {telemetry.batteryKw > 0 ? "Charging" : "Holding"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-white">
                  <CircleGauge size={17} className="text-[#d8ff3e]" />
                  Grid dependency
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[#d8ff3e]">
                  {telemetry.gridKw > 5 ? "Moderate" : "Reduced"}
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <MetricBlock key={item.label} {...item} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(330px,.75fr)]">
        <article className="operational-panel p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-label">Protection posture</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.045em] text-white">
                Normal operation, reserve intact.
              </h2>
            </div>
            <ArrowUpRight size={19} className="text-[#d8ff3e]" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4">
              <p className="section-label">Solar path</p>
              <p className="mt-2 text-lg font-medium text-white">Loads + storage</p>
              <p className="mt-1 text-xs text-[#919c98]">{telemetry.solarKw.toFixed(1)} kW simulated</p>
            </div>
            <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4">
              <p className="section-label">Grid path</p>
              <p className="mt-2 text-lg font-medium text-white">Connected</p>
              <p className="mt-1 text-xs text-[#919c98]">{telemetry.gridKw.toFixed(1)} kW import</p>
            </div>
            <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4">
              <p className="section-label">Outage readiness</p>
              <p className="mt-2 text-lg font-medium text-white">Prepared</p>
              <p className="mt-1 text-xs text-[#919c98]">Tier 1 protected</p>
            </div>
          </div>
        </article>
        <article className="operational-panel p-5 sm:p-6">
          <p className="section-label">Demo progression</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.045em] text-white">
            Scenario-ready UI
          </h2>
          <ol className="mt-5 space-y-3 font-mono text-[10px] uppercase tracking-[.09em] text-[#a8b2ae]">
            <li className="flex gap-3">
              <span className="text-[#d8ff3e]">01</span>
              Play day simulation
            </li>
            <li className="flex gap-3">
              <span className="text-[#d8ff3e]">02</span>
              Watch panel track sun
            </li>
            <li className="flex gap-3">
              <span className="text-[#d8ff3e]">03</span>
              Generation rises at noon
            </li>
            <li className="flex gap-3">
              <span className="text-[#d8ff3e]">04</span>
              Night → safe idle
            </li>
          </ol>
        </article>
      </section>
    </div>
  );
}
