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
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Telemetry
      </h3>

      <dl className="flex-1 flex flex-col justify-center space-y-4">
        {rows.map(({ label, key, unit, highlight, isStatus }) => {
          const value = simulation[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between"
            >
              <dt className="text-sm font-medium text-text-secondary">{label}</dt>
              <dd
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  highlight || isStatus ? "text-accent" : "text-foreground"
                )}
              >
                {value}
                {unit && (
                  <span className="ml-0.5 text-text-secondary font-medium">{unit}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
