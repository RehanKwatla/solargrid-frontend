import { Link } from "wouter";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { ModeIndicator } from "@/components/dashboard/ModeIndicator";
import { EnergyMetrics } from "@/components/dashboard/EnergyMetrics";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { EventStream } from "@/components/alerts/EventStream";
import {
  DataLoadingBlock,
  DataError,
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
} from "@/components/common/DataState";
import { ArrowUpRight } from "lucide-react";

export default function Overview() {
  const {
    facility,
    operatingMode,
    optimization,
    alerts,
    telemetryStatus,
    modeStatus,
    optimizationStatus,
    alertsStatus,
    facilityStatus,
    anyError,
  } = useDashboardData();

  const facilityCode = facility?.code ?? "—";
  const facilityLocation = facility?.location ?? "—";
  const facilityName = facility?.name ?? "Facility";

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8">
      {/* HEADER — Facility + Mode */}
      <section className="grid w-full min-w-0 border-b border-border pb-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,.85fr)] lg:gap-12">
        <div className="datum-rule pt-5 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="instrument-label">
              {facilityCode} · {facilityLocation} field
            </p>
            <DataSourceBadge source={facilityStatus.kind} />
          </div>
          <h1 className="heading-xl mt-3 text-foreground">{facilityName}</h1>
          <p className="mt-3 flex items-center gap-2.5 text-[0.84rem] text-text-secondary leading-relaxed">
            <span className="status-dot healthy pulse" />
            {telemetryStatus.kind === "live"
              ? "Live from backend"
              : telemetryStatus.kind === "mock"
                ? "Simulated telemetry"
                : "Data unavailable"}
            {telemetryStatus.lastUpdated && (
              <>
                {" · "}
                <LastUpdated timestamp={telemetryStatus.lastUpdated} source={telemetryStatus.kind} />
              </>
            )}
            <span className="hidden sm:inline">
              {" — "}
              {operatingMode?.mode_detail ?? "Awaiting operating state"}
            </span>
          </p>
        </div>
        <div className="mt-8 min-w-0 border-border pt-1 lg:mt-0 lg:border-l lg:pl-10">
          <p className="instrument-label mb-3">Operating state</p>
          {modeStatus.kind === "unavailable" ? (
            <DataEmpty label="No operating mode" detail="Operating mode data is not yet available in the backend." />
          ) : (
            <ModeIndicator
              mode={operatingMode?.mode ?? "Self-Powered"}
              detail={operatingMode?.mode_detail ?? "Awaiting mode detail"}
            />
          )}
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
              {telemetryStatus.kind === "live" ? "LOCAL BUS · LIVE" : "LOCAL BUS · SIMULATED"}
            </span>
          </div>
          <PowerFlow />
        </div>
        <div className="border-t border-border py-8 min-w-0 lg:py-10 lg:border-l lg:border-t-0 lg:pl-10">
          <p className="instrument-label mb-2">Tracker {facility?.code ? "TRACKER-01" : "—"}</p>
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
          {optimizationStatus.kind === "unavailable" ? (
            <DataEmpty
              label="No optimization data"
              detail="Optimization recommendations are not yet available from the backend."
            />
          ) : (
            <>
              <p className="heading-lg tracking-[-0.03em] text-foreground">
                {optimization?.action ?? "—"}
              </p>
              <p className="mt-4 text-[0.85rem] leading-[1.6] text-text-secondary">
                {optimization?.reason ?? "Awaiting optimization reason"}
              </p>
              {optimization?.expected_effects && optimization.expected_effects.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {optimization.expected_effects.slice(0, 2).map((effect) => (
                    <div
                      key={effect.label}
                      className="rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-xs)]"
                    >
                      <p className="font-mono text-[0.62rem] font-medium tracking-[0.06em] uppercase text-text-secondary">
                        {effect.label}
                      </p>
                      <p className="mt-1 text-[0.9rem] font-semibold tabular-nums text-foreground">
                        {effect.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-7 flex items-center justify-between border-t border-border pt-3 gap-3">
                <span className="pill pill-muted shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--warning)] mr-1.5" />
                  {optimization?.status?.toUpperCase() ?? "STAGED"}
                </span>
                <span className="font-mono text-[0.62rem] font-medium tracking-[0.06em] text-text-secondary truncate">
                  RECOMMENDATION · NOT APPLIED
                </span>
              </div>
            </>
          )}
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
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="instrument-label mb-2">Attention log</p>
              <h2 className="heading-md">Recent events</h2>
            </div>
            <Link
              href="/alerts"
              className="group inline-flex items-center gap-1 text-[0.8rem] font-semibold text-primary hover:text-[var(--accent-strong)] transition-colors shrink-0"
            >
              Open log
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          {alertsStatus.kind === "unavailable" ? (
            <DataEmpty
              label="No events loaded"
              detail="Alert data is not yet available from the backend."
            />
          ) : (
            <EventStream items={alerts} limit={4} />
          )}
        </div>
      </section>
    </div>
  );
}
