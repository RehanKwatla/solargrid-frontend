import { Link } from "wouter";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { operatingState, alerts, optimizationDecision, facility } from "@/data/mockData";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { ModeIndicator } from "@/components/dashboard/ModeIndicator";
import { EnergyMetrics } from "@/components/dashboard/EnergyMetrics";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { ImpactMetrics } from "@/components/dashboard/ImpactMetrics";
import { EventStream } from "@/components/alerts/EventStream";

export default function Overview() {
  const { formattedTime } = useSolarTracking();

  return (
    <div className="dashboard-canvas px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
      {/* 1. Facility header */}
      <header>
        <p className="facility-location">
          {facility.location} · {formattedTime} local
        </p>
        <h1 className="facility-name mt-1">{facility.name}</h1>
      </header>

      {/* 2. Current operating state */}
      <section className="mt-6">
        <ModeIndicator mode={operatingState.mode} detail={operatingState.modeDetail} />
      </section>

      <div className="section-divider mt-2" />

      {/* 3. LIVE POWER FLOW — hero */}
      <section className="mt-8">
        <PowerFlow />
      </section>

      <div className="section-divider mt-8" />

      {/* 4. 3D solar tracker */}
      <section className="mt-8">
        <SolarTrackingSection />
      </section>

      <div className="section-divider mt-8" />

      {/* 5. Key energy metrics — hierarchical */}
      <section className="mt-8">
        <EnergyMetrics />
      </section>

      {/* 6. Dispatch decision + forecast */}
      <section className="mt-10 grid gap-10 xl:grid-cols-[1fr_1fr]">
        <div className="dispatch-card">
          <p className="asset-id asset-id-active">Dispatch decision</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#e7ece9]">
            {optimizationDecision.action}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8a9692]">
            {optimizationDecision.reason}
          </p>
          <div className="mt-5 flex flex-wrap gap-6">
            {optimizationDecision.expectedEffect.map((effect) => (
              <div key={effect.label}>
                <p className="asset-id">{effect.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-[#c8e64a]">{effect.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="asset-id">Day cycle</p>
          <h2 className="section-heading mt-1">Energy timeline</h2>
          <div className="mt-4">
            <DayTimeline />
          </div>
        </div>
      </section>

      <div className="section-divider mt-10" />

      {/* 7. Impact metrics */}
      <section className="mt-8">
        <ImpactMetrics />
      </section>

      <div className="section-divider mt-8" />

      {/* 8. Recent events */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="asset-id">System events</p>
            <h2 className="section-heading mt-1">Recent activity</h2>
          </div>
          <Link
            href="/alerts"
            className="text-xs text-[#8a9692] transition hover:text-[#c8e64a]"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4">
          <EventStream items={alerts} limit={4} />
        </div>
      </section>
    </div>
  );
}
