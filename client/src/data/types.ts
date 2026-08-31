/**
 * SolarGrid Dashboard Data Types
 *
 * These types model the expected Supabase database schema.
 * When a table/column doesn't exist in Supabase, the corresponding
 * field will be null/undefined and the UI shows an appropriate
 * empty/not-available state.
 */

/* ────────────────────────────────────────────
 * Facility & Asset Identity
 * ──────────────────────────────────────────── */

export type Facility = {
  id: string;
  name: string;
  code: string;
  location: string;
  timezone: string;
};

export type AssetType = "pv" | "bess" | "grid" | "load";

export type Asset = {
  id: string;
  facility_id: string;
  type: AssetType;
  label: string;
  asset_code: string;
  tracker_id?: string;
};

/* ────────────────────────────────────────────
 * Live Telemetry
 * ──────────────────────────────────────────── */

export type TelemetryReading = {
  id: string;
  facility_id: string;
  timestamp: string; // ISO 8601
  /* Solar */
  solar_generation_kw: number | null;
  solar_irradiance_wm2: number | null;
  /* Load */
  total_load_kw: number | null;
  critical_load_kw: number | null;
  tier2_load_kw: number | null;
  tier3_load_kw: number | null;
  /* Battery */
  battery_soc_percent: number | null;
  battery_charge_kw: number | null;
  battery_discharge_kw: number | null;
  /* Grid */
  grid_import_kw: number | null;
  grid_export_kw: number | null;
  grid_connected: boolean | null;
  /* Derived */
  estimated_savings_inr: number | null;
  renewable_share_percent: number | null;
  solar_utilization_percent: number | null;
};

/* ────────────────────────────────────────────
 * Energy History (for charts)
 * ──────────────────────────────────────────── */

export type EnergyHistoryPoint = {
  time: string;
  solar: number;
  demand: number;
  battery: number;
  grid: number;
  forecast: number;
};

/* ────────────────────────────────────────────
 * Operating Mode
 * ──────────────────────────────────────────── */

export type OperatingModeName =
  | "Self-Powered"
  | "Cost Saving"
  | "Emergency Watch"
  | "Grid Backup";

export type PowerFlowState = "normal" | "high-demand" | "grid-outage" | "recovery";

export type OperatingModeRecord = {
  id: string;
  facility_id: string;
  mode: OperatingModeName;
  flow_state: PowerFlowState;
  mode_detail: string;
  updated_at: string;
};

/* ────────────────────────────────────────────
 * Forecast
 * ──────────────────────────────────────────── */

export type SolarForecast = {
  current_kw: number | null;
  next_hour_kw: number | null;
  peak_expected_kw: number | null;
  confidence_percent: number | null;
};

export type LoadForecast = {
  current_kw: number | null;
  expected_peak_kw: number | null;
  peak_time: string | null;
};

export type ForecastData = {
  solar: SolarForecast;
  load: LoadForecast;
};

/* ────────────────────────────────────────────
 * Optimization
 * ──────────────────────────────────────────── */

export type OptimizationEffect = {
  label: string;
  value: string;
};

export type OptimizationDecision = {
  id: string;
  facility_id: string;
  action: string;
  reason: string;
  expected_effects: OptimizationEffect[];
  confidence: string;
  status: "staged" | "applied" | "rejected";
  created_at: string;
};

/* ────────────────────────────────────────────
 * Priority Dispatch (Load Tiers)
 * ──────────────────────────────────────────── */

export type HealthState = "healthy" | "watch" | "critical" | "neutral";

export type LoadTier = {
  id: string;
  facility_id: string;
  tier: string;
  asset_id: string;
  label: string;
  description: string;
  state: string;
  status: HealthState;
  allocation_kw: number | null;
};

/* ────────────────────────────────────────────
 * Alerts / Events
 * ──────────────────────────────────────────── */

export type AlertSeverity = "critical" | "watch" | "healthy";

export type AlertRecord = {
  id: string;
  facility_id: string;
  title: string;
  detail: string;
  time: string;
  state: AlertSeverity;
  site: string;
  status: "Open" | "Acknowledged";
  asset_id?: string;
  created_at: string;
};

/* ────────────────────────────────────────────
 * Metering
 * ──────────────────────────────────────────── */

export type MeteringRecord = {
  id: string;
  facility_id: string;
  metric: string;
  current_value: string;
  reference_value: string;
  status: string;
  source: string;
};

/* ────────────────────────────────────────────
 * Predicted Demand
 * ──────────────────────────────────────────── */

export type PredictedDemand = {
  id: string;
  facility_id: string;
  predicted_kw: number | null;
  prediction_time: string;
  confidence_percent: number | null;
  model_version: string | null;
};

/* ────────────────────────────────────────────
 * Dashboard Aggregated State
 * ──────────────────────────────────────────── */

export type DashboardDataState = {
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
};

export type DataSourceStatus = {
  kind: "live" | "mock" | "unavailable";
  lastUpdated: Date | null;
  isStale: boolean;
  error: string | null;
};
