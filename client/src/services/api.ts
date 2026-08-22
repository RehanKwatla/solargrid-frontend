import { alerts, energyHistory, feature1Metering, loadForecast, mockTelemetry, operatingState, optimizationDecision, priorityDispatch, solarForecast } from "@/data/mockData";
/** Grid Atlas: static service seam for a later authenticated backend without UI rewrites. */
const wait = (duration = 180) => new Promise((resolve) => window.setTimeout(resolve, duration));
export const api = {
  async getTelemetry() { await wait(); return mockTelemetry; }, async getForecast() { await wait(); return { solarForecast, loadForecast }; }, async getOptimization() { await wait(); return { optimizationDecision, priorityDispatch, operatingState }; }, async getAlerts() { await wait(); return alerts; }, async getHistoricalEnergy() { await wait(); return energyHistory; }, async getFeature1Data() { await wait(); return feature1Metering; },
};
