import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  alerts as mockAlerts,
  energyHistory as mockEnergyHistory,
  feature1Metering as mockMetering,
  loadForecast as mockLoadForecast,
  mockTelemetry,
  operatingState as mockOperatingState,
  optimizationDecision as mockOptimization,
  priorityDispatch as mockPriorityDispatch,
  solarForecast as mockSolarForecast,
  mockEnergySharingSummary,
  mockEnergyTransactions,
  mockEnergyPeers,
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
  EnergySharingSummary,
  EnergyTransaction,
  EnergyPeer,
} from "@/data/types";

/**
 * Grid Atlas: service seam for dashboard data.
 *
 * When Supabase is configured (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set),
 * queries the live backend. When not configured, falls back to mock data.
 *
 * Each method returns a consistent shape so consumers don't need to know the source.
 */

const wait = (duration = 180) => new Promise((resolve) => window.setTimeout(resolve, duration));

/* ────────────────────────────────────────────
 * Telemetry
 * ──────────────────────────────────────────── */

function mockToTelemetry(t: typeof mockTelemetry): TelemetryReading {
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

async function liveTelemetry(): Promise<TelemetryReading> {
  const { data, error } = await supabase!
    .from("telemetry_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as TelemetryReading;
}

/* ────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────── */

export const api = {
  async getTelemetry() {
    if (isSupabaseConfigured) {
      try {
        return await liveTelemetry();
      } catch {
        await wait();
        return mockToTelemetry(mockTelemetry);
      }
    }
    await wait();
    return mockToTelemetry(mockTelemetry);
  },

  async getForecast(): Promise<ForecastData> {
    if (isSupabaseConfigured && supabase) {
      try {
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
        return {
          solar: solarRes.data
            ? {
                current_kw: solarRes.data.current_kw ?? null,
                next_hour_kw: solarRes.data.next_hour_kw ?? null,
                peak_expected_kw: solarRes.data.peak_expected_kw ?? null,
                confidence_percent: solarRes.data.confidence_percent ?? null,
              }
            : {
                current_kw: mockSolarForecast.current,
                next_hour_kw: mockSolarForecast.nextHour,
                peak_expected_kw: mockSolarForecast.peakExpected,
                confidence_percent: parseInt(mockSolarForecast.confidence),
              },
          load: loadRes.data
            ? {
                current_kw: loadRes.data.current_kw ?? null,
                expected_peak_kw: loadRes.data.expected_peak_kw ?? null,
                peak_time: loadRes.data.peak_time ?? null,
              }
            : {
                current_kw: mockLoadForecast.current,
                expected_peak_kw: mockLoadForecast.expectedPeak,
                peak_time: mockLoadForecast.peakTime,
              },
        };
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return {
      solar: {
        current_kw: mockSolarForecast.current,
        next_hour_kw: mockSolarForecast.nextHour,
        peak_expected_kw: mockSolarForecast.peakExpected,
        confidence_percent: parseInt(mockSolarForecast.confidence),
      },
      load: {
        current_kw: mockLoadForecast.current,
        expected_peak_kw: mockLoadForecast.expectedPeak,
        peak_time: mockLoadForecast.peakTime,
      },
    };
  },

  async getOptimization(): Promise<{
    optimization: OptimizationDecision;
    loadTiers: LoadTier[];
    operatingMode: OperatingModeRecord;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const [optRes, tiersRes, modeRes] = await Promise.all([
          supabase
            .from("optimization_decisions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("load_tiers")
            .select("*")
            .order("tier", { ascending: true }),
          supabase
            .from("operating_modes")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(1)
            .single(),
        ]);

        return {
          optimization: optRes.data
            ? {
                ...optRes.data,
                expected_effects: optRes.data.expected_effects ?? [],
              }
            : {
                id: "mock-optimization",
                facility_id: "mock",
                action: mockOptimization.action,
                reason: mockOptimization.reason,
                expected_effects: mockOptimization.expectedEffect,
                confidence: mockOptimization.confidence,
                status: "staged" as const,
                created_at: new Date().toISOString(),
              },
          loadTiers: tiersRes.data
            ? (tiersRes.data as LoadTier[])
            : mockPriorityDispatch.map((item) => ({
                id: `mock-${item.tier}`,
                facility_id: "mock",
                tier: item.tier,
                asset_id: item.assetId,
                label: item.label,
                description: item.description,
                state: item.state,
                status: item.status,
                allocation_kw: parseFloat(item.allocation),
              })),
          operatingMode: modeRes.data
            ? (modeRes.data as OperatingModeRecord)
            : {
                id: "mock-mode",
                facility_id: "mock",
                mode: mockOperatingState.mode,
                flow_state: mockOperatingState.flowState,
                mode_detail: mockOperatingState.modeDetail,
                updated_at: new Date().toISOString(),
              },
        };
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return {
      optimization: {
        id: "mock-optimization",
        facility_id: "mock",
        action: mockOptimization.action,
        reason: mockOptimization.reason,
        expected_effects: mockOptimization.expectedEffect,
        confidence: mockOptimization.confidence,
        status: "staged",
        created_at: new Date().toISOString(),
      },
      loadTiers: mockPriorityDispatch.map((item) => ({
        id: `mock-${item.tier}`,
        facility_id: "mock",
        tier: item.tier,
        asset_id: item.assetId,
        label: item.label,
        description: item.description,
        state: item.state,
        status: item.status,
        allocation_kw: parseFloat(item.allocation),
      })),
      operatingMode: {
        id: "mock-mode",
        facility_id: "mock",
        mode: mockOperatingState.mode,
        flow_state: mockOperatingState.flowState,
        mode_detail: mockOperatingState.modeDetail,
        updated_at: new Date().toISOString(),
      },
    };
  },

  async getAlerts(): Promise<AlertRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []) as AlertRecord[];
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockAlerts.map((a) => ({
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
  },

  async getHistoricalEnergy(): Promise<EnergyHistoryPoint[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_history")
          .select("*")
          .order("time", { ascending: true });
        if (error) throw error;
        return (data ?? []) as EnergyHistoryPoint[];
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockEnergyHistory;
  },

  async getFeature1Data(): Promise<MeteringRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("metering_records")
          .select("*")
          .order("metric", { ascending: true });
        if (error) throw error;
        return (data ?? []) as MeteringRecord[];
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockMetering.map((m, i) => ({
      id: `mock-meter-${i}`,
      facility_id: "mock",
      metric: m.metric,
      current_value: m.current,
      reference_value: m.reference,
      status: m.status,
      source: m.source,
    }));
  },

  async getEnergySharingSummary(): Promise<EnergySharingSummary> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_sharing_summary")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();
        if (error) throw error;
        return data as EnergySharingSummary;
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockEnergySharingSummary as EnergySharingSummary;
  },

  async getEnergyTransactions(): Promise<EnergyTransaction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_transactions")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []) as EnergyTransaction[];
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockEnergyTransactions as EnergyTransaction[];
  },

  async getEnergyPeers(): Promise<EnergyPeer[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_sharing_peers")
          .select("*")
          .order("distance_km", { ascending: true });
        if (error) throw error;
        return (data ?? []) as EnergyPeer[];
      } catch {
        // Fall through to mock
      }
    }
    await wait();
    return mockEnergyPeers as EnergyPeer[];
  },

  async createEnergyTransaction(transaction: Omit<EnergyTransaction, "id" | "created_at">): Promise<EnergyTransaction> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("energy_transactions")
        .insert([transaction])
        .select()
        .single();
      if (error) throw error;
      return data as EnergyTransaction;
    }
    await wait(250);
    const newTx: EnergyTransaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return newTx;
  },
};
