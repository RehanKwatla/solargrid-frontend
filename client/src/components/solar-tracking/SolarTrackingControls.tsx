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
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Time of day</span>
            <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
              {formattedTime}
            </span>
          </div>
          
          <div className="flex gap-2">
            {PRESETS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreset(id)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  activePreset === id
                    ? "bg-accent text-primary-foreground"
                    : "bg-surface border border-border text-text-secondary hover:bg-surface-soft hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5">
             <div className="flex items-center justify-between text-xs font-medium text-text-secondary mb-3">
               <span>{String(SIMULATION.sunriseHour).padStart(2, "0")}:00</span>
               <span>{String(SIMULATION.sunsetHour).padStart(2, "0")}:00</span>
             </div>
             <Slider
               min={SIMULATION.sunriseHour}
               max={SIMULATION.sunsetHour}
               step={0.05}
               value={[Math.min(Math.max(simulation.timeOfDay, SIMULATION.sunriseHour), SIMULATION.sunsetHour)]}
               onValueChange={([value]) => setTimeOfDay(value)}
               className="py-1"
             />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {simulation.isPlaying ? (
            <button type="button" onClick={pause} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface text-foreground px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-surface-soft">
              <Pause size={16} />
              Pause
            </button>
          ) : (
            <button type="button" onClick={play} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-healthy text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-healthy/90">
              <Play size={16} />
              Play Day
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-surface-soft hover:text-foreground"
            aria-label="Reset simulation"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
