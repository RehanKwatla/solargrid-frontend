import { BatteryCharging, Hospital, RadioTower, ShieldCheck, SunMedium, Zap } from "lucide-react";
import { operatingState } from "@/data/mockData";
import { StatusPill } from "@/components/common/StatusPill";
import { useTelemetry } from "@/contexts/SolarTrackingContext";

/** Grid Atlas: a state-ready power diagram tells the normal, high-demand, outage, and recovery demo story. */
const node =
  "relative z-10 flex min-h-[112px] flex-col justify-between rounded-[1rem_1rem_2rem_1rem] border border-white/[0.1] bg-[#12191a] p-4 shadow-[0_12px_24px_rgba(0,0,0,.18)]";

export function PowerFlow() {
  const t = useTelemetry();

  return (
    <section className="operational-panel overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">Power flow / demo-ready state</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.045em] text-white">
            How energy is protected and allocated
          </h2>
        </div>
        <StatusPill state="healthy">{operatingState.mode}</StatusPill>
      </div>
      <div className="mt-3 rounded-xl border border-[#d8ff3e]/15 bg-[#d8ff3e]/[0.045] px-3 py-2.5 text-sm leading-5 text-[#cfd8d3]">
        {operatingState.modeDetail}
      </div>
      <div className="power-grid relative mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        <article className={node}>
          <div className="flex items-start justify-between">
            <span className="node-icon">
              <SunMedium size={19} />
            </span>
            <span className="square-pip" />
          </div>
          <div>
            <p className="section-label">Solar array</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {t.solarKw}{" "}
              <span className="font-mono text-[11px] text-[#9aa5a0]">kW</span>
            </p>
          </div>
        </article>
        <i className="energy-link energy-link-lime hidden xl:block" />
        <article className={node}>
          <div className="flex items-start justify-between">
            <span className="node-icon">
              <Zap size={19} />
            </span>
            <span className="font-mono text-[9px] uppercase text-[#d8ff3e]">EMS</span>
          </div>
          <div>
            <p className="section-label">Energy manager</p>
            <p className="mt-1 text-base font-medium text-white">Allocating</p>
          </div>
        </article>
        <i className="energy-link energy-link-lime hidden xl:block" />
        <article className={node}>
          <div className="flex items-start justify-between">
            <span className="node-icon">
              <BatteryCharging size={19} />
            </span>
            <span className="font-mono text-[9px] text-[#d8ff3e]">{t.batterySoc}%</span>
          </div>
          <div>
            <p className="section-label">Battery</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {t.batteryKw > 0 ? "+" : ""}
              {t.batteryKw}{" "}
              <span className="font-mono text-[11px] text-[#9aa5a0]">kW</span>
            </p>
          </div>
        </article>
        <i className="energy-link energy-link-amber hidden xl:block" />
        <article className={node}>
          <div className="flex items-start justify-between">
            <span className="node-icon node-icon-amber">
              <RadioTower size={19} />
            </span>
            <span className="font-mono text-[9px] text-[#f1bf70]">ONLINE</span>
          </div>
          <div>
            <p className="section-label">Grid</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {t.gridKw}{" "}
              <span className="font-mono text-[11px] text-[#9aa5a0]">kW</span>
            </p>
          </div>
        </article>
        <i className="energy-link energy-link-lime hidden xl:block" />
        <article className={node}>
          <div className="flex items-start justify-between">
            <span className="node-icon">
              <Hospital size={19} />
            </span>
            <ShieldCheck size={16} className="text-[#d8ff3e]" />
          </div>
          <div>
            <p className="section-label">Critical loads</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {t.criticalLoadKw}{" "}
              <span className="font-mono text-[11px] text-[#9aa5a0]">kW</span>
            </p>
          </div>
        </article>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-white/[0.025] px-3.5 py-3">
          <span className="flex items-center gap-2 text-sm text-[#cfd7d3]">
            <i className="h-2 w-2 bg-[#d8ff3e]" />
            Tier 2 important loads
          </span>
          <span className="font-mono text-xs text-white">{t.tier2LoadKw} kW</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-white/[0.025] px-3.5 py-3">
          <span className="flex items-center gap-2 text-sm text-[#cfd7d3]">
            <i className="h-2 w-2 bg-[#78827f]" />
            Tier 3 deferrable loads
          </span>
          <span className="font-mono text-xs text-white">{t.tier3LoadKw} kW</span>
        </div>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.09em] text-[#7f8986]">
        Solar kW driven by 3D tracking simulation. Service layer can drive other modes later.
      </p>
    </section>
  );
}
