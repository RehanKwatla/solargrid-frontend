import { Link } from "wouter";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { operatingState, alerts, optimizationDecision, facility, assets } from "@/data/mockData";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { ModeIndicator } from "@/components/dashboard/ModeIndicator";
import { EnergyMetrics } from "@/components/dashboard/EnergyMetrics";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { EventStream } from "@/components/alerts/EventStream";
import { ArrowUpRight } from "lucide-react";

export default function Overview() {
  const { formattedTime } = useSolarTracking();
  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8">
      {/* HEADER — Facility + Mode */}
      <section className="grid w-full min-w-0 border-b border-border pb-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,.85fr)] lg:gap-12">
        <div className="datum-rule pt-5 min-w-0">
          <p className="instrument-label">{facility.code} · {facility.location} field</p>
          <h1 className="heading-xl mt-3 text-foreground">{facility.name}</h1>
          <p className="mt-3 flex items-center gap-2.5 text-[0.84rem] text-text-secondary leading-relaxed">
            <span className="status-dot healthy pulse" />
            Local production online · reporting at {formattedTime}
            <span className="hidden sm:inline"> — Solar covers critical demand while BESS absorbs surplus</span>
          </p>
        </div>
        <div className="mt-8 min-w-0 border-border pt-1 lg:mt-0 lg:border-l lg:pl-10">
          <p className="instrument-label mb-3">Operating state</p>
          <ModeIndicator mode={operatingState.mode} detail={operatingState.modeDetail} />
        </div>
      </section>

      {/* POWER DIAGRAM + TRACKER */}
      <section className="grid w-full min-w-0 border-b border-border lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-0">
        <div className="py-8 pr-0 min-w-0 lg:py-10 lg:pr-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="instrument-label mb-2">Live system diagram</p>
              <h2 className="heading-md">Where the power is going</h2>
            </div>
            <span className="pill pill-muted shrink-0">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--healthy)] mr-1" />
              LOCAL BUS · LIVE
            </span>
          </div>
          <PowerFlow />
        </div>
        <div className="border-t border-border py-8 min-w-0 lg:py-10 lg:border-l lg:border-t-0 lg:pl-10">
          <p className="instrument-label mb-2">Tracker {assets.pv01.trackerId}</p>
          <h2 className="heading-md mb-5">Panel movement &amp; sun position</h2>
          <SolarTrackingSection />
        </div>
      </section>

      {/* ENERGY READOUT + DISPATCH RECOMMENDATION */}
      <section className="grid w-full min-w-0 border-b border-border lg:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] gap-0">
        <div className="py-8 pr-0 min-w-0 lg:py-10 lg:pr-10">
          <div className="mb-6">
            <p className="instrument-label mb-2">Today</p>
            <h2 className="heading-md">Energy readout</h2>
          </div>
          <EnergyMetrics />
        </div>
        <aside className="datum-rule border-t border-border py-8 min-w-0 lg:py-10 lg:border-l lg:border-t-0 lg:pl-10">
          <p className="instrument-label mb-4">Suggested dispatch</p>
          <p className="heading-lg tracking-[-0.03em] text-foreground">{optimizationDecision.action}</p>
          <p className="mt-4 text-[0.85rem] leading-[1.6] text-text-secondary">
            {optimizationDecision.reason}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {optimizationDecision.expectedEffect.slice(0, 2).map((effect) => (
              <div key={effect.label} className="rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-xs)]">
                <p className="font-mono text-[0.62rem] font-medium tracking-[0.06em] uppercase text-text-secondary">
                  {effect.label}
                </p>
                <p className="mt-1 text-[0.9rem] font-semibold tabular-nums text-foreground">
                  {effect.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-border pt-3 gap-3">
            <span className="pill pill-muted shrink-0">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--warning)] mr-1.5" />
              STAGED
            </span>
            <span className="font-mono text-[0.62rem] font-medium tracking-[0.06em] text-text-secondary truncate">
              RECOMMENDATION · NOT APPLIED
            </span>
          </div>
        </aside>
      </section>

      {/* TIMELINE + EVENT LOG */}
      <section className="grid w-full min-w-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0">
        <div className="py-8 pr-0 min-w-0 lg:py-10 lg:pr-10">
          <div className="mb-6">
            <p className="instrument-label mb-2">Daylight window</p>
            <h2 className="heading-md">Today&apos;s sequence</h2>
          </div>
          <DayTimeline />
        </div>
        <div className="border-t border-border py-8 min-w-0 lg:py-10 lg:border-l lg:border-t-0 lg:pl-10">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="instrument-label mb-2">Attention log</p>
              <h2 className="heading-md">Recent events</h2>
            </div>
            <Link href="/alerts" className="group inline-flex items-center gap-1 text-[0.8rem] font-semibold text-primary hover:text-[var(--accent-strong)] transition-colors shrink-0">
              Open log
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <EventStream items={alerts} limit={4} />
        </div>
      </section>
    </div>
  );
}

