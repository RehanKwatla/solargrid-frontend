import { SunMedium } from "lucide-react";
import { SolarTracking3D } from "./SolarTracking3D";
import { SolarTrackingControls } from "./SolarTrackingControls";
import { SolarTrackingStats } from "./SolarTrackingStats";

export function SolarTrackingSection() {
  return (
    <section className="operational-panel overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">Physical layer / demo simulation</p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-[-0.045em] text-white sm:text-2xl">
            <SunMedium size={22} className="text-[#d8ff3e]" />
            3D solar tracking
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#98a39f]">
            Watch the tracker follow the sun across the day — generation feeds the dashboard below.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.6fr)]">
        <SolarTracking3D />
        <SolarTrackingStats />
      </div>

      <div className="mt-5 border-t border-white/[.06] pt-5 lg:hidden">
        <SolarTrackingControls />
      </div>
      <div className="mt-5 hidden border-t border-white/[.06] pt-5 lg:block">
        <SolarTrackingControls />
      </div>
    </section>
  );
}
