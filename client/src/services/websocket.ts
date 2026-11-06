import { mockTelemetry } from "@/data/mockData";
import type { TelemetryReading } from "@/data/types";

export type EnergyEvent = typeof mockTelemetry & { timestamp: string };

/**
 * SolarGrid Real-Time Telemetry Stream:
 * Subscribes to the backend SSE endpoint (/api/stream).
 * When live server is unavailable, seamlessly falls back to local tick simulation.
 */
export function subscribeToEnergyUpdates(onEvent: (event: EnergyEvent) => void): () => void {
  let eventSource: EventSource | null = null;
  let timer: number | null = null;
  let isSubscribed = true;

  if (typeof window !== "undefined" && typeof EventSource !== "undefined") {
    try {
      eventSource = new EventSource("/api/stream");

      eventSource.onmessage = (event) => {
        if (!isSubscribed) return;
        try {
          const raw = JSON.parse(event.data) as TelemetryReading;
          const energyEvent: EnergyEvent = {
            ...mockTelemetry,
            solarKw: raw.solar_generation_kw ?? mockTelemetry.solarKw,
            loadKw: raw.total_load_kw ?? mockTelemetry.loadKw,
            criticalLoadKw: raw.critical_load_kw ?? mockTelemetry.criticalLoadKw,
            batterySoc: raw.battery_soc_percent ?? mockTelemetry.batterySoc,
            batteryKw: (raw.battery_charge_kw ?? 0) - (raw.battery_discharge_kw ?? 0),
            gridKw: (raw.grid_import_kw ?? 0) - (raw.grid_export_kw ?? 0),
            timestamp: raw.timestamp || new Date().toISOString(),
          };
          onEvent(energyEvent);
        } catch {
          // parse error
        }
      };

      eventSource.onerror = () => {
        // If SSE disconnects, fall back to interval simulation
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!timer && isSubscribed) {
          timer = window.setInterval(dispatchLocalTick, 15000);
        }
      };
    } catch {
      // EventSource failed to instantiate, fallback
      timer = window.setInterval(dispatchLocalTick, 30000);
    }
  } else if (typeof window !== "undefined") {
    timer = window.setInterval(dispatchLocalTick, 30000);
  }

  function dispatchLocalTick() {
    if (!isSubscribed) return;
    onEvent({
      ...mockTelemetry,
      solarKw: Number((mockTelemetry.solarKw + (Math.random() - 0.5) * 0.6).toFixed(1)),
      timestamp: new Date().toISOString(),
    });
  }

  return () => {
    isSubscribed = false;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}
