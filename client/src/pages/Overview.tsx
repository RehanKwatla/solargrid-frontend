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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header & Primary Status - Asymmetric Split */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* Main Facility Block */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary mb-4">
              {facility.location}
            </div>
            <h1 className="heading-xl text-foreground">
              {facility.name}
            </h1>
            <div className="flex items-center gap-2 mt-4 text-sm font-medium text-text-secondary">
              <span className="flex items-center gap-1.5 text-success">
                <span className="status-dot healthy pulse"></span>
                System Self-Powered
              </span>
              <span className="text-border mx-2">•</span>
              <span>{formattedTime} Local</span>
            </div>
          </div>
        </div>

        {/* Operating State Block */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 flex flex-col justify-center">
           <h2 className="text-lg font-semibold text-foreground mb-4">
             System State
           </h2>
           <ModeIndicator mode={operatingState.mode} detail={operatingState.modeDetail} />
        </div>
      </div>

      {/* 2. Energy Flow & Tracker - Asymmetric Split */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        
        {/* Power Flow Block */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
           <div className="mb-6">
             <h2 className="heading-md text-foreground">
               Live Power Flow
             </h2>
             <p className="text-sm text-text-secondary mt-1">Real-time energy distribution</p>
           </div>
           <PowerFlow />
        </div>

        {/* Solar Tracker Block */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
           <div className="mb-6">
             <h2 className="heading-md text-foreground">
               Solar Tracker
             </h2>
             <p className="text-sm text-text-secondary mt-1">Live 3D array positioning</p>
           </div>
           <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border">
             <SolarTrackingSection />
           </div>
        </div>
      </div>

      {/* 3. Secondary Metrics - 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metrics */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface shadow-sm p-6">
           <h2 className="text-lg font-semibold text-foreground mb-6">
             Energy Metrics
           </h2>
           <EnergyMetrics />
        </div>

        {/* Dispatch Decision */}
        <div className="rounded-2xl border border-transparent bg-primary text-primary-foreground shadow-md p-6 flex flex-col justify-between">
           <div>
             <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
               Dispatch Decision
             </div>
             <h2 className="text-3xl font-bold tracking-tight mt-2">
               {optimizationDecision.action}
             </h2>
             <p className="text-sm font-medium mt-4 opacity-90">
               {optimizationDecision.reason}
             </p>
           </div>
        </div>
      </div>

      {/* 4. Timeline & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
           <h2 className="text-lg font-semibold text-foreground mb-6">
             Energy Timeline
           </h2>
           <DayTimeline />
        </div>

        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-semibold text-foreground">
               Recent Events
             </h2>
             <Link href="/alerts" className="text-sm font-medium text-primary hover:underline">
               View All
             </Link>
           </div>
           <EventStream items={alerts} limit={4} />
        </div>
      </div>

    </div>
  );
}
