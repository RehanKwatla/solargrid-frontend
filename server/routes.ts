import { Router, Request, Response } from "express";

export const apiRouter = Router();

// ============================================================================
// Initial Seeds mirroring the database SQL files
// ============================================================================

let currentTelemetry = {
  id: "telemetry-1",
  facility_id: "SG-ACC-01",
  site: "Apollo Care Campus",
  timestamp: new Date().toISOString(),
  solar_generation_kw: 42.5,
  solar_irradiance_wm2: 820,
  total_load_kw: 51.2,
  critical_load_kw: 30.4,
  tier2_load_kw: 13.8,
  tier3_load_kw: 7.0,
  battery_soc_percent: 78,
  battery_charge_kw: 8.4,
  battery_discharge_kw: null as number | null,
  grid_import_kw: 12.3,
  grid_export_kw: null as number | null,
  grid_connected: true,
  estimated_savings_inr: 1240,
  renewable_share_percent: 83,
  solar_utilization_percent: 94,
};

let energyHistory = [
  { time: "06:00", solar: 2, demand: 29, battery: 0, grid: 27, forecast: 3 },
  { time: "07:00", solar: 8, demand: 32, battery: 0, grid: 24, forecast: 7 },
  { time: "08:00", solar: 17, demand: 35, battery: 2, grid: 16, forecast: 15 },
  { time: "09:00", solar: 28, demand: 39, battery: 5, grid: 6, forecast: 25 },
  { time: "10:00", solar: 36, demand: 45, battery: 7, grid: 2, forecast: 34 },
  { time: "11:00", solar: 42.5, demand: 51.2, battery: 8.4, grid: 12.3, forecast: 40 },
  { time: "12:00", solar: 49, demand: 53, battery: 10, grid: 0, forecast: 47 },
  { time: "13:00", solar: 53, demand: 57, battery: 11, grid: 0, forecast: 55 },
  { time: "14:00", solar: 47, demand: 60, battery: 12, grid: 1, forecast: 50 },
  { time: "15:00", solar: 37, demand: 62, battery: -7, grid: 18, forecast: 40 },
  { time: "16:00", solar: 23, demand: 55, battery: -12, grid: 20, forecast: 26 },
  { time: "17:00", solar: 9, demand: 46, battery: -10, grid: 27, forecast: 10 },
];

let operatingState = {
  id: "mode-01",
  facility_id: "SG-ACC-01",
  mode: "Self-Powered" as "Self-Powered" | "Cost Saving" | "Emergency Watch" | "Grid Backup",
  flow_state: "normal" as "normal" | "high-demand" | "grid-outage" | "recovery",
  mode_detail: "Solar + BESS supplying priority clinical feeders; grid in hot standby",
  updated_at: new Date().toISOString(),
};

let forecastData = {
  solar: {
    current_kw: 42.5,
    next_hour_kw: 48.0,
    peak_expected_kw: 54.2,
    confidence_percent: 94,
  },
  load: {
    current_kw: 51.2,
    expected_peak_kw: 62.0,
    peak_time: "14:30",
  },
};

let optimizationDecision = {
  id: "opt-01",
  facility_id: "SG-ACC-01",
  action: "Maximize On-Site Solar & Pre-Charge BESS",
  reason: "Predicted afternoon clinical surgical surge and grid tariff peak at 14:00. Prioritizing 100% ICU life-support buffer.",
  expected_effects: [
    { label: "Cost Reduction", value: "₹2,140 / day" },
    { label: "Critical Runtime Buffer", value: "+42 mins" },
    { label: "Renewable Utilization", value: "98.4%" },
  ],
  confidence: "High (MILP Model v2.4)",
  status: "staged" as "staged" | "applied" | "rejected",
  created_at: new Date().toISOString(),
};

