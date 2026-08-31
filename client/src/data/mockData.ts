export type HealthState = "healthy" | "watch" | "critical" | "neutral";
export type OperatingMode = "Self-Powered" | "Cost Saving" | "Emergency Watch" | "Grid Backup";
export type PowerFlowState = "normal" | "high-demand" | "grid-outage" | "recovery";
export type EnergyPoint = { time: string; solar: number; demand: number; battery: number; grid: number; forecast: number };
export type AlertItem = { id: number; title: string; detail: string; time: string; state: Exclude<HealthState, "neutral">; site: string; status: "Open" | "Acknowledged"; assetId?: string };

export const facility = {
  name: "Apollo Care Campus",
  code: "SG-ACC-01",
  location: "Pune · India",
  timezone: "Asia/Kolkata",
};

export const assets = {
  pv01: { id: "PV-01", label: "Solar Array · PV-01", trackerId: "TRACKER-01" },
  bess01: { id: "BESS-01", label: "Battery Bank · BESS-01" },
  grid01: { id: "GRID-01", label: "Grid Inlet · GRID-01" },
  loadT1: { id: "LOAD-T1", label: "Critical Load · Tier 01" },
  loadT2: { id: "LOAD-T2", label: "Important Load · Tier 02" },
  loadT3: { id: "LOAD-T3", label: "Deferrable Load · Tier 03" },
  tracker01: { id: "TRACKER-01", label: "Solar Tracker · Array 01" },
};

export const mockTelemetry = {
  solarKw: 42.5,
  gridKw: 12.3,
  batterySoc: 78,
  batteryKw: 8.4,
  loadKw: 51.2,
  criticalLoadKw: 30.4,
  tier2LoadKw: 13.8,
  tier3LoadKw: 7.0,
  estimatedSavingsInr: 1240,
  gridConnected: true,
  site: facility.name,
  lastUpdated: "11:32:18",
};

export const operatingState = {
  mode: "Self-Powered" as OperatingMode,
  flowState: "normal" as PowerFlowState,
  modeDetail: "Solar currently covers critical and facility demand while BESS absorbs surplus.",
};

export const impactMetrics = [
  { value: "₹1,240", label: "Estimated avoided energy cost", sublabel: "Today · simulated" },
  { value: "18.4 kWh", label: "Renewable energy retained", sublabel: "Since sunrise · simulated" },
  { value: "31 min", label: "Critical reserve protected", sublabel: "Tier 01 buffer · simulated" },
  { value: "18%", label: "Grid import reduction", sublabel: "vs. baseline · simulated" },
];

export const dayTimeline = [
  { time: "06:00", label: "Sunrise", active: false },
  { time: "09:00", label: "Tracking", active: true },
  { time: "12:00", label: "Peak solar", active: false },
  { time: "15:00", label: "High demand", active: false },
  { time: "18:00", label: "Sunset", active: false },
];

export const energyHistory: EnergyPoint[] = [
  { time: "06", solar: 2, demand: 29, battery: 0, grid: 27, forecast: 3 },
  { time: "07", solar: 8, demand: 32, battery: 0, grid: 24, forecast: 7 },
  { time: "08", solar: 17, demand: 35, battery: 2, grid: 16, forecast: 15 },
  { time: "09", solar: 28, demand: 39, battery: 5, grid: 6, forecast: 25 },
  { time: "10", solar: 36, demand: 45, battery: 7, grid: 2, forecast: 34 },
  { time: "11", solar: 42.5, demand: 51.2, battery: 8.4, grid: 12.3, forecast: 40 },
  { time: "12", solar: 49, demand: 53, battery: 10, grid: 0, forecast: 47 },
  { time: "13", solar: 53, demand: 57, battery: 11, grid: 0, forecast: 55 },
  { time: "14", solar: 47, demand: 60, battery: 12, grid: 1, forecast: 50 },
  { time: "15", solar: 37, demand: 62, battery: -7, grid: 18, forecast: 40 },
  { time: "16", solar: 23, demand: 55, battery: -12, grid: 20, forecast: 26 },
  { time: "17", solar: 9, demand: 46, battery: -10, grid: 27, forecast: 10 },
];

