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
    <div className="w-full min-h-[400px] flex flex-col border border-border bg-surface">
      <div className="flex h-full flex-col 2xl:flex-row">
        
        {/* 3D Viewport */}
        <div className="relative flex-1 min-h-[300px] bg-[#b9d8e6]">
          <SolarTracking3D />
          
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="inline-flex items-center border border-[#50673d] bg-[#edf2e5]/90 px-2 py-1 font-mono text-[9px] font-medium tracking-[.08em] text-[#3b5229]">
              LIVE POSITION
            </span>
            <span className="inline-flex items-center border border-[#596856] bg-[#edf2e5]/90 px-3 py-1.5 text-sm font-semibold text-[#25311f]">
              {simulation.solarGenerationKw} kW
            </span>
          </div>
          
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="inline-flex items-center border border-[#596856] bg-[#edf2e5]/90 px-2 py-1 font-mono text-[9px] font-medium text-[#364133]">
              {assets.pv01.id}
            </span>
            <span className={cn("inline-flex items-center border px-2 py-1 font-mono text-[9px] font-medium", isActive ? "border-[#50673d] bg-[#dce9bd]/90 text-[#3b5229]" : "border-[#596856] bg-[#edf2e5]/90 text-[#364133]")}>
              {isActive ? "Tracking Active" : simulation.trackingStatus}
            </span>
          </div>
        </div>
        
        {/* Stats Panel */}
        <div className="2xl:w-72 border-t 2xl:border-t-0 2xl:border-l border-border bg-surface p-5 flex flex-col justify-between shrink-0">
          <SolarTrackingStats />
          <div className="mt-6 pt-6 border-t border-border">
            <SolarTrackingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
