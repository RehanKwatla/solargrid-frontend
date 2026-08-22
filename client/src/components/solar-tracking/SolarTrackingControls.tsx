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
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="section-label">Time of day</p>
          <span className="font-mono text-xs text-[#d8ff3e]">{formattedTime}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className={cn(
                "rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                activePreset === id
                  ? "border-[#d8ff3e]/50 bg-[#d8ff3e]/15 text-[#d8ff3e]"
                  : "border-white/10 bg-white/[.03] text-[#9aa5a0] hover:border-white/20 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#7d8784]">
            {String(SIMULATION.sunriseHour).padStart(2, "0")}:00
          </span>
          <span className="font-mono text-[10px] text-[#7d8784]">
            {String(SIMULATION.sunsetHour).padStart(2, "0")}:00
          </span>
        </div>
        <Slider
          className="mt-2"
          min={SIMULATION.sunriseHour}
          max={SIMULATION.sunsetHour}
          step={0.05}
          value={[Math.min(Math.max(simulation.timeOfDay, SIMULATION.sunriseHour), SIMULATION.sunsetHour)]}
          onValueChange={([value]) => setTimeOfDay(value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {simulation.isPlaying ? (
          <button type="button" onClick={pause} className="action-button">
            <Pause size={14} />
            Pause
          </button>
        ) : (
          <button type="button" onClick={play} className="action-button">
            <Play size={14} />
            Play day simulation
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#aeb8b4] transition-colors hover:border-white/20 hover:text-white"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}