export const overviewKpis = [
  { label: "Solar generation", assetId: "PV-01", value: "42.5", unit: "kW", change: "+tracking", note: "Array 01", state: "healthy" as HealthState },
  { label: "Battery", assetId: "BESS-01", value: "78", unit: "%", change: "Charging", note: "8.4 kW", state: "healthy" as HealthState },
  { label: "Grid", assetId: "GRID-01", value: "12.3", unit: "kW", change: "Connected", note: "importing", state: "neutral" as HealthState },
  { label: "Facility load", assetId: "LOAD", value: "51.2", unit: "kW", change: "Normal", note: "all tiers", state: "healthy" as HealthState },
  { label: "Critical load", assetId: "LOAD-T1", value: "30.4", unit: "kW", change: "Protected", note: "Tier 01", state: "healthy" as HealthState },
  { label: "Estimated savings", assetId: "", value: "₹1,240", unit: "", change: "Today", note: "simulated", state: "healthy" as HealthState },
];

export const alerts: AlertItem[] = [
  { id: 1, title: "Grid instability detected", detail: "Voltage variance above preferred operating band. Critical loads remain protected.", time: "07:42", state: "critical", site: facility.name, status: "Open", assetId: "GRID-01" },
  { id: 2, title: "Dispatch activated", detail: "Battery discharge initiated to offset projected demand peak while preserving Tier 01 reserve.", time: "07:43", state: "watch", site: facility.name, status: "Open", assetId: "BESS-01" },
  { id: 3, title: "Critical load protection active", detail: "Tier 01 allocation held at 30.4 kW — ICU, emergency lighting, cold-chain circuits.", time: "07:44", state: "healthy", site: facility.name, status: "Open", assetId: "LOAD-T1" },
  { id: 4, title: "Solar output above forecast", detail: "Irradiance ahead of model; battery charging window extended.", time: "07:48", state: "healthy", site: facility.name, status: "Open", assetId: "PV-01" },
  { id: 5, title: "Cold-chain load stable", detail: "Temperature-protection circuit operating within expected consumption range.", time: "09:41", state: "healthy", site: "Cold Storage Wing", status: "Acknowledged", assetId: "LOAD-T2" },
];

export const solarForecast = { current: 42, nextHour: 48, peakExpected: 55, confidence: "92%" };
export const loadForecast = { current: 51, expectedPeak: 68, peakTime: "14:30" };

export const optimizationDecision = {
  action: "Discharge BESS-01",
  reason: "Projected demand exceeds available solar generation during the upcoming peak window.",
  expectedEffect: [
    { label: "Grid import", value: "-18%" },
    { label: "Critical reserve", value: "+12 min" },
  ],
  confidence: "High confidence",
};

export const priorityDispatch = [
  { tier: "Tier 01", assetId: "LOAD-T1", label: "Critical", description: "ICU, emergency lighting, cold-chain protection", state: "Protected", status: "healthy" as HealthState, allocation: "30.4 kW" },
  { tier: "Tier 02", assetId: "LOAD-T2", label: "Important", description: "Clinical support and operations", state: "Reduce if required", status: "watch" as HealthState, allocation: "13.8 kW" },
  { tier: "Tier 03", assetId: "LOAD-T3", label: "Deferrable", description: "Non-essential deferred loads", state: "Shed if required", status: "neutral" as HealthState, allocation: "7.0 kW" },
];

export const feature1Metering = [
  { metric: "Daily solar export", current: "148.6 kWh", reference: "Demo baseline 132.0 kWh", status: "Above baseline", source: "Mock utility meter" },
  { metric: "Grid import", current: "84.2 kWh", reference: "Demo ceiling 110.0 kWh", status: "Within target", source: "Mock campus meter" },
  { metric: "Demand peak", current: "68.0 kW", reference: "Demo reference 72.0 kW", status: "Within target", source: "Mock demand meter" },
];

