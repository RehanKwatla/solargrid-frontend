/**
 * Dashboard Data Provider
 *
 * Central context that aggregates all Supabase data queries
 * and provides loading/error/status info to all dashboard pages.
 * When Supabase is not configured, data falls back to mock values.
 */

import { createContext, useContext, type ReactNode } from "react";
import {
  useTelemetryQuery,
  useEnergyHistoryQuery,
  useOperatingModeQuery,
  useForecastQuery,
  useOptimizationQuery,
  useLoadTiersQuery,
  useAlertsQuery,
  useMeteringQuery,
  usePredictedDemandQuery,
  useFacilityQuery,
  type SupabaseQueryResult,
} from "@/hooks/useSupabaseData";
import type {
  TelemetryReading,
  EnergyHistoryPoint,
  OperatingModeRecord,
  ForecastData,
  OptimizationDecision,
  LoadTier,
  AlertRecord,
  MeteringRecord,
  PredictedDemand,
  Facility,
  DataSourceStatus,
} from "@/data/types";

type DashboardDataContextValue = {
  /* Data */
  telemetry: TelemetryReading | null;
  energyHistory: EnergyHistoryPoint[];
  operatingMode: OperatingModeRecord | null;
  forecast: ForecastData | null;
  optimization: OptimizationDecision | null;
  loadTiers: LoadTier[];
  alerts: AlertRecord[];
  metering: MeteringRecord[];
  predictedDemand: PredictedDemand | null;
  facility: Facility | null;

  /* Status per domain */
  telemetryStatus: DataSourceStatus;
  energyStatus: DataSourceStatus;
  modeStatus: DataSourceStatus;
  forecastStatus: DataSourceStatus;
  optimizationStatus: DataSourceStatus;
  loadTiersStatus: DataSourceStatus;
  alertsStatus: DataSourceStatus;
  meteringStatus: DataSourceStatus;
  predictedDemandStatus: DataSourceStatus;
  facilityStatus: DataSourceStatus;

  /* Aggregate */
  overallStatus: DataSourceStatus;
  anyError: string | null;

  /* Actions */
  refetchAll: () => void;
};

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

function combineStatuses(...statuses: DataSourceStatus[]): DataSourceStatus {
  const live = statuses.some((s) => s.kind === "live");
  const mock = statuses.some((s) => s.kind === "mock");
  const unavailable = statuses.every((s) => s.kind === "unavailable");
  const latest = statuses.reduce(
    (latest, s) => (!latest || (s.lastUpdated && s.lastUpdated > latest) ? s.lastUpdated : latest),
    null as Date | null
  );
  const isStale = statuses.some((s) => s.isStale);
  const errors = statuses.filter((s) => s.error).map((s) => s.error!);

  return {
    kind: unavailable ? "unavailable" : live ? "live" : mock ? "mock" : "unavailable",
    lastUpdated: latest,
    isStale,
    error: errors.length > 0 ? errors[0] : null,
  };
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const telemetry = useTelemetryQuery();
  const energyHistory = useEnergyHistoryQuery();
  const operatingMode = useOperatingModeQuery();
  const forecast = useForecastQuery();
  const optimization = useOptimizationQuery();
  const loadTiers = useLoadTiersQuery();
  const alerts = useAlertsQuery();
  const metering = useMeteringQuery();
  const predictedDemand = usePredictedDemandQuery();
  const facility = useFacilityQuery();

  const overallStatus = combineStatuses(
    telemetry.status,
    energyHistory.status,
    operatingMode.status,
    forecast.status,
    optimization.status,
    loadTiers.status,
    alerts.status,
    metering.status,
    facility.status
  );

  const errors = [
    telemetry.status.error,
    energyHistory.status.error,
    operatingMode.status.error,
    forecast.status.error,
    optimization.status.error,
    loadTiers.status.error,
    alerts.status.error,
    metering.status.error,
    facility.status.error,
  ].filter(Boolean);

  const refetchAll = () => {
    telemetry.refetch();
    energyHistory.refetch();
    operatingMode.refetch();
    forecast.refetch();
    optimization.refetch();
    loadTiers.refetch();
    alerts.refetch();
    metering.refetch();
    predictedDemand.refetch();
    facility.refetch();
  };

  const value: DashboardDataContextValue = {
    telemetry: telemetry.data,
    energyHistory: energyHistory.data ?? [],
    operatingMode: operatingMode.data,
    forecast: forecast.data,
    optimization: optimization.data,
    loadTiers: loadTiers.data ?? [],
    alerts: alerts.data ?? [],
    metering: metering.data ?? [],
    predictedDemand: predictedDemand.data,
    facility: facility.data,

    telemetryStatus: telemetry.status,
    energyStatus: energyHistory.status,
    modeStatus: operatingMode.status,
    forecastStatus: forecast.status,
    optimizationStatus: optimization.status,
    loadTiersStatus: loadTiers.status,
    alertsStatus: alerts.status,
    meteringStatus: metering.status,
    predictedDemandStatus: predictedDemand.status,
    facilityStatus: facility.status,

    overallStatus,
    anyError: errors.length > 0 ? errors[0]! : null,
    refetchAll,
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }
  return ctx;
}
