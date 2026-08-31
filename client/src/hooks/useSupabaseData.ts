/**
 * Supabase Data Fetching Layer
 *
 * Each hook queries a specific Supabase table/view.
 * When Supabase is not configured, hooks return null data + "mock" source status.
 * When a query fails or the table doesn't exist, hooks return error state gracefully.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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

function useSupabaseQuery<T>(
  tableName: string,
  fetcher: () => Promise<T | null>,
  mockFallback: T,
  intervalMs?: number
): SupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<DataSourceStatus>({
    kind: "unavailable",
    lastUpdated: null,
    isStale: false,
    error: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const mountedRef = useRef(true);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    mountedRef.current = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function run() {
      if (!isSupabaseConfigured || !supabase) {
        if (mountedRef.current) {
          setData(mockFallback);
          setStatus({
            kind: "mock",
            lastUpdated: new Date(),
            isStale: false,
            error: null,
          });
          setError(null);
        }
        return;
      }

      try {
        const result = await fetcher();
        if (mountedRef.current) {
          if (result !== null) {
            setData(result);
            setStatus({
              kind: "live",
              lastUpdated: new Date(),
              isStale: false,
              error: null,
            });
            setError(null);
          } else {
            // Table might not exist yet — fall back to mock
            setData(mockFallback);
            setStatus({
              kind: "mock",
              lastUpdated: new Date(),
              isStale: false,
              error: `Table "${tableName}" not found — showing mock data`,
            });
            setError(null);
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err instanceof Error ? err.message : String(err);
          setData(mockFallback);
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

    if (intervalMs) {
      timer = setInterval(run, intervalMs);
    }

    return () => {
      mountedRef.current = false;
      if (timer) clearInterval(timer);
    };
  }, [refreshKey, tableName, fetcher, mockFallback, intervalMs]);

  // Mark as stale after 2 minutes
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
 * Telemetry Hook
 * ──────────────────────────────────────────── */

function mockTelemetryToReading(t: typeof mockTelemetry): TelemetryReading {
  return {
    id: "mock-telemetry",
    facility_id: "mock",
    timestamp: new Date().toISOString(),
    solar_generation_kw: t.solarKw,
    solar_irradiance_wm2: null,
    total_load_kw: t.loadKw,
    critical_load_kw: t.criticalLoadKw,
    tier2_load_kw: t.tier2LoadKw,
    tier3_load_kw: t.tier3LoadKw,
    battery_soc_percent: t.batterySoc,
    battery_charge_kw: t.batteryKw > 0 ? t.batteryKw : null,
    battery_discharge_kw: t.batteryKw < 0 ? Math.abs(t.batteryKw) : null,
    grid_import_kw: t.gridKw > 0 ? t.gridKw : null,
    grid_export_kw: t.gridKw < 0 ? Math.abs(t.gridKw) : null,
    grid_connected: t.gridConnected,
    estimated_savings_inr: t.estimatedSavingsInr,
    renewable_share_percent: null,
    solar_utilization_percent: null,
  };
}

async function fetchTelemetry(): Promise<TelemetryReading | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("telemetry_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as TelemetryReading;
}

export function useTelemetryQuery(): SupabaseQueryResult<TelemetryReading> {
  return useSupabaseQuery(
    "telemetry_readings",
    fetchTelemetry,
    mockTelemetryToReading(mockTelemetry),
    30_000 // Poll every 30s
  );
}

/* ────────────────────────────────────────────
 * Energy History Hook
 * ──────────────────────────────────────────── */

async function fetchEnergyHistory(): Promise<EnergyHistoryPoint[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("energy_history")
    .select("*")
    .order("time", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EnergyHistoryPoint[];
}

export function useEnergyHistoryQuery(): SupabaseQueryResult<EnergyHistoryPoint[]> {
  return useSupabaseQuery(
    "energy_history",
    fetchEnergyHistory,
    energyHistory
  );
}

/* ────────────────────────────────────────────
 * Operating Mode Hook
 * ──────────────────────────────────────────── */

function mockOperatingMode(): OperatingModeRecord {
  return {
    id: "mock-mode",
    facility_id: "mock",
    mode: operatingState.mode,
    flow_state: operatingState.flowState,
    mode_detail: operatingState.modeDetail,
    updated_at: new Date().toISOString(),
  };
}

async function fetchOperatingMode(): Promise<OperatingModeRecord | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("operating_modes")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as OperatingModeRecord;
}

export function useOperatingModeQuery(): SupabaseQueryResult<OperatingModeRecord> {
  return useSupabaseQuery(
    "operating_modes",
    fetchOperatingMode,
    mockOperatingMode()
  );
}

/* ────────────────────────────────────────────
 * Forecast Hook
 * ──────────────────────────────────────────── */

function mockForecast(): ForecastData {
  return {
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
  };
}

