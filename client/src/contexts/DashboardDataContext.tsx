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
  useHospitalLoadsQuery,
  useLoadAuditLogsQuery,
  useEmergencyModeQuery,
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
  HospitalLoad,
  LoadAuditLog,
  EmergencyModeState,
  PriorityLevel,
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
  hospitalLoads: HospitalLoad[];
  loadAuditLogs: LoadAuditLog[];
  emergencyMode: EmergencyModeState;

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
  hospitalLoadsStatus: DataSourceStatus;
  loadAuditLogsStatus: DataSourceStatus;
  emergencyModeStatus: DataSourceStatus;

  /* Aggregate */
  overallStatus: DataSourceStatus;
  anyError: string | null;

  /* Actions */
  refetchAll: () => void;
  recordEnergyTransaction: (
    tx: Omit<EnergyTransaction, "id" | "created_at">
  ) => Promise<EnergyTransaction>;
  updateHospitalLoadPriority: (
    loadId: string,
    newPriority: PriorityLevel,
    reason: string,
    operator: string
  ) => Promise<void>;
  toggleEmergencyMode: (
    active: boolean,
    operator: string,
    reason: string
  ) => Promise<void>;
  acknowledgeAlert: (alertId: string | number) => Promise<void>;
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
  const hospitalLoadsQuery = useHospitalLoadsQuery();
  const loadAuditLogsQuery = useLoadAuditLogsQuery();
  const emergencyModeQuery = useEmergencyModeQuery();

  // Local optimistic/added transactions state to reflect immediate submissions
  const [localTransactions, setLocalTransactions] = useState<EnergyTransaction[]>([]);
  const [localSummaryOverride, setLocalSummaryOverride] = useState<Partial<EnergySharingSummary> | null>(null);
  const [localLoadsOverride, setLocalLoadsOverride] = useState<Record<string, Partial<HospitalLoad>>>({});
  const [localAuditLogs, setLocalAuditLogs] = useState<LoadAuditLog[]>([]);
  const [localEmergencyModeOverride, setLocalEmergencyModeOverride] = useState<EmergencyModeState | null>(null);

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

  const mergedHospitalLoads: HospitalLoad[] = (hospitalLoadsQuery.data ?? []).map((load) => {
    if (localLoadsOverride[load.id]) {
      return { ...load, ...localLoadsOverride[load.id] };
    }
    return load;
  });

  const mergedAuditLogs: LoadAuditLog[] = [
    ...localAuditLogs,
    ...(loadAuditLogsQuery.data ?? []),
  ];

  const mergedEmergencyMode: EmergencyModeState = localEmergencyModeOverride ?? (emergencyModeQuery.data ?? {
    is_active: false,
    activated_at: null,
    activated_by: null,
    mode_label: "Standard Operations Mode",
  });

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
    energyPeers.status,
    hospitalLoadsQuery.status,
    loadAuditLogsQuery.status,
    emergencyModeQuery.status
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
    hospitalLoadsQuery.status.error,
    loadAuditLogsQuery.status.error,
    emergencyModeQuery.status.error,
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
    hospitalLoadsQuery.refetch();
    loadAuditLogsQuery.refetch();
    emergencyModeQuery.refetch();
  };

  const recordEnergyTransaction = async (
    tx: Omit<EnergyTransaction, "id" | "created_at">
  ): Promise<EnergyTransaction> => {
    const res = await api.createEnergyTransaction(tx);
    const created = res.transaction;

    // Prepend locally for immediate UI reactivity
    setLocalTransactions((prev) => [created, ...prev]);

    // Update summary metrics
    if (res.summary) {
      setLocalSummaryOverride(res.summary);
    } else if (mergedSummary) {
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

    energySharing.refetch();
    energyTransactions.refetch();

    return created;
  };

  const updateHospitalLoadPriority = async (
    loadId: string,
    newPriority: PriorityLevel,
    reason: string,
    operator: string
  ): Promise<void> => {
    const result = await api.updateLoadPriority(loadId, newPriority, reason, operator);

    // Apply optimistic updates
    setLocalLoadsOverride((prev) => ({
      ...prev,
      [loadId]: {
        priority: result.load.priority,
        status: result.load.status,
        protection_status: result.load.protection_status,
        updated_at: result.load.updated_at,
      },
    }));

    setLocalAuditLogs((prev) => [result.audit, ...prev]);
    hospitalLoadsQuery.refetch();
    loadAuditLogsQuery.refetch();
  };

  const toggleEmergencyMode = async (
    active: boolean,
    operator: string,
    reason: string
  ): Promise<void> => {
    const result = await api.setEmergencyMode(active, operator, reason);
    setLocalEmergencyModeOverride(result);

    // Record audit entry for emergency activation
    const emergencyAudit: LoadAuditLog = {
      id: `audit-${Date.now()}`,
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      operator: operator || "Clinical Operations Controller",
      load_id: "ALL_LOADS",
      load_name: active ? "Emergency Critical Load Mode Engaged" : "Emergency Mode Disengaged",
      previous_priority: active ? "NORMAL" : "CRITICAL",
      new_priority: active ? "CRITICAL" : "NORMAL",
      reason: reason || (active ? "Grid emergency load preservation initiated" : "Resumed normal schedule"),
    };
    setLocalAuditLogs((prev) => [emergencyAudit, ...prev]);
    emergencyModeQuery.refetch();
    operatingMode.refetch();
  };

  const acknowledgeAlert = async (alertId: string | number): Promise<void> => {
    await api.acknowledgeAlert(alertId);
    alerts.refetch();
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
    hospitalLoads: mergedHospitalLoads,
    loadAuditLogs: mergedAuditLogs,
    emergencyMode: mergedEmergencyMode,

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
    hospitalLoadsStatus: hospitalLoadsQuery.status,
    loadAuditLogsStatus: loadAuditLogsQuery.status,
    emergencyModeStatus: emergencyModeQuery.status,

    overallStatus,
    anyError: errors.length > 0 ? errors[0]! : null,
    refetchAll,
    recordEnergyTransaction,
    updateHospitalLoadPriority,
    toggleEmergencyMode,
    acknowledgeAlert,
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
