import { Pause, Play, RotateCcw } from "lucide-react";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { SIMULATION, type TimePreset } from "@/lib/solarSimulation";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PRESETS: { id: TimePreset; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "noon", label: "Noon" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Night" },
];

export function SolarTrackingControls() {
  const { simulation, formattedTime, setPreset, setTimeOfDay, play, pause, reset } =
    useSolarTracking();

  const activePreset = (() => {
    const h = simulation.timeOfDay;
    if (h >= 5.5 && h < 9) return "morning";
    if (h >= 11 && h < 13) return "noon";
    if (h >= 16 && h < 18.5) return "evening";
    if (h >= 19 || h < 5) return "night";
    return null;
  })();

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex flex-col gap-3.5 w-full min-w-0">
        <div className="w-full min-w-0">
          <div className="flex items-center justify-between mb-2.5 w-full min-w-0 gap-2">
            <span className="text-[0.84rem] font-semibold text-foreground shrink-0">Time of day</span>
            <span className="inline-flex items-center rounded-md bg-[var(--accent-bg)] px-2 py-0.5 text-[0.72rem] font-semibold text-[var(--accent)] shrink-0 whitespace-nowrap tabular-nums">
              {formattedTime}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 w-full min-w-0">
            {PRESETS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreset(id)}
                className={cn(
                  "flex-1 min-w-[calc(50%-3px)] sm:min-w-0 rounded-md px-2 sm:px-3 py-1.5 text-[0.72rem] font-semibold transition-colors whitespace-nowrap",
                  activePreset === id
                    ? "bg-[var(--healthy-bg)] text-[var(--healthy)] border border-[var(--healthy-ring)]/30"
                    : "bg-surface border border-border text-text-secondary hover:bg-surface-soft hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 w-full min-w-0">
             <div className="flex items-center justify-between text-text-tertiary mb-2 w-full min-w-0">
               <span className="font-mono text-[9px] font-medium tracking-wide shrink-0">{String(SIMULATION.sunriseHour).padStart(2, "0")}:00</span>
               <span className="font-mono text-[9px] font-medium tracking-wide shrink-0">{String(SIMULATION.sunsetHour).padStart(2, "0")}:00</span>
             </div>
             <Slider
               min={SIMULATION.sunriseHour}
               max={SIMULATION.sunsetHour}
               step={0.05}
               value={[Math.min(Math.max(simulation.timeOfDay, SIMULATION.sunriseHour), SIMULATION.sunsetHour)]}
               onValueChange={([value]) => setTimeOfDay(value)}
               className="py-1 w-full min-w-0"
             />
          </div>
        </div>

        <div className="flex gap-2 w-full min-w-0">
          {simulation.isPlaying ? (
            <button type="button" onClick={pause} className="flex-1 min-w-0 h-9 flex items-center justify-center gap-2 rounded-md border border-border bg-surface text-foreground px-3 sm:px-4 text-[0.81rem] font-semibold transition-colors hover:bg-surface-soft whitespace-nowrap">
              <Pause size={14} className="shrink-0" />
              Pause
            </button>
          ) : (
            <button type="button" onClick={play} className="flex-1 min-w-0 h-9 flex items-center justify-center gap-2 rounded-md bg-accent px-3 sm:px-4 text-[0.81rem] font-semibold transition-colors hover:opacity-90 whitespace-nowrap" style={{ color: "#0b1205" }}>
              <Play size={14} className="shrink-0" />
              Play Day
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-tertiary transition-colors hover:bg-surface-soft hover:text-foreground hover:border-border-strong"
            aria-label="Reset simulation"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
