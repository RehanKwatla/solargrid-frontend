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
    <div className="w-full h-full min-h-[400px] flex flex-col relative">
      <div className="absolute inset-0 bg-surface rounded-xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* 3D Viewport */}
        <div className="relative flex-1 bg-gradient-to-b from-surface to-surface-soft min-h-[300px]">
          <SolarTracking3D />
          
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/20">
              ● LIVE FEED
            </span>
            <span className="inline-flex items-center rounded-lg bg-surface/80 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-foreground border border-border shadow-sm">
              {simulation.solarGenerationKw} kW
            </span>
          </div>
          
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-surface/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-text-secondary border border-border">
              {assets.pv01.id}
            </span>
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold border", isActive ? "bg-accent/10 text-accent border-accent/20" : "bg-surface/80 backdrop-blur-sm text-text-secondary border-border")}>
              {isActive ? "Tracking Active" : simulation.trackingStatus}
            </span>
          </div>
        </div>
        
        {/* Stats Panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border bg-surface p-5 flex flex-col justify-between shrink-0 z-10">
          <SolarTrackingStats />
          <div className="mt-6 pt-6 border-t border-border">
            <SolarTrackingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
