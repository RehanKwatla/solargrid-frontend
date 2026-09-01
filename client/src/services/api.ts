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
  mockHospitalLoads,
  mockLoadAuditLogs,
  mockEmergencyModeState,
  facility as mockFacilityData,
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
  HospitalLoad,
  LoadAuditLog,
  EmergencyModeState,
  PriorityLevel,
  Facility,
} from "@/data/types";

/**
 * SolarGrid unified API layer:
 * Seamlessly interfaces with:
 * 1. Supabase Postgres database (when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present)
 * 2. Express Backend REST API (/api/*)
 * 3. Consistent mock fallback for zero-downtime development
 */

const API_BASE = "";

async function fetchFromRest<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────────
 * Normalizers / Adapters
 * ──────────────────────────────────────────── */

function normalizeTelemetry(raw: any): TelemetryReading {
  const solar = raw.solar_generation_kw ?? raw.solar_kw ?? mockTelemetry.solarKw;
  const load = raw.total_load_kw ?? raw.load_kw ?? mockTelemetry.loadKw;
  const critical = raw.critical_load_kw ?? mockTelemetry.criticalLoadKw;
  const tier2 = raw.tier2_load_kw ?? mockTelemetry.tier2LoadKw;
  const tier3 = raw.tier3_load_kw ?? mockTelemetry.tier3LoadKw;
  const batterySoc = raw.battery_soc_percent ?? raw.battery_soc ?? mockTelemetry.batterySoc;
  
  let batteryCharge = raw.battery_charge_kw;
  let batteryDischarge = raw.battery_discharge_kw;
  if (batteryCharge === undefined && batteryDischarge === undefined && raw.battery_kw !== undefined) {
    batteryCharge = raw.battery_kw > 0 ? raw.battery_kw : null;
    batteryDischarge = raw.battery_kw < 0 ? Math.abs(raw.battery_kw) : null;
  }

  let gridImport = raw.grid_import_kw;
  let gridExport = raw.grid_export_kw;
  if (gridImport === undefined && gridExport === undefined && raw.grid_kw !== undefined) {
    gridImport = raw.grid_kw > 0 ? raw.grid_kw : null;
    gridExport = raw.grid_kw < 0 ? Math.abs(raw.grid_kw) : null;
  }

  return {
    id: String(raw.id || "telemetry-latest"),
    facility_id: raw.facility_id || "SG-ACC-01",
    timestamp: raw.timestamp || raw.recorded_at || new Date().toISOString(),
    solar_generation_kw: solar,
    solar_irradiance_wm2: raw.solar_irradiance_wm2 ?? null,
    total_load_kw: load,
    critical_load_kw: critical,
    tier2_load_kw: tier2,
    tier3_load_kw: tier3,
    battery_soc_percent: batterySoc,
    battery_charge_kw: batteryCharge ?? null,
    battery_discharge_kw: batteryDischarge ?? null,
    grid_import_kw: gridImport ?? null,
    grid_export_kw: gridExport ?? null,
    grid_connected: raw.grid_connected ?? true,
    estimated_savings_inr: raw.estimated_savings_inr ?? mockTelemetry.estimatedSavingsInr,
    renewable_share_percent: raw.renewable_share_percent ?? null,
    solar_utilization_percent: raw.solar_utilization_percent ?? null,
  };
}

/* ────────────────────────────────────────────
 * Public API Implementation
 * ──────────────────────────────────────────── */