async function fetchForecast(): Promise<ForecastData | null> {
  if (!supabase) return null;

  const [solarRes, loadRes] = await Promise.all([
    supabase
      .from("solar_forecasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("load_forecasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (solarRes.error && loadRes.error) throw solarRes.error;

  return {
    solar: solarRes.data
      ? {
          current_kw: solarRes.data.current_kw ?? null,
          next_hour_kw: solarRes.data.next_hour_kw ?? null,
          peak_expected_kw: solarRes.data.peak_expected_kw ?? null,
          confidence_percent: solarRes.data.confidence_percent ?? null,
        }
      : mockForecast().solar,
    load: loadRes.data
      ? {
          current_kw: loadRes.data.current_kw ?? null,
          expected_peak_kw: loadRes.data.expected_peak_kw ?? null,
          peak_time: loadRes.data.peak_time ?? null,
        }
      : mockForecast().load,
  };
}

export function useForecastQuery(): SupabaseQueryResult<ForecastData> {
  return useSupabaseQuery("solar_forecasts", fetchForecast, mockForecast());
}

/* ────────────────────────────────────────────
 * Optimization Hook
 * ──────────────────────────────────────────── */

function mockOptimization(): OptimizationDecision {
  return {
    id: "mock-optimization",
    facility_id: "mock",
    action: optimizationDecision.action,
    reason: optimizationDecision.reason,
    expected_effects: optimizationDecision.expectedEffect,
    confidence: optimizationDecision.confidence,
    status: "staged",
    created_at: new Date().toISOString(),
  };
}

async function fetchOptimization(): Promise<OptimizationDecision | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("optimization_decisions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return {
    ...data,
    expected_effects: data.expected_effects ?? [],
  } as OptimizationDecision;
}

export function useOptimizationQuery(): SupabaseQueryResult<OptimizationDecision> {
  return useSupabaseQuery("optimization_decisions", fetchOptimization, mockOptimization());
}

/* ────────────────────────────────────────────
 * Load Tiers Hook
 * ──────────────────────────────────────────── */

function mockLoadTiers(): LoadTier[] {
  return priorityDispatch.map((item) => ({
    id: `mock-${item.tier}`,
    facility_id: "mock",
    tier: item.tier,
    asset_id: item.assetId,
    label: item.label,
    description: item.description,
    state: item.state,
    status: item.status,
    allocation_kw: parseFloat(item.allocation),
  }));
}

async function fetchLoadTiers(): Promise<LoadTier[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("load_tiers")
    .select("*")
    .order("tier", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LoadTier[];
}

export function useLoadTiersQuery(): SupabaseQueryResult<LoadTier[]> {
  return useSupabaseQuery("load_tiers", fetchLoadTiers, mockLoadTiers());
}

/* ────────────────────────────────────────────
 * Alerts Hook
 * ──────────────────────────────────────────── */

function mockAlerts(): AlertRecord[] {
  return alerts.map((a) => ({
    id: String(a.id),
    facility_id: "mock",
    title: a.title,
    detail: a.detail,
    time: a.time,
    state: a.state,
    site: a.site,
    status: a.status,
    asset_id: a.assetId,
    created_at: new Date().toISOString(),
  }));
}

async function fetchAlerts(): Promise<AlertRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AlertRecord[];
}

export function useAlertsQuery(): SupabaseQueryResult<AlertRecord[]> {
  return useSupabaseQuery("alerts", fetchAlerts, mockAlerts(), 60_000);
}

/* ────────────────────────────────────────────
 * Metering Hook
 * ──────────────────────────────────────────── */

function mockMetering(): MeteringRecord[] {
  return feature1Metering.map((m, i) => ({
    id: `mock-meter-${i}`,
    facility_id: "mock",
    metric: m.metric,
    current_value: m.current,
    reference_value: m.reference,
    status: m.status,
    source: m.source,
  }));
}

async function fetchMetering(): Promise<MeteringRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("metering_records")
    .select("*")
    .order("metric", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MeteringRecord[];
}

export function useMeteringQuery(): SupabaseQueryResult<MeteringRecord[]> {
  return useSupabaseQuery("metering_records", fetchMetering, mockMetering());
}

/* ────────────────────────────────────────────
 * Predicted Demand Hook
 * ──────────────────────────────────────────── */

async function fetchPredictedDemand(): Promise<PredictedDemand | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("predicted_demand")
    .select("*")
    .order("prediction_time", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as PredictedDemand;
}

export function usePredictedDemandQuery(): SupabaseQueryResult<PredictedDemand | null> {
  return useSupabaseQuery(
    "predicted_demand",
    fetchPredictedDemand,
    null // No mock fallback — shows "not available" if Supabase table doesn't exist
  );
}

/* ────────────────────────────────────────────
 * Facility Hook
 * ──────────────────────────────────────────── */

function mockFacility(): Facility {
  return {
    id: "mock-facility",
    name: facility.name,
    code: facility.code,
    location: facility.location,
    timezone: facility.timezone,
  };
}

async function fetchFacility(): Promise<Facility | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("facilities")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data as Facility;
}

export function useFacilityQuery(): SupabaseQueryResult<Facility> {
  return useSupabaseQuery("facilities", fetchFacility, mockFacility());
}
