import { mockTelemetry } from "@/data/mockData";
/** Grid Atlas: safe local telemetry simulation; no external WebSocket connection is attempted. */
export type EnergyEvent = typeof mockTelemetry & { timestamp: string };
export function subscribeToEnergyUpdates(onEvent: (event: EnergyEvent) => void) { const timer = window.setInterval(() => onEvent({ ...mockTelemetry, solarKw: Number((mockTelemetry.solarKw + (Math.random() - 0.5) * 0.6).toFixed(1)), timestamp: new Date().toISOString() }), 30000); return () => window.clearInterval(timer); }
