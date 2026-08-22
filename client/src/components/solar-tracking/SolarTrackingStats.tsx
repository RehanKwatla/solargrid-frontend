import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { cn } from "@/lib/utils";

const rows: Array<{
  label: string;
  key: keyof import("@/lib/solarSimulation").SolarSimulationState;
  unit: string;
  highlight?: boolean;
  isStatus?: boolean;
}> = [
  { label: "Tracking", key: "trackingStatus", unit: "", isStatus: true },
  { label: "Sun azimuth", key: "sunAzimuth", unit: "°" },
  { label: "Sun altitude", key: "sunAltitude", unit: "°" },
  { label: "Panel azimuth", key: "panelAzimuth", unit: "°" },
  { label: "Panel tilt", key: "panelTilt", unit: "°" },
  { label: "Alignment", key: "alignment", unit: "%" },
  { label: "Generation", key: "solarGenerationKw", unit: "kW", highlight: true },
];

export function SolarTrackingStats() {
  const { simulation } = useSolarTracking();

  return (
    <div className="flex h-full flex-col">
      <p className="asset-id">Telemetry</p>

      <dl className="mt-4 flex-1 space-y-0">
        {rows.map(({ label, key, unit, highlight, isStatus }) => {
          const value = simulation[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-white/[.05] py-3 last:border-0"
            >
              <dt className="text-sm text-[#8a9692]">{label}</dt>
              <dd
                className={cn(
                  "font-mono text-sm tabular-nums",
                  highlight || isStatus ? "text-[#c8e64a]" : "text-[#e7ece9]"
                )}
              >
                {value}
                {unit && (
                  <span className="ml-0.5 text-[10px] text-[#6d7874]">{unit}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
