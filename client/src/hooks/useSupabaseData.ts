/**
 * SolarGrid Unified Data Fetching Layer
 *
 * Each hook queries live data via the unified api service
 * (supporting direct Supabase client + Express REST backend).
 * When live data is returned, status is marked as "live".
 * Provides automatic polling and Supabase Realtime event subscriptions.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { api } from "@/services/api";
import {
  mockTelemetry,
  energyHistory,
  operatingState,
  solarForecast,
  loadForecast,
  optimizationDecision,
  priorityDispatch,
  alerts,
  feature1Metering,
  facility,
  mockEnergySharingSummary,
  mockEnergyTransactions,
  mockEnergyPeers,
  mockHospitalLoads,
  mockLoadAuditLogs,
  mockEmergencyModeState,
} from "@/data/mockData";
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
} from "@/data/types";

/* ────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────── */

export type SupabaseQueryResult<T> = {
  data: T | null;
  status: DataSourceStatus;
  error: string | null;
  refetch: () => void;
};

/* ────────────────────────────────────────────
 * Generic fetch hook
 * ──────────────────────────────────────────── */

function useDataQuery<T>(
  domainName: string,
  fetcher: () => Promise<T | null>,
  fallback: T,
  intervalMs: number = 30_000,
  realtimeTable?: string
): SupabaseQueryResult<T> {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const [data, setData] = useState<T | null>(() => fallback);
  const [status, setStatus] = useState<DataSourceStatus>(() => ({
    kind: "mock",
    lastUpdated: new Date(),
    isStale: false,
    error: null,
  }));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const mountedRef = useRef(true);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    mountedRef.current = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function run() {
      try {
        const result = await fetcherRef.current();
        if (mountedRef.current) {
          if (result !== null && result !== undefined) {
            setData(result);
            setStatus({
              kind: "live",
              lastUpdated: new Date(),
              isStale: false,
              error: null,
            });
            setError(null);
          } else {
            setData(fallbackRef.current);
            setStatus({
              kind: "mock",
              lastUpdated: new Date(),
              isStale: false,
              error: null,
            });
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err instanceof Error ? err.message : String(err);
          setData(fallbackRef.current);
          setStatus({
            kind: "mock",
            lastUpdated: new Date(),
            isStale: false,
            error: msg,
          });
          setError(msg);
        }
      }
    }

    run();

    if (intervalMs && intervalMs > 0) {
      timer = setInterval(run, intervalMs);
    }

    return () => {
      mountedRef.current = false;
      if (timer) clearInterval(timer);
    };
  }, [refreshKey, domainName, intervalMs]);

  // Optional Supabase Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !realtimeTable) return;

    try {
      const channel = supabase
        .channel(`realtime-${realtimeTable}-${Math.random()}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: realtimeTable },
          () => {
            refetch();
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    } catch {
      // Ignore realtime error
    }
  }, [realtimeTable, refetch]);

  // Mark as stale after 2 minutes of no updates
  useEffect(() => {
    if (status.kind !== "live" || !status.lastUpdated) return;
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, isStale: true }));
      }
    }, 120_000);
    return () => clearTimeout(timer);
  }, [status.kind, status.lastUpdated]);

  return { data, status, error, refetch };
}

/* ────────────────────────────────────────────
 * Domain Hooks
 * ──────────────────────────────────────────── */

export function useTelemetryQuery(): SupabaseQueryResult<TelemetryReading> {
  return useDataQuery(
    "telemetry",
    () => api.getTelemetry(),
    {
      id: "mock-telemetry",
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      solar_generation_kw: mockTelemetry.solarKw,
      solar_irradiance_wm2: 820,
      total_load_kw: mockTelemetry.loadKw,
      critical_load_kw: mockTelemetry.criticalLoadKw,
      tier2_load_kw: mockTelemetry.tier2LoadKw,
      tier3_load_kw: mockTelemetry.tier3LoadKw,
      battery_soc_percent: mockTelemetry.batterySoc,
      battery_charge_kw: mockTelemetry.batteryKw > 0 ? mockTelemetry.batteryKw : null,
      battery_discharge_kw: mockTelemetry.batteryKw < 0 ? Math.abs(mockTelemetry.batteryKw) : null,
      grid_import_kw: mockTelemetry.gridKw > 0 ? mockTelemetry.gridKw : null,
      grid_export_kw: mockTelemetry.gridKw < 0 ? Math.abs(mockTelemetry.gridKw) : null,
      grid_connected: mockTelemetry.gridConnected,
      estimated_savings_inr: mockTelemetry.estimatedSavingsInr,
      renewable_share_percent: 83,
      solar_utilization_percent: 94,
    },
    15_000,
    "telemetry"
  );
}

export function useEnergyHistoryQuery(): SupabaseQueryResult<EnergyHistoryPoint[]> {
  return useDataQuery(
    "energy_history",
    () => api.getHistoricalEnergy(),
    energyHistory,
    60_000,
    "energy_history"
  );
}

export function useOperatingModeQuery(): SupabaseQueryResult<OperatingModeRecord> {
  return useDataQuery(
    "operating_mode",
    () => api.getOperatingMode(),
    {
      id: "mock-mode",
      facility_id: "SG-ACC-01",
      mode: operatingState.mode,
      flow_state: operatingState.flowState,
      mode_detail: operatingState.modeDetail,
      updated_at: new Date().toISOString(),
    },
    30_000,
    "operating_state"
  );
}

export function useForecastQuery(): SupabaseQueryResult<ForecastData> {
  return useDataQuery(
    "forecast",
    () => api.getForecast(),
    {
      solar: {
        current_kw: solarForecast.current,
        next_hour_kw: solarForecast.nextHour,
        peak_expected_kw: solarForecast.peakExpected,
        confidence_percent: parseInt(solarForecast.confidence),
      },
      load: {
        current_kw: loadForecast.current,
        expected_peak_kw: loadForecast.expectedPeak,
        peak_time: loadForecast.peakTime,
      },
    },
    60_000,
    "solar_forecast"
  );
}

export function useOptimizationQuery(): SupabaseQueryResult<OptimizationDecision> {
  return useDataQuery(
    "optimization",
    () => api.getOptimization(),
    {
      id: "mock-optimization",
      facility_id: "SG-ACC-01",
      action: optimizationDecision.action,
      reason: optimizationDecision.reason,
      expected_effects: optimizationDecision.expectedEffect,
      confidence: optimizationDecision.confidence,
      status: "staged",
      created_at: new Date().toISOString(),
    },
    30_000,
    "optimization_decisions"
  );
}

export function useLoadTiersQuery(): SupabaseQueryResult<LoadTier[]> {
  return useDataQuery(
    "load_tiers",
    () => api.getLoadTiers(),
    priorityDispatch.map((item) => ({
      id: `mock-${item.tier}`,
      facility_id: "SG-ACC-01",
      tier: item.tier,
      asset_id: item.assetId,
      label: item.label,
      description: item.description,
      state: item.state,
      status: item.status,
      allocation_kw: parseFloat(item.allocation),
    })),
    30_000,
    "priority_dispatch"
  );
}

export function useAlertsQuery(): SupabaseQueryResult<AlertRecord[]> {
  return useDataQuery(
    "alerts",
    () => api.getAlerts(),
    alerts.map((a) => ({
      id: String(a.id),
      facility_id: "SG-ACC-01",
      title: a.title,
      detail: a.detail,
      time: a.time,
      state: a.state,
      site: a.site,
      status: a.status,
      asset_id: a.assetId,
      created_at: new Date().toISOString(),
    })),
    20_000,
    "alerts"
  );
}

export function useMeteringQuery(): SupabaseQueryResult<MeteringRecord[]> {
  return useDataQuery(
    "metering",
    () => api.getFeature1Data(),
    feature1Metering.map((m, i) => ({
      id: `mock-meter-${i}`,
      facility_id: "SG-ACC-01",
      metric: m.metric,
      current_value: m.current,
      reference_value: m.reference,
      status: m.status,
      source: m.source,
    })),
    60_000,
    "feature1_metering"
  );
}

export function usePredictedDemandQuery(): SupabaseQueryResult<PredictedDemand | null> {
  return useDataQuery(
    "predicted_demand",
    async () => {
      if (!supabase) return null;
      try {
        const { data } = await supabase
          .from("predicted_demand")
          .select("*")
          .order("prediction_time", { ascending: false })
          .limit(1)
          .single();
        return data as PredictedDemand;
      } catch {
        return null;
      }
    },
    null,
    60_000
  );
}

export function useFacilityQuery(): SupabaseQueryResult<Facility> {
  return useDataQuery(
    "facility",
    () => api.getFacility(),
    {
      id: "SG-ACC-01",
      name: facility.name,
      code: facility.code,
      location: facility.location,
      timezone: facility.timezone,
    },
    120_000
  );
}

export function useEnergySharingQuery(): SupabaseQueryResult<EnergySharingSummary> {
  return useDataQuery(
    "energy_sharing_summary",
    () => api.getEnergySharingSummary(),
    mockEnergySharingSummary,
    15_000,
    "energy_sharing_summary"
  );
}

export function useEnergyTransactionsQuery(): SupabaseQueryResult<EnergyTransaction[]> {
  return useDataQuery(
    "energy_transactions",
    () => api.getEnergyTransactions(),
    mockEnergyTransactions,
    15_000,
    "energy_transactions"
  );
}

export function useEnergyPeersQuery(): SupabaseQueryResult<EnergyPeer[]> {
  return useDataQuery(
    "energy_sharing_peers",
    () => api.getEnergyPeers(),
    mockEnergyPeers,
    60_000,
    "energy_sharing_peers"
  );
}

export function useHospitalLoadsQuery(): SupabaseQueryResult<HospitalLoad[]> {
  return useDataQuery(
    "hospital_loads",
    () => api.getHospitalLoads(),
    mockHospitalLoads,
    15_000,
    "hospital_loads"
  );
}

export function useLoadAuditLogsQuery(): SupabaseQueryResult<LoadAuditLog[]> {
  return useDataQuery(
    "load_audit_logs",
    () => api.getLoadAuditLogs(),
    mockLoadAuditLogs,
    15_000,
    "load_audit_logs"
  );
}

export function useEmergencyModeQuery(): SupabaseQueryResult<EmergencyModeState> {
  return useDataQuery(
    "emergency_mode_state",
    () => api.getEmergencyModeState(),
    mockEmergencyModeState,
    10_000,
    "emergency_mode_state"
  );
}
