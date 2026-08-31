/**
 * Dashboard Data Provider
 *
 * Central context that aggregates all Supabase data queries
 * and provides loading/error/status info to all dashboard pages.
 * When Supabase is not configured, data falls back to mock values.
 */

import { createContext, useContext, useState, type ReactNode } from "react";
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
  useEnergySharingQuery,
  useEnergyTransactionsQuery,
  useEnergyPeersQuery,
  type SupabaseQueryResult,
} from "@/hooks/useSupabaseData";
import { api } from "@/services/api";
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
  EnergySharingSummary,
  EnergyTransaction,
  EnergyPeer,
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
  energySharing: EnergySharingSummary | null;
  energyTransactions: EnergyTransaction[];
  energyPeers: EnergyPeer[];

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
  energySharingStatus: DataSourceStatus;
  energyTransactionsStatus: DataSourceStatus;
  energyPeersStatus: DataSourceStatus;

  /* Aggregate */
  overallStatus: DataSourceStatus;
  anyError: string | null;

  /* Actions */
  refetchAll: () => void;
  recordEnergyTransaction: (
    tx: Omit<EnergyTransaction, "id" | "created_at">
  ) => Promise<EnergyTransaction>;
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
  const energySharing = useEnergySharingQuery();
  const energyTransactions = useEnergyTransactionsQuery();
  const energyPeers = useEnergyPeersQuery();

  // Local optimistic/added transactions state to reflect immediate submissions
  const [localTransactions, setLocalTransactions] = useState<EnergyTransaction[]>([]);
  const [localSummaryOverride, setLocalSummaryOverride] = useState<Partial<EnergySharingSummary> | null>(null);

  const mergedTransactions = [
    ...localTransactions,
    ...(energyTransactions.data ?? []),
  ];

  const mergedSummary: EnergySharingSummary | null = energySharing.data
    ? {
        ...energySharing.data,
        ...(localSummaryOverride ?? {}),
      }
    : null;

  const overallStatus = combineStatuses(
    telemetry.status,
    energyHistory.status,
    operatingMode.status,
    forecast.status,
    optimization.status,
    loadTiers.status,
    alerts.status,
    metering.status,
    facility.status,
    energySharing.status,
    energyTransactions.status,
    energyPeers.status
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
    energySharing.status.error,
    energyTransactions.status.error,
    energyPeers.status.error,
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
    energySharing.refetch();
    energyTransactions.refetch();
    energyPeers.refetch();
  };

  const recordEnergyTransaction = async (
    tx: Omit<EnergyTransaction, "id" | "created_at">
  ): Promise<EnergyTransaction> => {
    const created = await api.createEnergyTransaction(tx);

    // Prepend locally for immediate UI reactivity
    setLocalTransactions((prev) => [created, ...prev]);

    // Update summary metrics optimistically
    if (mergedSummary) {
      if (tx.type === "Sold") {
        setLocalSummaryOverride((prev) => ({
          ...prev,
          available_energy_kwh: Math.max(0, (mergedSummary.available_energy_kwh ?? 0) - tx.amount_kwh),
          energy_shared_kwh: (mergedSummary.energy_shared_kwh ?? 0) + tx.amount_kwh,
          total_energy_sold_kwh: (mergedSummary.total_energy_sold_kwh ?? 0) + tx.amount_kwh,
          total_earnings_inr: (mergedSummary.total_earnings_inr ?? 0) + tx.total_amount_inr,
          today_earnings_inr: (mergedSummary.today_earnings_inr ?? 0) + tx.total_amount_inr,
          credit_balance_kwh: (mergedSummary.credit_balance_kwh ?? 0) + tx.amount_kwh,
        }));
      } else if (tx.type === "Shared") {
        setLocalSummaryOverride((prev) => ({
          ...prev,
          available_energy_kwh: Math.max(0, (mergedSummary.available_energy_kwh ?? 0) - tx.amount_kwh),
          energy_shared_kwh: (mergedSummary.energy_shared_kwh ?? 0) + tx.amount_kwh,
          credits_earned: (mergedSummary.credits_earned ?? 0) + 1,
          credit_balance_kwh: (mergedSummary.credit_balance_kwh ?? 0) + tx.amount_kwh,
        }));
      } else if (tx.type === "Bought" || tx.type === "Received") {
        setLocalSummaryOverride((prev) => ({
          ...prev,
          energy_received_kwh: (mergedSummary.energy_received_kwh ?? 0) + tx.amount_kwh,
          credit_balance_kwh: (mergedSummary.credit_balance_kwh ?? 0) - tx.amount_kwh,
        }));
      }
    }

    return created;
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
    energySharing: mergedSummary,
    energyTransactions: mergedTransactions,
    energyPeers: energyPeers.data ?? [],

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
    energySharingStatus: energySharing.status,
    energyTransactionsStatus: energyTransactions.status,
    energyPeersStatus: energyPeers.status,

    overallStatus,
    anyError: errors.length > 0 ? errors[0]! : null,
    refetchAll,
    recordEnergyTransaction,
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