let loadTiers = [
  {
    id: "tier-1",
    facility_id: "SG-ACC-01",
    tier: "Tier 01",
    asset_id: "LOAD-T1",
    label: "Critical Life Support",
    description: "ICU, Operation Theatres, Emergency Trauma & Vaccine Storage",
    state: "100% Protected",
    status: "healthy" as const,
    allocation_kw: 30.4,
  },
  {
    id: "tier-2",
    facility_id: "SG-ACC-01",
    tier: "Tier 02",
    asset_id: "LOAD-T2",
    label: "Clinical Support & Imaging",
    description: "Radiology, Inpatient Wards, Nurse Stations & Diagnostic Labs",
    state: "Guaranteed Supply",
    status: "healthy" as const,
    allocation_kw: 13.8,
  },
  {
    id: "tier-3",
    facility_id: "SG-ACC-01",
    tier: "Tier 03",
    asset_id: "LOAD-T3",
    label: "Deferrable Utilities",
    description: "Facility HVAC, Kitchen, Commercial Water Heating & Admin",
    state: "Curtailable / Peak Shaving",
    status: "watch" as const,
    allocation_kw: 7.0,
  },
];

let alerts = [
  {
    id: "alert-1",
    facility_id: "SG-ACC-01",
    title: "Grid Voltage Fluctuation Detected",
    detail: "Substation feeder showed 4.2% dip; EMS seamlessly buffered critical loads with BESS inverter in 12ms.",
    occurred_at: "10 mins ago",
    time: "10 mins ago",
    state: "watch" as const,
    site: "Apollo Care Campus",
    status: "Open" as "Open" | "Acknowledged",
    asset_id: "GRID-01",
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "alert-2",
    facility_id: "SG-ACC-01",
    title: "Solar Tracker-01 Azimuth Sync Optimized",
    detail: "Closed-loop angle tracking adjusted +1.4° tilt for peak midday irradiance capture.",
    occurred_at: "28 mins ago",
    time: "28 mins ago",
    state: "healthy" as const,
    site: "Apollo Care Campus",
    status: "Acknowledged" as "Open" | "Acknowledged",
    asset_id: "PV-01",
    created_at: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: "alert-3",
    facility_id: "SG-ACC-01",
    title: "BESS State-of-Charge High Reserve Locked",
    detail: "Battery SOC reached 78%. Reserve capacity allocated to maintain ICU ventilator bank for 6.2 hours in case of outage.",
    occurred_at: "1 hour ago",
    time: "1 hour ago",
    state: "healthy" as const,
    site: "Apollo Care Campus",
    status: "Acknowledged" as "Open" | "Acknowledged",
    asset_id: "BESS-01",
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

let meteringRecords = [
  {
    id: "meter-1",
    facility_id: "SG-ACC-01",
    metric: "Solar Generation (Gross Export / Local Use)",
    current_value: "384.2 kWh",
    reference_value: "Target: > 350 kWh",
    status: "Compliant",
    source: "Bi-directional Smart Meter #01",
  },
  {
    id: "meter-2",
    facility_id: "SG-ACC-01",
    metric: "Grid Import Energy",
    current_value: "96.4 kWh",
    reference_value: "Target: < 150 kWh",
    status: "Optimal",
    source: "MSEDCL Utility Main Feeder Meter",
  },
  {
    id: "meter-3",
    facility_id: "SG-ACC-01",
    metric: "Avoided Carbon Emissions",
    current_value: "312.8 kg CO2e",
    reference_value: "CEA Emission Factor 0.82",
    status: "Verified",
    source: "Statutory GHG Protocol Standard",
  },
  {
    id: "meter-4",
    facility_id: "SG-ACC-01",
    metric: "Peak Power Factor",
    current_value: "0.98 lagging",
    reference_value: "MERC Statutory Min: 0.95",
    status: "High Efficiency",
    source: "Digital EMS Power Quality Bus",
  },
  {
    id: "meter-5",
    facility_id: "SG-ACC-01",
    metric: "Net Avoided Grid Cost (TOD Tariff)",
    current_value: "₹ 3,480.00",
    reference_value: "Peak Rate: ₹8.40/kWh",
    status: "Realized",
    source: "MERC TOD Tariff Rate Matrix",
  },
];

export type PriorityLevel = "CRITICAL" | "HIGH" | "NORMAL" | "NON-CRITICAL";
export type LoadStatus = "Protected" | "Active" | "Curtailable" | "Standby" | "Shed";
export type EnergySourceType = "Solar + Battery" | "Grid Protected" | "BESS Reserve" | "Hybrid Priority";
export type ProtectionStatus = "100% Protected" | "Guaranteed" | "Curtailable" | "Shed";

export interface HospitalLoadRecord {
  id: string;
  facility_id: string;
  building: string;
  floor: string;
  department: string;
  room: string;
  equipment_name: string;
  current_kw: number;
  rated_kw: number;
  priority: PriorityLevel;
  status: LoadStatus;
  source: EnergySourceType;
  protection_status: ProtectionStatus;
  updated_at: string;
}

export interface LoadAuditLogRecord {
  id: string;
  facility_id: string;
  timestamp: string;
  operator: string;
  load_id: string;
  load_name: string;
  previous_priority: PriorityLevel;
  new_priority: PriorityLevel;
  reason: string;
}

let hospitalLoads: HospitalLoadRecord[] = [
  {
    id: "load-icu-01",
    facility_id: "SG-ACC-01",
    building: "Main Clinical Block",
    floor: "Floor 3",
    department: "Intensive Care Unit (ICU)",
    room: "ICU-01",
    equipment_name: "Ventilator Bank & Invasive Monitor 01",
    current_kw: 2.8,
    rated_kw: 3.5,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-icu-02",
    facility_id: "SG-ACC-01",
    building: "Main Clinical Block",
    floor: "Floor 3",
    department: "Intensive Care Unit (ICU)",
    room: "ICU-02",
    equipment_name: "Ventilator Bank & Infusion Array 02",
    current_kw: 2.4,
    rated_kw: 3.2,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-icu-03",
    facility_id: "SG-ACC-01",
    building: "Main Clinical Block",
    floor: "Floor 3",
    department: "Intensive Care Unit (ICU)",
    room: "ICU Central",
    equipment_name: "Central Life Support Power Bus",
    current_kw: 5.2,
    rated_kw: 6.0,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
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
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-ot-02",
    facility_id: "SG-ACC-01",
    building: "Surgical Wing",
    floor: "Floor 2",
    department: "Operation Theatre (OT)",
    room: "OT Suite 02",
    equipment_name: "Laparoscopic Surgical Tower & Electrosurgery",
    current_kw: 4.2,
    rated_kw: 5.0,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
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
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-emg-02",
    facility_id: "SG-ACC-01",
    building: "Emergency Pavilion",
    floor: "Ground Floor",
    department: "Emergency & Trauma",
    room: "Triage Bay 02",
    equipment_name: "High-Flow Oxygen Concentrator",
    current_kw: 2.7,
    rated_kw: 3.5,
    priority: "HIGH" as const,
    status: "Active" as const,
    source: "Solar + Battery" as const,
    protection_status: "Guaranteed" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-cold-01",
    facility_id: "SG-ACC-01",
    building: "Pharmacy & Labs",
    floor: "Basement 1",
    department: "Vaccine & Blood Storage",
    room: "Cold Room 01",
    equipment_name: "Ultra-Low Temperature (-86°C) Vaccine Freezers",
    current_kw: 5.0,
    rated_kw: 6.0,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-cold-02",
    facility_id: "SG-ACC-01",
    building: "Pharmacy & Labs",
    floor: "Basement 1",
    department: "Vaccine & Blood Storage",
    room: "Blood Bank 02",
    equipment_name: "Refrigerated Plasma & Platelet Agitators",
    current_kw: 2.7,
    rated_kw: 3.2,
    priority: "CRITICAL" as const,
    status: "Protected" as const,
    source: "Solar + Battery" as const,
    protection_status: "100% Protected" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-rad-01",
    facility_id: "SG-ACC-01",
    building: "Diagnostic Wing",
    floor: "Ground Floor",
    department: "Radiology & Imaging",
    room: "MRI Standby",
    equipment_name: "MRI Cryocooler Compressor Loop",
    current_kw: 5.5,
    rated_kw: 7.0,
    priority: "HIGH" as const,
    status: "Active" as const,
    source: "Grid Protected" as const,
    protection_status: "Guaranteed" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-wrd-01",
    facility_id: "SG-ACC-01",
    building: "Inpatient Pavilion",
    floor: "Floor 4",
    department: "General Inpatient Wards",
    room: "Ward Block 4A",
    equipment_name: "Ward Lighting, Bedside Telemetry & Medical Air",
    current_kw: 4.2,
    rated_kw: 5.5,
    priority: "NORMAL" as const,
    status: "Active" as const,
    source: "Hybrid Priority" as const,
    protection_status: "Curtailable" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-wrd-02",
    facility_id: "SG-ACC-01",
    building: "Inpatient Pavilion",
    floor: "Floor 5",
    department: "General Inpatient Wards",
    room: "Ward Block 5B",
    equipment_name: "Floor HVAC Air Handlers & Nurse Station",
    current_kw: 3.4,
    rated_kw: 4.8,
    priority: "NORMAL" as const,
    status: "Active" as const,
    source: "Hybrid Priority" as const,
    protection_status: "Curtailable" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-adm-01",
    facility_id: "SG-ACC-01",
    building: "Administration Wing",
    floor: "Floor 1",
    department: "Facility Utilities",
    room: "Kitchen & Laundry",
    equipment_name: "Commercial Dishwasher & Water Heating Pumps",
    current_kw: 3.2,
    rated_kw: 6.0,
    priority: "NON-CRITICAL" as const,
    status: "Curtailable" as const,
    source: "Hybrid Priority" as const,
    protection_status: "Curtailable" as const,
    updated_at: new Date().toISOString(),
  },
  {
    id: "load-adm-02",
    facility_id: "SG-ACC-01",
    building: "Administration Wing",
    floor: "Floor 1",
    department: "Administration",
    room: "Records & Billing",
    equipment_name: "Workstations & Auxiliary Air Conditioning",
    current_kw: 1.8,
    rated_kw: 3.0,
    priority: "NON-CRITICAL" as const,
    status: "Curtailable" as const,
    source: "Hybrid Priority" as const,
    protection_status: "Curtailable" as const,
    updated_at: new Date().toISOString(),
  },
];

let loadAuditLogs: LoadAuditLogRecord[] = [
  {
    id: "audit-1",
    facility_id: "SG-ACC-01",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    operator: "Dr. A. Sharma (Chief Medical Officer)",
    load_id: "load-ot-02",
    load_name: "OT Suite 02 — Laparoscopic Tower",
    previous_priority: "HIGH" as const,
    new_priority: "CRITICAL" as const,
    reason: "Emergency neurosurgery scheduled during grid peak period",
  },
  {
    id: "audit-2",
    facility_id: "SG-ACC-01",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    operator: "R. Mehta (Lead Electrical Engineer)",
    load_id: "load-cold-01",
    load_name: "Cold Room 01 — Vaccine Ultra-Low Freezers",
    previous_priority: "HIGH" as const,
    new_priority: "CRITICAL" as const,
    reason: "WHO cold-chain certification compliance mandatory lock",
  },
  {
    id: "audit-3",
    facility_id: "SG-ACC-01",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    operator: "S. Kulkarni (Facilities Supervisor)",
    load_id: "load-adm-01",
    load_name: "Kitchen & Laundry — Water Heating",
    previous_priority: "NORMAL" as const,
    new_priority: "NON-CRITICAL" as const,
    reason: "Automated peak shaving policy enforcement",
  },
];

let emergencyModeState = {
  id: "current_state",
  facility_id: "SG-ACC-01",
  is_active: false,
  activated_at: null as string | null,
  activated_by: null as string | null,
  mode_label: "Standard Operations Mode",
  updated_at: new Date().toISOString(),
};

let energySharingSummary = {
  id: "summary-01",
  facility_id: "SG-ACC-01",
  available_energy_kwh: 142.8,
  energy_shared_kwh: 384.5,
  energy_received_kwh: 96.2,
  credit_balance_kwh: 124.5,
  credit_rate_inr_per_kwh: 6.8,
  credits_earned: 42,
  total_earnings_inr: 18450.0,
  today_earnings_inr: 2614.0,
  pending_earnings_inr: 1088.0,
  avg_selling_rate_inr: 6.8,
  avg_buying_rate_inr: 6.35,
  avoided_cost_inr: 34820.0,
  total_energy_sold_kwh: 2713.2,
  sharing_status: "Active Sharing" as const,
  updated_at: new Date().toISOString(),
};

let energyPeers = [
  {
    id: "peer-01",
    name: "Apollo Clinical Annex (Wing B)",
    type: "hospital_wing" as const,
    distance_km: 0.3,
    demand_status: "High Demand" as const,
    available_capacity_kwh: 45.0,
    current_rate_inr: 7.1,
    updated_at: new Date().toISOString(),
  },
  {
    id: "peer-02",
    name: "Pune Municipal Primary Health Substation",
    type: "clinic" as const,
    distance_km: 1.2,
    demand_status: "Critical" as const,
    available_capacity_kwh: 60.0,
    current_rate_inr: 7.4,
    updated_at: new Date().toISOString(),
  },
  {
    id: "peer-03",
    name: "District Vaccine Cold Storage Hub",
    type: "storage_facility" as const,
    distance_km: 2.1,
    demand_status: "Balanced" as const,
    available_capacity_kwh: 80.0,
    current_rate_inr: 6.8,
    updated_at: new Date().toISOString(),
  },
  {
    id: "peer-04",
    name: "West Feeder Microgrid Bus #04",
    type: "microgrid_feeder" as const,
    distance_km: 0.8,
    demand_status: "Surplus" as const,
    available_capacity_kwh: 120.0,
    current_rate_inr: 6.5,
    updated_at: new Date().toISOString(),
  },
];

let energyTransactions = [
  {
    id: "tx-1",
    facility_id: "SG-ACC-01",
    type: "Sold" as const,
    amount_kwh: 35.0,
    rate_inr: 7.1,
    total_amount_inr: 248.5,
    status: "Completed" as const,
    peer_entity: "Apollo Clinical Annex (Wing B)",
    notes: "Surplus dispatch during morning peak",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "tx-2",
    facility_id: "SG-ACC-01",
    type: "Shared" as const,
    amount_kwh: 20.0,
    rate_inr: 6.8,
    total_amount_inr: 136.0,
    status: "Completed" as const,
    peer_entity: "District Vaccine Cold Storage Hub",
    notes: "Critical cold-chain emergency support credit",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "tx-3",
    facility_id: "SG-ACC-01",
    type: "Sold" as const,
    amount_kwh: 50.0,
    rate_inr: 7.4,
    total_amount_inr: 370.0,
    status: "Settled" as const,
    peer_entity: "Pune Municipal Primary Health Substation",
    notes: "Automated peak shaving trade",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "tx-4",
    facility_id: "SG-ACC-01",
    type: "Received" as const,
    amount_kwh: 15.0,
    rate_inr: 6.5,
    total_amount_inr: 97.5,
    status: "Completed" as const,
    peer_entity: "West Feeder Microgrid Bus #04",
    notes: "Night reserve top-up",
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: "tx-5",
    facility_id: "SG-ACC-01",
    type: "Bought" as const,
    amount_kwh: 25.0,
    rate_inr: 6.6,
    total_amount_inr: 165.0,
    status: "Completed" as const,
    peer_entity: "West Feeder Microgrid Bus #04",
    notes: "Pre-storm reserve buffer acquisition",
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

// ============================================================================
// API Endpoints
// ============================================================================

// Health
apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    facility: "SG-ACC-01",
    service: "SolarGrid Unified EMS Backend",
    timestamp: new Date().toISOString(),
  });
});

