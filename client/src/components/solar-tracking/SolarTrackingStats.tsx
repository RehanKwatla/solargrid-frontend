import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { StatusPill } from "@/components/common/StatusPill";
import { cn } from "@/lib/utils";

const rows = [
  { label: "Sun azimuth", key: "sunAzimuth", unit: "°" },
  { label: "Sun altitude", key: "sunAltitude", unit: "°" },
  { label: "Panel azimuth", key: "panelAzimuth", unit: "°" },
  { label: "Panel tilt", key: "panelTilt", unit: "°" },
  { label: "Alignment", key: "alignment", unit: "%" },
  { label: "Solar generation", key: "solarGenerationKw", unit: "kW" },
] as const;

export function SolarTrackingStats() {
  const { simulation } = useSolarTracking();

  const statusState =
    simulation.trackingStatus === "ACTIVE"
      ? "healthy"
      : simulation.trackingStatus === "SAFE"
        ? "neutral"
        : "watch";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-label">Tracking status</p>
          <StatusPill state={statusState} className="mt-2">
            {simulation.trackingStatus}
          </StatusPill>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7d8784]">
          Simulated
        </span>
      </div>

      <dl className="mt-6 flex-1 space-y-3">
        {rows.map(({ label, key, unit }) => {
          const value = simulation[key];
          const highlight = key === "solarGenerationKw" || key === "alignment";
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-white/[.06] pb-3 last:border-0"
            >
              <dt className="text-sm text-[#9aa5a0]">{label}</dt>
              <dd
                className={cn(
                  "font-mono text-sm tabular-nums",
                  highlight ? "text-[#d8ff3e]" : "text-white"
                )}
              >
                {value}
                {unit && (
                  <span className="ml-1 text-[10px] text-[#7d8784]">{unit}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 text-xs leading-5 text-[#7d8784]">
        Panel orientation follows simulated sun position. Generation scales with alignment and
        altitude — demo values only.
      </p>
    </div>
  );
}
