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
    <section className="open-section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="asset-id">{assets.tracker01.id}</p>
          <h2 className="section-heading mt-1">{assets.tracker01.label}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="asset-id">{assets.pv01.id}</span>
          <span className={cn("system-online", isActive && "text-[#a8c44a]")}>
            {isActive ? "Tracking active" : simulation.trackingStatus}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(240px,.35fr)]">
        <div className="relative overflow-hidden rounded-lg border border-white/[.06] bg-[#0a0e0f]">
          <SolarTracking3D />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="asset-id asset-id-active">Live</span>
            <span className="font-mono text-[11px] text-[#8a9692]">
              {simulation.solarGenerationKw} kW
            </span>
          </div>
        </div>
        <SolarTrackingStats />
      </div>

      <div className="mt-5 border-t border-white/[.06] pt-5">
        <SolarTrackingControls />
      </div>
    </section>
  );
}