// Facility
apiRouter.get("/facility", (_req: Request, res: Response) => {
  res.json({
    id: "SG-ACC-01",
    name: "Apollo Care Campus",
    code: "SG-ACC-01",
    location: "Pune · Maharashtra",
    timezone: "Asia/Kolkata",
  });
});

// Telemetry
apiRouter.get("/telemetry", (_req: Request, res: Response) => {
  // Update timestamp to keep it live
  currentTelemetry.timestamp = new Date().toISOString();
  res.json(currentTelemetry);
});

apiRouter.post("/telemetry", (req: Request, res: Response) => {
  currentTelemetry = {
    ...currentTelemetry,
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  res.status(201).json(currentTelemetry);
});

// Energy History
apiRouter.get("/energy-history", (_req: Request, res: Response) => {
  res.json(energyHistory);
});

apiRouter.post("/energy-history", (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    energyHistory = req.body;
  } else {
    energyHistory.push(req.body);
  }
  res.status(201).json(energyHistory);
});

// Operating Mode
apiRouter.get("/operating-mode", (_req: Request, res: Response) => {
  res.json(operatingState);
});

apiRouter.post("/operating-mode", (req: Request, res: Response) => {
  operatingState = {
    ...operatingState,
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  res.json(operatingState);
});

// Forecast
apiRouter.get("/forecast", (_req: Request, res: Response) => {
  res.json(forecastData);
});

apiRouter.post("/forecast", (req: Request, res: Response) => {
  forecastData = {
    ...forecastData,
    ...req.body,
  };
  res.json(forecastData);
});

// Optimization
apiRouter.get("/optimization", (_req: Request, res: Response) => {
  res.json(optimizationDecision);
});

apiRouter.post("/optimization", (req: Request, res: Response) => {
  optimizationDecision = {
    ...optimizationDecision,
    ...req.body,
    created_at: new Date().toISOString(),
  };
  res.json(optimizationDecision);
});

// Priority Dispatch / Load Tiers
apiRouter.get("/priority-dispatch", (_req: Request, res: Response) => {
  res.json(loadTiers);
});

apiRouter.get("/load-tiers", (_req: Request, res: Response) => {
  res.json(loadTiers);
});

// Metering
apiRouter.get("/metering", (_req: Request, res: Response) => {
  res.json(meteringRecords);
});

// Alerts
apiRouter.get("/alerts", (_req: Request, res: Response) => {
  res.json(alerts);
});

apiRouter.post("/alerts", (req: Request, res: Response) => {
  const newAlert = {
    id: `alert-${Date.now()}`,
    facility_id: "SG-ACC-01",
    title: req.body.title || "System Alert",
    detail: req.body.detail || "",
    occurred_at: "Just now",
    time: "Just now",
    state: req.body.state || "watch",
    site: "Apollo Care Campus",
    status: req.body.status || "Open",
    asset_id: req.body.asset_id || "EMS-01",
    created_at: new Date().toISOString(),
  };
  alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

apiRouter.patch("/alerts/:id/acknowledge", (req: Request, res: Response) => {
  const { id } = req.params;
  const alertIndex = alerts.findIndex((a) => a.id === id || String(a.id) === String(id));
  if (alertIndex >= 0) {
    alerts[alertIndex].status = "Acknowledged";
    return res.json(alerts[alertIndex]);
  }
  res.status(404).json({ error: "Alert not found" });
});

// Hospital Loads
apiRouter.get("/hospital-loads", (_req: Request, res: Response) => {
  res.json(hospitalLoads);
});

apiRouter.put("/hospital-loads/:id/priority", (req: Request, res: Response) => {
  const { id } = req.params;
  const { priority, reason, operator } = req.body;

  const loadIndex = hospitalLoads.findIndex((l) => l.id === id);
  if (loadIndex < 0) {
    return res.status(404).json({ error: `Load ${id} not found` });
  }

  const prevPriority = hospitalLoads[loadIndex].priority;
  hospitalLoads[loadIndex] = {
    ...hospitalLoads[loadIndex],
    priority,
    status: priority === "CRITICAL" ? "Protected" : "Active",
    protection_status:
      priority === "CRITICAL"
        ? "100% Protected"
        : priority === "HIGH"
        ? "Guaranteed"
        : "Curtailable",
    updated_at: new Date().toISOString(),
  };

  const auditEntry = {
    id: `audit-${Date.now()}`,
    facility_id: "SG-ACC-01",
    timestamp: new Date().toISOString(),
    operator: operator || "Authorized Clinical Operator",
    load_id: id,
    load_name: hospitalLoads[loadIndex].equipment_name,
    previous_priority: prevPriority,
    new_priority: priority,
    reason: reason || "Manual priority adjustment",
  };

  loadAuditLogs.unshift(auditEntry);

  res.json({
    load: hospitalLoads[loadIndex],
    audit: auditEntry,
  });
});

// Load Audit Logs
apiRouter.get("/load-audit-logs", (_req: Request, res: Response) => {
  res.json(loadAuditLogs);
});

// Emergency Mode
apiRouter.get("/emergency-mode", (_req: Request, res: Response) => {
  res.json(emergencyModeState);
});

apiRouter.post("/emergency-mode", (req: Request, res: Response) => {
  const { is_active, operator, reason } = req.body;

  emergencyModeState = {
    id: "current_state",
    facility_id: "SG-ACC-01",
    is_active: Boolean(is_active),
    activated_at: is_active ? new Date().toISOString() : null,
    activated_by: is_active ? operator || "Chief Medical Director" : null,
    mode_label: is_active
      ? "Emergency Critical Load Preservation Mode"
      : "Standard Operations Mode",
    updated_at: new Date().toISOString(),
  };

  if (is_active) {
    operatingState = {
      ...operatingState,
      mode: "Emergency Watch",
      flow_state: "high-demand",
      mode_detail: "EMERGENCY LOAD PRESERVATION ACTIVE — Curtailing non-critical loads to protect ICU",
      updated_at: new Date().toISOString(),
    };
  } else {
    operatingState = {
      ...operatingState,
      mode: "Self-Powered",
      flow_state: "normal",
      mode_detail: "Solar + BESS supplying priority clinical feeders; grid in hot standby",
      updated_at: new Date().toISOString(),
    };
  }

  res.json(emergencyModeState);
});

// Energy Sharing
apiRouter.get("/energy-sharing/summary", (_req: Request, res: Response) => {
  res.json(energySharingSummary);
});

apiRouter.get("/energy-sharing/peers", (_req: Request, res: Response) => {
  res.json(energyPeers);
});

apiRouter.get("/energy-sharing/transactions", (_req: Request, res: Response) => {
  res.json(energyTransactions);
});

apiRouter.post("/energy-sharing/transactions", (req: Request, res: Response) => {
  const { type, amount_kwh, rate_inr, total_amount_inr, peer_entity, notes } = req.body;

  if (!amount_kwh || amount_kwh <= 0) {
    return res.status(400).json({ error: "Invalid energy quantity" });
  }

  const tx = {
    id: `tx-${Date.now()}`,
    facility_id: "SG-ACC-01",
    type: type || "Sold",
    amount_kwh: Number(amount_kwh),
    rate_inr: Number(rate_inr || 6.8),
    total_amount_inr: Number(total_amount_inr || amount_kwh * (rate_inr || 6.8)),
    status: "Completed" as const,
    peer_entity: peer_entity || "Microgrid Peer Feeder",
    notes: notes || "P2P SolarGrid trade",
    created_at: new Date().toISOString(),
  };

  energyTransactions.unshift(tx);

  if (type === "Sold" || type === "Shared") {
    energySharingSummary.available_energy_kwh = Math.max(
      0,
      Number((energySharingSummary.available_energy_kwh - amount_kwh).toFixed(1))
    );
    energySharingSummary.energy_shared_kwh = Number(
      (energySharingSummary.energy_shared_kwh + amount_kwh).toFixed(1)
    );
    energySharingSummary.total_energy_sold_kwh = Number(
      (energySharingSummary.total_energy_sold_kwh + amount_kwh).toFixed(1)
    );
    energySharingSummary.today_earnings_inr = Number(
      (energySharingSummary.today_earnings_inr + tx.total_amount_inr).toFixed(2)
    );
    energySharingSummary.total_earnings_inr = Number(
      (energySharingSummary.total_earnings_inr + tx.total_amount_inr).toFixed(2)
    );
    energySharingSummary.credits_earned += Math.max(1, Math.round(amount_kwh / 5));
  } else if (type === "Bought" || type === "Received") {
    energySharingSummary.energy_received_kwh = Number(
      (energySharingSummary.energy_received_kwh + amount_kwh).toFixed(1)
    );
    energySharingSummary.credit_balance_kwh = Number(
      (energySharingSummary.credit_balance_kwh + amount_kwh).toFixed(1)
    );
  }

  energySharingSummary.updated_at = new Date().toISOString();

  res.status(201).json({
    transaction: tx,
    summary: energySharingSummary,
  });
});

apiRouter.post("/energy-sharing/sell", (req: Request, res: Response) => {
  const { amount_kwh, peer_id, rate_inr } = req.body;
  const peer = energyPeers.find((p) => p.id === peer_id) || energyPeers[0];
  const rate = rate_inr || peer.current_rate_inr || 6.8;
  const total = Number((amount_kwh * rate).toFixed(2));

  const tx = {
    id: `tx-${Date.now()}`,
    facility_id: "SG-ACC-01",
    type: "Sold" as const,
    amount_kwh: Number(amount_kwh),
    rate_inr: rate,
    total_amount_inr: total,
    status: "Completed" as const,
    peer_entity: peer.name,
    notes: `Surplus solar dispatch to ${peer.name}`,
    created_at: new Date().toISOString(),
  };

  energyTransactions.unshift(tx);
  energySharingSummary.available_energy_kwh = Math.max(
    0,
    Number((energySharingSummary.available_energy_kwh - amount_kwh).toFixed(1))
  );
  energySharingSummary.total_energy_sold_kwh = Number(
    (energySharingSummary.total_energy_sold_kwh + amount_kwh).toFixed(1)
  );
  energySharingSummary.today_earnings_inr = Number(
    (energySharingSummary.today_earnings_inr + total).toFixed(2)
  );
  energySharingSummary.updated_at = new Date().toISOString();

  res.status(201).json({ transaction: tx, summary: energySharingSummary });
});

apiRouter.post("/energy-sharing/request", (req: Request, res: Response) => {
  const { amount_kwh, peer_id, priority_tier } = req.body;
  const peer = energyPeers.find((p) => p.id === peer_id) || energyPeers[0];
  const rate = peer.current_rate_inr || 6.6;
  const total = Number((amount_kwh * rate).toFixed(2));

  const tx = {
    id: `tx-${Date.now()}`,
    facility_id: "SG-ACC-01",
    type: "Bought" as const,
    amount_kwh: Number(amount_kwh),
    rate_inr: rate,
    total_amount_inr: total,
    status: "Completed" as const,
    peer_entity: peer.name,
    notes: `Energy import request for ${priority_tier || "Critical Load Protection"}`,
    created_at: new Date().toISOString(),
  };

  energyTransactions.unshift(tx);
  energySharingSummary.energy_received_kwh = Number(
    (energySharingSummary.energy_received_kwh + amount_kwh).toFixed(1)
  );
  energySharingSummary.credit_balance_kwh = Number(
    (energySharingSummary.credit_balance_kwh + amount_kwh).toFixed(1)
  );
  energySharingSummary.updated_at = new Date().toISOString();

  res.status(201).json({ transaction: tx, summary: energySharingSummary });
});
