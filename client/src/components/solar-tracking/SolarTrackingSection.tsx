import { assets } from "@/data/mockData";
import { SolarTracking3D } from "./SolarTracking3D";
import { SolarTrackingControls } from "./SolarTrackingControls";
import { SolarTrackingStats } from "./SolarTrackingStats";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { cn } from "@/lib/utils";

export function SolarTrackingSection() {
  const { simulation } = useSolarTracking();
  const isActive = simulation.trackingStatus === "ACTIVE";

  return (
    <div className="w-full min-w-0 min-h-[400px] flex flex-col border border-border bg-surface rounded-lg overflow-hidden">
      <div className="grid h-full w-full min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        
        {/* 3D Viewport */}
        <div className="relative w-full min-w-0 min-h-[300px] bg-[#a8c8d8] dark:bg-[#1a2e1c]">
          <SolarTracking3D />
          
          {/* Left overlay — generation + status */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <span className="inline-flex items-center border border-[var(--accent-soft)] bg-surface/90 backdrop-blur-sm px-2 py-1 font-mono text-[9px] font-medium tracking-[.08em] text-foreground">
              LIVE POSITION
            </span>
            <span className="inline-flex items-center border border-[var(--accent-soft)] bg-surface/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-foreground">
              {simulation.solarGenerationKw} kW
            </span>
          </div>
          
          {/* Right overlay — asset + tracking status */}
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <span className="inline-flex items-center border border-[var(--border-color)] bg-surface/90 backdrop-blur-sm px-2 py-1 font-mono text-[9px] font-medium text-text-secondary">
              {assets.pv01.id}
            </span>
            <span className={cn(
              "inline-flex items-center border px-2 py-1 font-mono text-[9px] font-medium",
              isActive 
                ? "border-[var(--healthy-ring)] bg-[var(--healthy-bg)] text-[var(--healthy)]" 
                : "border-[var(--border-color)] bg-surface/90 text-text-secondary"
            )}>
              {isActive ? "Tracking Active" : simulation.trackingStatus}
            </span>
          </div>
        </div>
        
        {/* Stats Panel */}
        <div className="w-full min-w-0 border-t xl:border-t-0 xl:border-l border-border bg-surface p-4 sm:p-5 flex flex-col justify-between">
          <SolarTrackingStats />
          <div className="mt-6 pt-6 border-t border-border">
            <SolarTrackingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
