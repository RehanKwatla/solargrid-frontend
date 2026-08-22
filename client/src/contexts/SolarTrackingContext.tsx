import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { mockTelemetry as baseMockTelemetry } from "@/data/mockData";
import {
  deriveSimulationState,
  formatSimulationTime,
  getPresetHour,
  initialSimulationState,
  SIMULATION,
  type SolarSimulationState,
  type TimePreset,
} from "@/lib/solarSimulation";

export type TelemetryState = typeof baseMockTelemetry;

type SolarTrackingContextValue = {
  simulation: SolarSimulationState;
  telemetry: TelemetryState;
  formattedTime: string;
  setTimeOfDay: (hour: number) => void;
  setPreset: (preset: TimePreset) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  toggleTracking: () => void;
};

const SolarTrackingContext = createContext<SolarTrackingContextValue | null>(null);

function mergeTelemetry(simulation: SolarSimulationState): TelemetryState {
  const solarKw = simulation.solarGenerationKw;
  const loadKw = baseMockTelemetry.loadKw;
  const surplus = solarKw - loadKw;

  return {
    ...baseMockTelemetry,
    solarKw,
    gridKw: surplus < 0 ? Number(Math.abs(surplus * 0.4).toFixed(1)) : 0,
    batteryKw: surplus > 0 ? Number(Math.min(surplus * 0.6, 12).toFixed(1)) : 0,
    lastUpdated: formatSimulationTime(simulation.timeOfDay),
  };
}

export function SolarTrackingProvider({ children }: { children: ReactNode }) {
  const [simulation, setSimulation] = useState<SolarSimulationState>(initialSimulationState);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const applyTime = useCallback((hour: number, trackingEnabled?: boolean) => {
    setSimulation((prev) => {
      const next = deriveSimulationState(hour, trackingEnabled ?? prev.trackingEnabled);
      return { ...next, isPlaying: prev.isPlaying };
    });
  }, []);

  const setTimeOfDay = useCallback(
    (hour: number) => applyTime(hour),
    [applyTime]
  );

  const setPreset = useCallback((preset: TimePreset) => {
    setSimulation((prev) => {
      const next = deriveSimulationState(getPresetHour(preset), prev.trackingEnabled);
      return { ...next, isPlaying: false };
    });
  }, []);

  const play = useCallback(() => {
    setSimulation((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setSimulation((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    setSimulation(initialSimulationState());
  }, []);

  const toggleTracking = useCallback(() => {
    setSimulation((prev) => {
      const trackingEnabled = !prev.trackingEnabled;
      const next = deriveSimulationState(prev.timeOfDay, trackingEnabled);
      return { ...next, isPlaying: prev.isPlaying };
    });
  }, []);

  useEffect(() => {
    if (!simulation.isPlaying) {
      lastTickRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = now;
      } else {
        const deltaSec = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;

        setSimulation((prev) => {
          let nextHour = prev.timeOfDay + deltaSec * SIMULATION.playSpeedHoursPerSecond;
          if (nextHour >= 21.5) nextHour = SIMULATION.sunriseHour;
          const next = deriveSimulationState(nextHour, prev.trackingEnabled);
          return { ...next, isPlaying: true };
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [simulation.isPlaying]);

  const telemetry = useMemo(() => mergeTelemetry(simulation), [simulation]);

  const value = useMemo(
    () => ({
      simulation,
      telemetry,
      formattedTime: formatSimulationTime(simulation.timeOfDay),
      setTimeOfDay,
      setPreset,
      play,
      pause,
      reset,
      toggleTracking,
    }),
    [simulation, telemetry, setTimeOfDay, setPreset, play, pause, reset, toggleTracking]
  );

  return (
    <SolarTrackingContext.Provider value={value}>{children}</SolarTrackingContext.Provider>
  );
}

export function useSolarTracking() {
  const ctx = useContext(SolarTrackingContext);
  if (!ctx) {
    throw new Error("useSolarTracking must be used within SolarTrackingProvider");
  }
  return ctx;
}

export function useTelemetry() {
  return useSolarTracking().telemetry;
}
