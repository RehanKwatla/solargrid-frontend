import { useState } from "react";
import { Link } from "wouter";
import { PowerFlow } from "@/components/power-flow/PowerFlow";
import { SolarTrackingSection } from "@/components/solar-tracking/SolarTrackingSection";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { ModeIndicator } from "@/components/dashboard/ModeIndicator";
import { EnergyMetrics } from "@/components/dashboard/EnergyMetrics";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { EventStream } from "@/components/alerts/EventStream";
import { BatteryManagementPanel } from "@/components/dashboard/BatteryManagementPanel";
import {
  DataLoadingBlock,
  DataError,
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
} from "@/components/common/DataState";
import {
  Activity,
  ArrowUpRight,
  BatteryCharging,
  Compass,
  HelpCircle,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

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
  } = useDashboardData();

  const [timeRange, setTimeRange] = useState<"today" | "24h" | "7d">("today");

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · India";
  const facilityName = facility?.name ?? "Apollo Care Campus";

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8 space-y-8">
      {/* 1. SYSTEM STATUS HEADER (Section 4.A) */}
      <section className="grid w-full min-w-0 border-b border-border pb-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,.85fr)] lg:gap-12">
        <div className="datum-rule pt-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
                {facilityCode} · {facilityLocation}
              </span>
              <DataSourceBadge source={facilityStatus.kind} />
              <span className="pill pill-healthy !text-[9px] !py-0.5">Clinical EMS Priority</span>
            </div>

            {/* Time range selector */}
            <div className="flex items-center gap-1 bg-surface border border-border p-0.5 rounded-lg">
              {(["today", "24h", "7d"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 font-mono text-[10px] rounded transition-colors ${
                    timeRange === r
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-text-tertiary hover:text-foreground"
                  }`}
                >
                  {r === "today" ? "Today (Live)" : r === "24h" ? "24h Shift" : "7-Day"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="heading-xl text-foreground">{facilityName}</h1>
            <Link
              href="/intro"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:underline shrink-0"
              title="Open Three.js 3D Solar Tracker"
            >
              <Compass size={14} />
              <span>Launch 3D Digital Twin</span>
            </Link>
          </div>

          <p className="mt-2 flex items-center gap-2.5 text-[0.84rem] text-text-secondary leading-relaxed">
            <span className="status-dot healthy pulse" />
            {telemetryStatus.kind === "live"
              ? "Live from backend bus"
              : telemetryStatus.kind === "mock"
              ? "Deterministic simulation feed"
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

        {/* Operating State Badge */}
        <div className="mt-6 min-w-0 border-border pt-1 lg:mt-0 lg:border-l lg:pl-10">
          <p className="instrument-label mb-2">Hospital Operating State</p>
          {modeStatus.kind === "unavailable" ? (
            <DataEmpty label="No operating mode" detail="Operating mode data is not yet available in the backend." />
          ) : (
            <ModeIndicator
              mode={operatingMode?.mode ?? "Self-Powered"}
              detail={operatingMode?.mode_detail ?? "100% solar supply covering facility demand with BESS reserve buffer"}
            />
          )}
        </div>
      </section>

      {/* 2. ENERGY KPI PANELS (Section 4.B) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="instrument-label">Energy KPI Panels · Current Distribution</p>
          <span className="font-mono text-[10px] text-text-tertiary">MERC Tariff D-2 Institutional</span>
        </div>
        <EnergyMetrics />
      </section>

      {/* 3. BATTERY AUTONOMY PANEL (Section 4.D requirement) */}
      <section>
        <BatteryManagementPanel />
      </section>

      {/* 4. LIVE SYSTEM DIAGRAM + TRACKER SIMULATION (Section 4.E) */}
      <section className="grid w-full min-w-0 border-t border-b border-border lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] gap-0">
        <div className="py-8 pr-0 min-w-0 lg:py-10 lg:pr-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="instrument-label mb-1">Live Power Flow</p>
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
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="instrument-label mb-1">Dual-Axis Tracking PV-01</p>
              <h2 className="heading-md">Sun Position &amp; Elevation</h2>
            </div>
            <span className="font-mono text-xs font-bold text-primary">+28.4% Yield</span>
          </div>
          <SolarTrackingSection />
        </div>
      </section>

      {/* 5. EXPLAINABLE OPTIMIZATION & DISPATCH (Section 4.F) */}
      <section className="card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-primary">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-sans text-lg font-bold text-foreground">
                Explainable Dispatch Decision Engine
              </h2>
              <p className="text-xs text-text-secondary">
                Autonomous supervisory decision logic driven by tariff forecasts and ICU life-safety constraints
              </p>
            </div>
          </div>

          <span className="pill pill-warning shrink-0">
            {optimization?.status?.toUpperCase() ?? "STAGED RECOMMENDATION"}
          </span>
        </div>

        {/* 3 Core Questions Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Question 1 */}
          <div className="p-4 rounded-xl border border-border bg-surface-soft/40 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
              <Activity size={13} className="text-primary" />
              1. What is the system doing?
            </span>
            <p className="font-sans text-sm font-bold text-foreground">
              {optimization?.action ?? "Self-Powering Hospital + BESS Trickle Reserve"}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Routing 38.4 kW solar directly to hospital ICU and wards while buffering 4.4 kW into battery storage.
            </p>
          </div>

          {/* Question 2 */}
          <div className="p-4 rounded-xl border border-border bg-surface-soft/40 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
              <TrendingUp size={13} className="text-primary" />
              2. What should it do next?
            </span>
            <p className="font-sans text-sm font-bold text-foreground">
              Pre-Charge Prior to 17:00 Sunset
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Maintain minimum 80% SOC before dusk to bridge the high-tariff evening peak window (₹9.50/kWh).
            </p>
          </div>

          {/* Question 3 */}
          <div className="p-4 rounded-xl border border-border bg-surface-soft/40 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
              <Shield size={13} className="text-[var(--healthy)]" />
              3. Why is this decision better?
            </span>
            <p className="font-sans text-sm font-bold text-foreground">
              Cost Shaving + Guaranteed ICU Protection
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {optimization?.reason ?? "Avoids peak utility charges while preserving 35% reserve floor strictly for life-support ventilators."}
            </p>
          </div>
        </div>

        {/* Expected Effects Chips */}
        {optimization?.expected_effects && optimization.expected_effects.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              Projected Impact:
            </span>
            {optimization.expected_effects.map((effect) => (
              <div
                key={effect.label}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs shadow-xs"
              >
                <span className="font-mono text-[10px] uppercase text-text-secondary font-semibold">
                  {effect.label}:
                </span>
                <span className="font-sans font-bold text-foreground tabular-nums">
                  {effect.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. DAYLIGHT TIMELINE & ATTENTION LOG (Section 4.G) */}
      <section className="grid w-full min-w-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] gap-8 border-t border-border pt-8">
        <div className="min-w-0">
          <div className="mb-5">
            <p className="instrument-label mb-1">Daylight Window</p>
            <h2 className="heading-md">Today&apos;s Generation Sequence</h2>
          </div>
          <DayTimeline />
        </div>

        <div className="min-w-0 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="instrument-label mb-1">Attention Log</p>
              <h2 className="heading-md">Recent System Events</h2>
            </div>
            <Link
              href="/alerts"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-colors shrink-0"
            >
              Open Log
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
