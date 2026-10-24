import { useState } from "react";
import { Link } from "wouter";
import { CinematicReferenceDashboard } from "@/components/dashboard/CinematicReferenceDashboard";
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
  ChevronDown,
  ChevronUp,
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

  const [showDrilldown, setShowDrilldown] = useState(false);
  const [timeRange, setTimeRange] = useState<"today" | "24h" | "7d">("today");

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · India";
  const facilityName = facility?.name ?? "Apollo Care Campus";

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* 1. CINEMATIC REFERENCE-INSPIRED CONTROL DASHBOARD (Primary Master View) */}
      <section>
        <CinematicReferenceDashboard />
      </section>

      {/* 2. TECHNICAL DRILLDOWN ACCORDION FOR EVALUATION JUDGES */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={() => setShowDrilldown((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-surface-soft text-left transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-soft border border-border flex items-center justify-center text-primary">
              <Shield size={16} />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Hospital Engineering & Battery Rack Drilldown
              </span>
              <span className="block text-[11px] text-text-secondary">
                10-segment modular LFP rack, 35% NABH ICU floor lock, cell delta-V balance & circuit dispatch
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary font-mono">
            <span>{showDrilldown ? "Collapse" : "Expand Details"}</span>
            {showDrilldown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showDrilldown && (
          <div className="mt-5 space-y-8 animate-in fade-in duration-300">
            {/* System Status Header */}
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
                </div>

                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="heading-xl text-foreground">{facilityName} Technical Specs</h2>
                  <Link
                    href="/intro"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:underline shrink-0"
                    title="Open Three.js 3D Solar Tracker"
                  >
                    <Compass size={14} />
                    <span>Launch 3D Digital Twin</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
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

            {/* Modular Battery Rack */}
            <section>
              <BatteryManagementPanel />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