export const api = {
  // Facility
  async getFacility(): Promise<Facility> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("facilities").select("*").limit(1).single();
        if (!error && data) return data as Facility;
      } catch {}
    }

    const rest = await fetchFromRest<Facility>("/facility");
    if (rest) return rest;

    return {
      id: "SG-ACC-01",
      name: mockFacilityData.name,
      code: mockFacilityData.code,
      location: mockFacilityData.location,
      timezone: mockFacilityData.timezone,
    };
  },

  // Telemetry
  async getTelemetry(): Promise<TelemetryReading> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Try telemetry table first
        let res = await supabase.from("telemetry").select("*").order("recorded_at", { ascending: false }).limit(1).single();
        if (res.error) {
          res = await supabase.from("telemetry_readings").select("*").order("timestamp", { ascending: false }).limit(1).single();
        }
        if (!res.error && res.data) {
          return normalizeTelemetry(res.data);
        }
      } catch {}
    }

    const rest = await fetchFromRest<any>("/telemetry");
    if (rest) return normalizeTelemetry(rest);

    return normalizeTelemetry(mockTelemetry);
  },

  // Energy History
  async getHistoricalEnergy(): Promise<EnergyHistoryPoint[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("energy_history").select("*").order("recorded_at", { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            time: d.time || d.time_label || "00:00",
            solar: Number(d.solar || 0),
            demand: Number(d.demand || 0),
            battery: Number(d.battery || 0),
            grid: Number(d.grid || 0),
            forecast: Number(d.forecast || 0),
          }));
        }
      } catch {}
    }

    const rest = await fetchFromRest<EnergyHistoryPoint[]>("/energy-history");
    if (rest && rest.length > 0) return rest;

    return mockEnergyHistory;
  },

  // Operating Mode
  async getOperatingMode(): Promise<OperatingModeRecord> {
    if (isSupabaseConfigured && supabase) {
      try {
        let res = await supabase.from("operating_state").select("*").order("updated_at", { ascending: false }).limit(1).single();
        if (res.error) {
          res = await supabase.from("operating_modes").select("*").order("updated_at", { ascending: false }).limit(1).single();
        }
        if (!res.error && res.data) {
          return res.data as OperatingModeRecord;
        }
      } catch {}
    }

    const rest = await fetchFromRest<OperatingModeRecord>("/operating-mode");
    if (rest) return rest;

    return {
      id: "mode-01",
      facility_id: "SG-ACC-01",
      mode: mockOperatingState.mode,
      flow_state: mockOperatingState.flowState,
      mode_detail: mockOperatingState.modeDetail,
      updated_at: new Date().toISOString(),
    };
  },

  // Forecast
  async getForecast(): Promise<ForecastData> {
    if (isSupabaseConfigured && supabase) {
      try {
        const [solarRes, loadRes] = await Promise.all([
          supabase.from("solar_forecast").select("*").order("updated_at", { ascending: false }).limit(1).single()
            .then((r) => (r.error ? supabase!.from("solar_forecasts").select("*").order("created_at", { ascending: false }).limit(1).single() : r)),
          supabase.from("load_forecast").select("*").order("updated_at", { ascending: false }).limit(1).single()
            .then((r) => (r.error ? supabase!.from("load_forecasts").select("*").order("created_at", { ascending: false }).limit(1).single() : r)),
        ]);

        if (solarRes.data || loadRes.data) {
          return {
            solar: {
              current_kw: solarRes.data?.current ?? solarRes.data?.current_kw ?? mockSolarForecast.current,
              next_hour_kw: solarRes.data?.next_hour ?? solarRes.data?.next_hour_kw ?? mockSolarForecast.nextHour,
              peak_expected_kw: solarRes.data?.peak_expected ?? solarRes.data?.peak_expected_kw ?? mockSolarForecast.peakExpected,
              confidence_percent: parseInt(String(solarRes.data?.confidence ?? solarRes.data?.confidence_percent ?? mockSolarForecast.confidence)),
            },
            load: {
              current_kw: loadRes.data?.current ?? loadRes.data?.current_kw ?? mockLoadForecast.current,
              expected_peak_kw: loadRes.data?.expected_peak ?? loadRes.data?.expected_peak_kw ?? mockLoadForecast.expectedPeak,
              peak_time: loadRes.data?.peak_time ?? mockLoadForecast.peakTime,
            },
          };
        }
      } catch {}
    }

    const rest = await fetchFromRest<ForecastData>("/forecast");
    if (rest) return rest;

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

  // Optimization
  async getOptimization(): Promise<OptimizationDecision> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("optimization_decisions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (!error && data) {
          return {
            ...data,
            expected_effects: data.expected_effects || data.expected_effect || [],
            status: data.status || "staged",
          } as OptimizationDecision;
        }
      } catch {}
    }

    const rest = await fetchFromRest<OptimizationDecision>("/optimization");
    if (rest) return rest;

    return {
      id: "mock-optimization",
      facility_id: "SG-ACC-01",
      action: mockOptimization.action,
      reason: mockOptimization.reason,
      expected_effects: mockOptimization.expectedEffect,
      confidence: mockOptimization.confidence,
      status: "staged",
      created_at: new Date().toISOString(),
    };
  },

  // Priority Dispatch / Load Tiers
  async getLoadTiers(): Promise<LoadTier[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let res = await supabase.from("priority_dispatch").select("*").order("tier", { ascending: true });
        if (res.error) {
          res = await supabase.from("load_tiers").select("*").order("tier", { ascending: true });
        }
        if (!res.error && res.data && res.data.length > 0) {
          return res.data.map((item: any) => ({
            id: String(item.id),
            facility_id: item.facility_id || "SG-ACC-01",
            tier: item.tier,
            asset_id: item.asset_id || item.assetId,
            label: item.label,
            description: item.description,
            state: item.state,
            status: item.status,
            allocation_kw: item.allocation_kw !== undefined ? Number(item.allocation_kw) : parseFloat(String(item.allocation || "0")),
          }));
        }
      } catch {}
    }

    const rest = await fetchFromRest<LoadTier[]>("/priority-dispatch");
    if (rest && rest.length > 0) return rest;

    return mockPriorityDispatch.map((item) => ({
      id: `mock-${item.tier}`,
      facility_id: "SG-ACC-01",
      tier: item.tier,
      asset_id: item.assetId,
      label: item.label,
      description: item.description,
      state: item.state,
      status: item.status,
      allocation_kw: parseFloat(item.allocation),
    }));
  },

  // Metering
  async getFeature1Data(): Promise<MeteringRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let res = await supabase.from("feature1_metering").select("*").order("id", { ascending: true });
        if (res.error) {
          res = await supabase.from("metering_records").select("*").order("metric", { ascending: true });
        }
        if (!res.error && res.data && res.data.length > 0) {
          return res.data as MeteringRecord[];
        }
      } catch {}
    }

    const rest = await fetchFromRest<MeteringRecord[]>("/metering");
    if (rest && rest.length > 0) return rest;

    return mockMetering.map((m, i) => ({
      id: `mock-meter-${i}`,
      facility_id: "SG-ACC-01",
      metric: m.metric,
      current_value: m.current,
      reference_value: m.reference,
      status: m.status,
      source: m.source,
    }));
  },

  // Alerts
  async getAlerts(): Promise<AlertRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: String(a.id),
            facility_id: a.facility_id || "SG-ACC-01",
            title: a.title,
            detail: a.detail,
            time: a.time || a.occurred_at || "Recently",
            state: a.state,
            site: a.site || "Apollo Care Campus",
            status: a.status || "Open",
            asset_id: a.asset_id,
            created_at: a.created_at || new Date().toISOString(),
          }));
        }
      } catch {}
    }

    const rest = await fetchFromRest<AlertRecord[]>("/alerts");
    if (rest && rest.length > 0) return rest;

    return mockAlerts.map((a) => ({
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
    }));
  },

  async acknowledgeAlert(alertId: string | number): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("alerts").update({ status: "Acknowledged" }).eq("id", alertId);
      return;
    }
    await fetchFromRest(`/alerts/${alertId}/acknowledge`, { method: "PATCH" });
  },

  // Hospital Loads
  async getHospitalLoads(): Promise<HospitalLoad[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("hospital_loads")
          .select("*")
          .order("priority", { ascending: true });
        if (!error && data && data.length > 0) {
          return data as HospitalLoad[];
        }
      } catch {}
    }

    const rest = await fetchFromRest<HospitalLoad[]>("/hospital-loads");
    if (rest && rest.length > 0) return rest;

    return mockHospitalLoads as HospitalLoad[];
  },

  async updateLoadPriority(
    loadId: string,
    newPriority: PriorityLevel,
    reason: string,
    operator: string
  ): Promise<{ load: HospitalLoad; audit: LoadAuditLog }> {
    const auditEntry: LoadAuditLog = {
      id: `audit-${Date.now()}`,
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      operator: operator || "Authorized Clinical Operator",
      load_id: loadId,
      load_name: loadId,
      previous_priority: newPriority,
      new_priority: newPriority,
      reason,
    };

    if (isSupabaseConfigured && supabase) {
      const [loadRes, auditRes] = await Promise.all([
        supabase
          .from("hospital_loads")
          .update({
            priority: newPriority,
            status: newPriority === "CRITICAL" ? "Protected" : "Active",
            protection_status: newPriority === "CRITICAL" ? "100% Protected" : newPriority === "HIGH" ? "Guaranteed" : "Curtailable",
            updated_at: new Date().toISOString(),
          })
          .eq("id", loadId)
          .select()
          .single(),
        supabase
          .from("load_audit_logs")
          .insert([auditEntry])
          .select()
          .single(),
      ]);

      if (loadRes.error) throw loadRes.error;
      return {
        load: loadRes.data as HospitalLoad,
        audit: (auditRes.data ?? auditEntry) as LoadAuditLog,
      };
    }

    const restRes = await fetchFromRest<{ load: HospitalLoad; audit: LoadAuditLog }>(
      `/hospital-loads/${loadId}/priority`,
      {
        method: "PUT",
        body: JSON.stringify({ priority: newPriority, reason, operator }),
      }
    );

    if (restRes) return restRes;

    const existing = mockHospitalLoads.find((l) => l.id === loadId) ?? mockHospitalLoads[0];
    return {
      load: {
        ...existing,
        priority: newPriority,
        status: newPriority === "CRITICAL" ? "Protected" : "Active",
        protection_status: newPriority === "CRITICAL" ? "100% Protected" : newPriority === "HIGH" ? "Guaranteed" : "Curtailable",
        updated_at: new Date().toISOString(),
      },
      audit: {
        ...auditEntry,
        load_name: existing.equipment_name,
        previous_priority: existing.priority,
      },
    };
  },

  // Load Audit Logs
  async getLoadAuditLogs(): Promise<LoadAuditLog[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("load_audit_logs")
          .select("*")
          .order("timestamp", { ascending: false });
        if (!error && data && data.length > 0) {
          return data as LoadAuditLog[];
        }
      } catch {}
    }

    const rest = await fetchFromRest<LoadAuditLog[]>("/load-audit-logs");
    if (rest && rest.length > 0) return rest;

    return mockLoadAuditLogs as LoadAuditLog[];
  },

  // Emergency Mode
  async getEmergencyModeState(): Promise<EmergencyModeState> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("emergency_mode_state")
          .select("*")
          .eq("id", "current_state")
          .single();
        if (!error && data) {
          return data as EmergencyModeState;
        }
      } catch {}
    }

    const rest = await fetchFromRest<EmergencyModeState>("/emergency-mode");
    if (rest) return rest;

    return mockEmergencyModeState as EmergencyModeState;
  },

  async setEmergencyMode(
    isActive: boolean,
    operator: string,
    reason: string
  ): Promise<EmergencyModeState> {
    const newState: EmergencyModeState = {
      is_active: isActive,
      activated_at: isActive ? new Date().toISOString() : null,
      activated_by: isActive ? (operator || "Lead Clinical Engineer") : null,
      mode_label: isActive ? "Emergency Critical Load Preservation Mode" : "Standard Operations Mode",
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("emergency_mode_state")
        .upsert({
          id: "current_state",
          facility_id: "SG-ACC-01",
          is_active: newState.is_active,
          activated_at: newState.activated_at,
          activated_by: newState.activated_by,
          mode_label: newState.mode_label,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as EmergencyModeState;
    }

    const rest = await fetchFromRest<EmergencyModeState>("/emergency-mode", {
      method: "POST",
      body: JSON.stringify({ is_active: isActive, operator, reason }),
    });

    if (rest) return rest;
    return newState;
  },

  // Energy Sharing
  async getEnergySharingSummary(): Promise<EnergySharingSummary> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_sharing_summary")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();
        if (!error && data) {
          return data as EnergySharingSummary;
        }
      } catch {}
    }

    const rest = await fetchFromRest<EnergySharingSummary>("/energy-sharing/summary");
    if (rest) return rest;

    return mockEnergySharingSummary as EnergySharingSummary;
  },

  async getEnergyTransactions(): Promise<EnergyTransaction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_transactions")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data as EnergyTransaction[];
        }
      } catch {}
    }

    const rest = await fetchFromRest<EnergyTransaction[]>("/energy-sharing/transactions");
    if (rest && rest.length > 0) return rest;

    return mockEnergyTransactions as EnergyTransaction[];
  },

  async getEnergyPeers(): Promise<EnergyPeer[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("energy_sharing_peers")
          .select("*")
          .order("distance_km", { ascending: true });
        if (!error && data && data.length > 0) {
          return data as EnergyPeer[];
        }
      } catch {}
    }

    const rest = await fetchFromRest<EnergyPeer[]>("/energy-sharing/peers");
    if (rest && rest.length > 0) return rest;

    return mockEnergyPeers as EnergyPeer[];
  },

  async createEnergyTransaction(
    transaction: Omit<EnergyTransaction, "id" | "created_at">
  ): Promise<{ transaction: EnergyTransaction; summary?: EnergySharingSummary }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("energy_transactions")
        .insert([transaction])
        .select()
        .single();
      if (error) throw error;
      return { transaction: data as EnergyTransaction };
    }

    const rest = await fetchFromRest<{ transaction: EnergyTransaction; summary?: EnergySharingSummary }>(
      "/energy-sharing/transactions",
      {
        method: "POST",
        body: JSON.stringify(transaction),
      }
    );

    if (rest) return rest;

    const newTx: EnergyTransaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return { transaction: newTx };
  },
};
