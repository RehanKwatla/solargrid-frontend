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
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="mb-3">
        <span className="pill pill-muted !text-[0.6rem]">TELEMETRY · TRACKER-01</span>
      </div>

      <dl className="flex-1 flex flex-col gap-0 w-full min-w-0">
        {rows.map(({ label, key, unit, highlight, isStatus }, i) => {
          const value = simulation[key];
          const shouldAccent = highlight || isStatus;
          return (
            <div key={key} className={cn("telemetry-row py-2", i < rows.length - 1 && "border-b border-border/50")}>
              <dt className="label !text-[0.78rem]">{label}</dt>
              <dd className={cn("value !text-[0.84rem]", shouldAccent && "accent")}>
                {value}
                {unit && <span className="unit">{unit}</span>}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