/** Compatibility exports */
export const generationSeries = energyHistory;
export const kpis = overviewKpis;
export const overviewSnapshot = { site: mockTelemetry.site, weather: "Clear with high thin cloud", temperature: "27°", irradiance: "836 W/m²", lastUpdated: mockTelemetry.lastUpdated, gridExport: "12.3 kW", batteryFlow: "8.4 kW", localLoad: "51.2 kW" };
export const intelligenceNotes = [
  { title: "Peak management window", detail: "Demand expected to exceed solar output during mid-afternoon.", impact: "Action advised" },
  { title: "Solar capture is strong", detail: "Current irradiance allows charging before predicted demand peak.", impact: "High confidence" },
  { title: "Tier 01 protection held", detail: "Protected load allocation covered across all demo power-flow states.", impact: "Protected" },
];

/* ────────────────────────────────────────────
 * Energy Sharing Mock Data
 * ──────────────────────────────────────────── */

export const mockEnergySharingSummary = {
  id: "share-sum-01",
  facility_id: "SG-ACC-01",
  available_energy_kwh: 142.8,
  energy_shared_kwh: 384.5,
  energy_received_kwh: 96.2,
  credit_balance_kwh: 124.5,
  credit_rate_inr_per_kwh: 6.80,
  credits_earned: 42,
  total_earnings_inr: 18450,
  today_earnings_inr: 2614,
  pending_earnings_inr: 1088,
  avg_selling_rate_inr: 6.80,
  avg_buying_rate_inr: 6.35,
  avoided_cost_inr: 34820,
  total_energy_sold_kwh: 2713.2,
  sharing_status: "Active Sharing" as const,
  updated_at: new Date().toISOString(),
};

export const mockEnergyPeers = [
  {
    id: "peer-01",
    name: "Apollo Clinical Annex (Wing B)",
    type: "hospital_wing" as const,
    distance_km: 0.3,
    demand_status: "High Demand" as const,
    available_capacity_kwh: 45.0,
    current_rate_inr: 7.10,
  },
  {
    id: "peer-02",
    name: "Pune Municipal Primary Health Substation",
    type: "clinic" as const,
    distance_km: 1.2,
    demand_status: "Critical" as const,
    available_capacity_kwh: 60.0,
    current_rate_inr: 7.40,
  },
  {
    id: "peer-03",
    name: "District Vaccine Cold Storage Hub",
    type: "storage_facility" as const,
    distance_km: 2.1,
    demand_status: "Balanced" as const,
    available_capacity_kwh: 80.0,
    current_rate_inr: 6.80,
  },
  {
    id: "peer-04",
    name: "West Feeder Microgrid Bus #04",
    type: "microgrid_feeder" as const,
    distance_km: 0.8,
    demand_status: "Surplus" as const,
    available_capacity_kwh: 120.0,
    current_rate_inr: 6.50,
  },
];

export const mockEnergyTransactions = [
  {
    id: "tx-01",
    facility_id: "SG-ACC-01",
    type: "Sold" as const,
    amount_kwh: 35.0,
    rate_inr: 7.10,
    total_amount_inr: 248.50,
    status: "Completed" as const,
    peer_entity: "Apollo Clinical Annex (Wing B)",
    notes: "Surplus dispatch during morning peak",
    created_at: "2026-08-31T09:15:00.000Z",
  },
  {
    id: "tx-02",
    facility_id: "SG-ACC-01",
    type: "Shared" as const,
    amount_kwh: 20.0,
    rate_inr: 6.80,
    total_amount_inr: 136.00,
    status: "Completed" as const,
    peer_entity: "District Vaccine Cold Storage Hub",
    notes: "Critical cold-chain emergency support credit",
    created_at: "2026-08-31T08:40:00.000Z",
  },
  {
    id: "tx-03",
    facility_id: "SG-ACC-01",
    type: "Sold" as const,
    amount_kwh: 50.0,
    rate_inr: 7.40,
    total_amount_inr: 370.00,
    status: "Settled" as const,
    peer_entity: "Pune Municipal Primary Health Substation",
    notes: "Automated peak shaving trade",
    created_at: "2026-08-30T14:20:00.000Z",
  },
  {
    id: "tx-04",
    facility_id: "SG-ACC-01",
    type: "Received" as const,
    amount_kwh: 15.0,
    rate_inr: 6.50,
    total_amount_inr: 97.50,
    status: "Completed" as const,
    peer_entity: "West Feeder Microgrid Bus #04",
    notes: "Night reserve top-up",
    created_at: "2026-08-30T04:30:00.000Z",
  },
  {
    id: "tx-05",
    facility_id: "SG-ACC-01",
    type: "Bought" as const,
    amount_kwh: 25.0,
    rate_inr: 6.60,
    total_amount_inr: 165.00,
    status: "Completed" as const,
    peer_entity: "West Feeder Microgrid Bus #04",
    notes: "Pre-storm reserve buffer acquisition",
    created_at: "2026-08-29T18:10:00.000Z",
  },
];

