import { Link } from "wouter";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { operatingState, alerts, optimizationDecision, facility } from "@/data/mockData";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { ModeIndicator } from "@/components/dashboard/ModeIndicator";
import { EnergyMetrics } from "@/components/dashboard/EnergyMetrics";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { EventStream } from "@/components/alerts/EventStream";

export default function Overview() {
  const { formattedTime } = useSolarTracking();
  return <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
    <section className="grid border-b border-border pb-7 lg:grid-cols-[1.6fr_.8fr] lg:gap-10">
      <div className="datum-rule pt-5"><p className="instrument-label">{facility.location} · field station</p><h1 className="heading-xl mt-4 text-foreground">{facility.name}</h1><p className="mt-4 flex items-center gap-2 text-sm text-text-secondary"><span className="status-dot healthy pulse" />Producing locally at {formattedTime}.</p></div>
      <div className="mt-7 border-border pt-1 lg:mt-0 lg:border-l lg:pl-8"><p className="instrument-label mb-4">Operating state</p><ModeIndicator mode={operatingState.mode} detail={operatingState.modeDetail} /></div>
    </section>
    <section className="grid border-b border-border lg:grid-cols-[1.12fr_.88fr]">
      <div className="py-8 pr-0 lg:pr-10"><div className="mb-6 flex items-end justify-between"><div><p className="instrument-label mb-2">Live system diagram</p><h2 className="heading-md">Where the power is going</h2></div><span className="hidden font-mono text-xs text-text-secondary sm:block">LOCAL BUS · LIVE</span></div><PowerFlow /></div>
      <div className="border-t border-border py-8 lg:border-l lg:border-t-0 lg:pl-10"><p className="instrument-label mb-2">Tracker 01</p><h2 className="heading-md mb-5">Panel movement &amp; sun position</h2><SolarTrackingSection /></div>
    </section>
    <section className="grid border-b border-border lg:grid-cols-[1.45fr_.55fr]">
      <div className="py-8 pr-0 lg:pr-10"><div className="mb-6"><p className="instrument-label mb-2">Today</p><h2 className="heading-md">Energy readout</h2></div><EnergyMetrics /></div>
      <aside className="datum-rule border-t border-border py-8 lg:border-l lg:border-t-0 lg:pl-10"><p className="instrument-label mb-4">Suggested dispatch</p><p className="text-3xl font-semibold tracking-[-.04em] text-foreground">{optimizationDecision.action}</p><p className="mt-4 max-w-sm text-sm leading-6 text-text-secondary">{optimizationDecision.reason}</p><p className="mt-7 border-t border-border pt-3 font-mono text-[10px] tracking-[.08em] text-text-secondary">STAGED RECOMMENDATION · NOT APPLIED</p></aside>
    </section>
    <section className="grid lg:grid-cols-[1fr_1fr]"><div className="py-8 pr-0 lg:pr-10"><p className="instrument-label mb-2">Daylight window</p><h2 className="heading-md mb-6">Today&apos;s sequence</h2><DayTimeline /></div><div className="border-t border-border py-8 lg:border-l lg:border-t-0 lg:pl-10"><div className="mb-6 flex items-end justify-between"><div><p className="instrument-label mb-2">Attention log</p><h2 className="heading-md">Recent events</h2></div><Link href="/alerts" className="text-sm font-medium text-primary hover:underline">Open log</Link></div><EventStream items={alerts} limit={4} /></div></section>
  </div>;
}
