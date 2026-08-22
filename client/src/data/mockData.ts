export type HealthState = "healthy" | "watch" | "critical" | "neutral";
export type OperatingMode = "Self-Powered" | "Cost Saving" | "Emergency Watch" | "Grid Backup";
export type PowerFlowState = "normal" | "high-demand" | "grid-outage" | "recovery";
export type EnergyPoint = { time: string; solar: number; demand: number; battery: number; grid: number; forecast: number };
export type AlertItem = { id: number; title: string; detail: string; time: string; state: Exclude<HealthState, "neutral">; site: string; status: "Open" | "Acknowledged" };

/** Grid Atlas: one central mock source makes the hackathon demo easy to replace with real telemetry later. */
export const mockTelemetry = { solarKw: 42.5, gridKw: 12.3, batterySoc: 78, batteryKw: 8.4, loadKw: 51.2, criticalLoadKw: 30.4, tier2LoadKw: 13.8, tier3LoadKw: 7.0, estimatedSavingsInr: 1240, gridConnected: true, site: "Apollo Care Campus", lastUpdated: "11:32:18" };
export const operatingState = { mode: "Self-Powered" as OperatingMode, flowState: "normal" as PowerFlowState, modeDetail: "Solar covers critical and facility demand while the battery absorbs surplus." };

export const energyHistory: EnergyPoint[] = [
  { time: "06", solar: 2, demand: 29, battery: 0, grid: 27, forecast: 3 }, { time: "07", solar: 8, demand: 32, battery: 0, grid: 24, forecast: 7 }, { time: "08", solar: 17, demand: 35, battery: 2, grid: 16, forecast: 15 }, { time: "09", solar: 28, demand: 39, battery: 5, grid: 6, forecast: 25 }, { time: "10", solar: 36, demand: 45, battery: 7, grid: 2, forecast: 34 }, { time: "11", solar: 42.5, demand: 51.2, battery: 8.4, grid: 12.3, forecast: 40 }, { time: "12", solar: 49, demand: 53, battery: 10, grid: 0, forecast: 47 }, { time: "13", solar: 53, demand: 57, battery: 11, grid: 0, forecast: 55 }, { time: "14", solar: 47, demand: 60, battery: 12, grid: 1, forecast: 50 }, { time: "15", solar: 37, demand: 62, battery: -7, grid: 18, forecast: 40 }, { time: "16", solar: 23, demand: 55, battery: -12, grid: 20, forecast: 26 }, { time: "17", solar: 9, demand: 46, battery: -10, grid: 27, forecast: 10 },
];

export const overviewKpis = [
  { label: "Solar generation", value: "42.5", unit: "kW", change: "+8.4%", note: "vs. forecast", state: "healthy" as HealthState },
  { label: "Battery", value: "78", unit: "%", change: "Charging", note: "8.4 kW", state: "healthy" as HealthState },
  { label: "Grid", value: "12.3", unit: "kW", change: "Connected", note: "importing", state: "neutral" as HealthState },
  { label: "Facility load", value: "51.2", unit: "kW", change: "Normal", note: "all systems", state: "healthy" as HealthState },
  { label: "Critical load", value: "30.4", unit: "kW", change: "Protected", note: "Tier 1", state: "healthy" as HealthState },
  { label: "Estimated savings", value: "₹1,240", unit: "", change: "Today", note: "demo estimate", state: "healthy" as HealthState },
];

export const alerts: AlertItem[] = [
  { id: 1, title: "Grid quality event detected", detail: "Voltage variance is above the preferred operating band. Critical loads remain protected.", time: "11:24", state: "critical", site: "Apollo Care Campus", status: "Open" },
  { id: 2, title: "Battery reserve threshold approaching", detail: "Reserve is projected to touch 62% during the evening peak if demand continues to rise.", time: "10:52", state: "watch", site: "Apollo Care Campus", status: "Open" },
  { id: 3, title: "Solar generation increasing", detail: "Irradiance is ahead of forecast; the battery charging window is open.", time: "10:15", state: "healthy", site: "Apollo Care Campus", status: "Open" },
  { id: 4, title: "Cold-chain load is stable", detail: "Temperature-protection circuit is operating within the expected consumption range.", time: "09:41", state: "healthy", site: "Cold Storage Wing", status: "Acknowledged" },
];

export const solarForecast = { current: 42, nextHour: 48, peakExpected: 55, confidence: "92%" };
export const loadForecast = { current: 51, expectedPeak: 68, peakTime: "14:30" };
export const optimizationDecision = { action: "Discharge Battery", reason: "Expected demand exceeds current solar generation while maintaining Tier-1 load protection.", impact: ["Lower grid dependency", "Preserve critical-load reliability"], confidence: "High confidence" };
export const priorityDispatch = [
  { tier: "Tier 1", label: "Critical", description: "ICU, emergency lighting, and cold-chain protection", state: "Protected", status: "healthy" as HealthState, allocation: "30.4 kW" },
  { tier: "Tier 2", label: "Important", description: "Clinical support and operations", state: "Ready to reduce", status: "watch" as HealthState, allocation: "13.8 kW" },
  { tier: "Tier 3", label: "Deferrable", description: "Non-essential deferred loads", state: "Can be shed", status: "neutral" as HealthState, allocation: "7.0 kW" },
];
export const feature1Metering = [
  { metric: "Daily solar export", current: "148.6 kWh", reference: "Demo baseline 132.0 kWh", status: "Above baseline", source: "Mock utility meter" },
  { metric: "Grid import", current: "84.2 kWh", reference: "Demo ceiling 110.0 kWh", status: "Within target", source: "Mock campus meter" },
  { metric: "Demand peak", current: "68.0 kW", reference: "Demo reference 72.0 kW", status: "Within target", source: "Mock demand meter" },
];

/** Compatibility exports retained while individual modules migrate to the new names. */
export const generationSeries = energyHistory;
export const kpis = overviewKpis;
export const overviewSnapshot = { site: mockTelemetry.site, weather: "Clear with high thin cloud", temperature: "27°", irradiance: "836 W/m²", lastUpdated: mockTelemetry.lastUpdated, gridExport: "12.3 kW", batteryFlow: "8.4 kW", localLoad: "51.2 kW" };
export const intelligenceNotes = [{ title: "Peak management window", detail: "Demand is expected to exceed solar output during the mid-afternoon operating window.", impact: "Action advised" }, { title: "Solar capture is strong", detail: "Current irradiance gives the system room to charge before the predicted demand peak.", impact: "High confidence" }, { title: "Tier 1 protection is held", detail: "The protected load allocation remains covered across all demo power-flow states.", impact: "Protected" }];