/* ────────────────────────────────────────────
 * Hospital Critical Loads Mock Data
 * ──────────────────────────────────────────── */

export const mockHospitalLoads = [
  // One representative, protected life-support load per clinical department.
  {
    id: "load-icu-01",
    facility_id: "SG-ACC-01",
    building: "Main Clinical Block",
    floor: "Floor 3",
    department: "Intensive Care Unit (ICU)",
    room: "ICU-01",
    equipment_name: "Ventilator Bank & Invasive Monitor",
    current_kw: 2.8,
    rated_kw: 3.5,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: "2026-08-31T10:00:00.000Z",
  },
  {
    id: "load-ot-01",
    facility_id: "SG-ACC-01",
    building: "Surgical Wing",
    floor: "Floor 2",
    department: "Operation Theatre (OT)",
    room: "OT Suite 01",
    equipment_name: "Surgical Shadowless Lamps & Anesthesia Station",
    current_kw: 4.6,
    rated_kw: 5.5,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: "2026-08-31T10:00:00.000Z",
  },
  {
    id: "load-emg-01",
    facility_id: "SG-ACC-01",
    building: "Emergency Pavilion",
    floor: "Ground Floor",
    department: "Emergency & Trauma",
    room: "Trauma Bay 01",
    equipment_name: "Resuscitation Defibrillator & Suction Unit",
    current_kw: 3.5,
    rated_kw: 4.0,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: "2026-08-31T10:00:00.000Z",
  },
];

export const mockLoadAuditLogs = [
  {
    id: "audit-01",
    facility_id: "SG-ACC-01",
    timestamp: "2026-08-31T09:30:00.000Z",
    operator: "Dr. A. Sharma (Chief Medical Officer)",
    load_id: "load-ot-01",
    load_name: "OT Suite 01 — Surgical Lamps & Anesthesia",
    previous_priority: "HIGH" as const,
    new_priority: "CRITICAL" as const,
    reason: "Emergency neurosurgery scheduled during grid peak period",
  },
  {
    id: "audit-02",
    facility_id: "SG-ACC-01",
    timestamp: "2026-08-31T07:45:00.000Z",
    operator: "R. Mehta (Lead Electrical Engineer)",
    load_id: "load-icu-01",
    load_name: "ICU-01 — Ventilator Bank & Invasive Monitor",
    previous_priority: "HIGH" as const,
    new_priority: "CRITICAL" as const,
    reason: "WHO cold-chain certification compliance mandatory lock",
  },
  {
    id: "audit-03",
    facility_id: "SG-ACC-01",
    timestamp: "2026-08-30T16:15:00.000Z",
    operator: "S. Kulkarni (Facilities Supervisor)",
    load_id: "load-emg-01",
    load_name: "Trauma Bay 01 — Defibrillator & Suction Unit",
    previous_priority: "HIGH" as const,
    new_priority: "CRITICAL" as const,
    reason: "Trauma-resuscitation preservation policy enforcement",
  },
];

export const mockEmergencyModeState = {
  is_active: false,
  activated_at: null,
  activated_by: null,
  mode_label: "Standard Operations Mode",
};
