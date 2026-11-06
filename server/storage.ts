import type {
  Facility,
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
  HospitalCampusProfile,
  HospitalDepartment,
  HospitalRoom,
  RoomPriority,
} from "../client/src/data/types.js";

export interface SimulationScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  gridAvailable: boolean;
  solarMultiplier: number;
  demandMultiplier: number;
  batterySocPercent: number;
  recommendedMode: string;
}

class Storage {
  private facility: Facility = {
    id: "SG-ACC-01",
    name: "Apollo Care Campus",
    code: "SG-ACC-01",
    location: "Pune · Maharashtra, India",
    timezone: "Asia/Kolkata",
  };

  private telemetry: TelemetryReading = {
    id: "telemetry-latest",
    facility_id: "SG-ACC-01",
    timestamp: new Date().toISOString(),
    solar_generation_kw: 42.5,
    solar_irradiance_wm2: 820,
    total_load_kw: 51.2,
    critical_load_kw: 30.4,
    tier2_load_kw: 13.8,
    tier3_load_kw: 7.0,
    battery_soc_percent: 78,
    battery_charge_kw: 8.4,
    battery_discharge_kw: null,
    grid_import_kw: 12.3,
    grid_export_kw: null,
    grid_connected: true,
    estimated_savings_inr: 1240,
    renewable_share_percent: 83,
    solar_utilization_percent: 94,
  };

  private energyHistory: EnergyHistoryPoint[] = [
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

  private operatingMode: OperatingModeRecord = {
    id: "mode-01",
    facility_id: "SG-ACC-01",
    mode: "Self-Powered",
    flow_state: "normal",
    mode_detail: "Solar + BESS supplying priority clinical feeders; grid in hot standby",
    updated_at: new Date().toISOString(),
  };

  private forecast: ForecastData = {
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

  private optimization: OptimizationDecision = {
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
    status: "staged",
    created_at: new Date().toISOString(),
  };

  private loadTiers: LoadTier[] = [
    {
      id: "tier-1",
      facility_id: "SG-ACC-01",
      tier: "Tier 01",
      asset_id: "LOAD-T1",
      label: "Critical Life Support",
      description: "ICU, Operation Theatres, Emergency Trauma & Vaccine Storage",
      state: "100% Protected",
      status: "healthy",
      allocation_kw: 30.4,
    },
    {
      id: "tier-2",
      facility_id: "SG-ACC-01",
      tier: "Tier 02",
      asset_id: "LOAD-T2",
      label: "Essential Diagnostics",
      description: "Pathology Labs, Radiology Imaging & Blood Bank",
      state: "Active Optimization",
      status: "healthy",
      allocation_kw: 13.8,
    },
    {
      id: "tier-3",
      facility_id: "SG-ACC-01",
      tier: "Tier 03",
      asset_id: "LOAD-T3",
      label: "Non-Critical Deferrable",
      description: "Administrative Wing, Sterilization Autoclaves & Laundry",
      state: "Curtailable on Demand",
      status: "watch",
      allocation_kw: 7.0,
    },
  ];

  private metering: MeteringRecord[] = [
    {
      id: "meter-01",
      facility_id: "SG-ACC-01",
      metric: "Total Harmonic Distortion (THD-V)",
      current_value: "1.42%",
      reference_value: "< 3.00% (IEEE 519)",
      status: "Normal",
      source: "Main Feeder Power Analyzer",
    },
    {
      id: "meter-02",
      facility_id: "SG-ACC-01",
      metric: "Power Factor (Leading/Lagging)",
      current_value: "0.985 Lag",
      reference_value: "0.950 - 1.000",
      status: "Optimal",
      source: "APFC Relay Controller",
    },
    {
      id: "meter-03",
      facility_id: "SG-ACC-01",
      metric: "Grid Frequency",
      current_value: "50.02 Hz",
      reference_value: "49.90 - 50.05 Hz",
      status: "Synchronized",
      source: "Grid Interconnection Substation",
    },
    {
      id: "meter-04",
      facility_id: "SG-ACC-01",
      metric: "Critical 415V Bus Voltage",
      current_value: "414.8 V",
      reference_value: "415.0 V ± 2.5%",
      status: "Normal",
      source: "Medical Isolation Bus Transformer",
    },
    {
      id: "meter-05",
      facility_id: "SG-ACC-01",
      metric: "Inverter Conversion Efficiency",
      current_value: "98.2%",
      reference_value: "> 97.5%",
      status: "High Efficiency",
      source: "Central Solar Inverter String 1-4",
    },
    {
      id: "meter-06",
      facility_id: "SG-ACC-01",
      metric: "BESS Round-Trip Efficiency",
      current_value: "92.6%",
      reference_value: "> 90.0%",
      status: "Healthy",
      source: "BESS BMS Master Unit",
    },
  ];

  private alerts: AlertRecord[] = [
    {
      id: "1",
      facility_id: "SG-ACC-01",
      title: "Grid Voltage Deviation",
      detail: "Phase B voltage dipped to 214V (-7%) for 820ms. Inverter ride-through stabilized critical bus without disturbance.",
      time: "10:42 AM",
      state: "watch",
      site: "Apollo Care Campus",
      status: "Open",
      asset_id: "GRID-INT-01",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      facility_id: "SG-ACC-01",
      title: "Solar Generation Surge Expected",
      detail: "Peak irradiance window at 12:30 PM. Excess generation (+14 kW) scheduled to charge BESS to 95%.",
      time: "10:15 AM",
      state: "healthy",
      site: "Apollo Care Campus",
      status: "Acknowledged",
      asset_id: "PV-ARRAY-CENTRAL",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "3",
      facility_id: "SG-ACC-01",
      title: "Tier 3 Load Curtailment Staged",
      detail: "Laundry & Administrative HVAC throttled by 3.2 kW to preserve battery reserve above 75% for evening surgery schedule.",
      time: "09:30 AM",
      state: "watch",
      site: "Apollo Care Campus",
      status: "Acknowledged",
      asset_id: "LOAD-T3-HVAC",
      created_at: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  private hospitalLoads: HospitalLoad[] = [
    {
      id: "load-icu-01",
      facility_id: "SG-ACC-01",
      building: "Main Hospital Wing A",
      floor: "Level 3",
      department: "Intensive Care Unit (ICU)",
      room: "ICU Pod Alpha (Beds 1-8)",
      equipment_name: "Central Ventilators & Patient Monitoring Array",
      current_kw: 12.4,
      rated_kw: 15.0,
      priority: "CRITICAL",
      status: "Protected",
      source: "Solar + Battery",
      protection_status: "100% Protected",
      updated_at: new Date().toISOString(),
    },
    {
      id: "load-ot-01",
      facility_id: "SG-ACC-01",
      building: "Main Hospital Wing A",
      floor: "Level 4",
      department: "Operation Theatres",
      room: "Hybrid Cardiac OR Suite 1",
      equipment_name: "Heart-Lung Bypass, C-Arm & Surgical Lights",
      current_kw: 18.0,
      rated_kw: 22.0,
      priority: "CRITICAL",
      status: "Protected",
      source: "Solar + Battery",
      protection_status: "100% Protected",
      updated_at: new Date().toISOString(),
    },
    {
      id: "load-cath-01",
      facility_id: "SG-ACC-01",
      building: "Diagnostic Block B",
      floor: "Level 1",
      department: "Cardiology",
      room: "Cath Lab 1",
      equipment_name: "Digital Angiography System & Hemodynamic Monitor",
      current_kw: 8.5,
      rated_kw: 14.0,
      priority: "HIGH",
      status: "Active",
      source: "Hybrid Priority",
      protection_status: "Guaranteed",
      updated_at: new Date().toISOString(),
    },
    {
      id: "load-mri-01",
      facility_id: "SG-ACC-01",
      building: "Diagnostic Block B",
      floor: "Basement 1",
      department: "Radiology",
      room: "MRI Suite",
      equipment_name: "3.0 Tesla Superconducting MRI Cryocooler & Gradient Amp",
      current_kw: 14.2,
      rated_kw: 28.0,
      priority: "NORMAL",
      status: "Active",
      source: "Grid Protected",
      protection_status: "Curtailable",
      updated_at: new Date().toISOString(),
    },
    {
      id: "load-freezer-01",
      facility_id: "SG-ACC-01",
      building: "Services Block C",
      floor: "Ground Floor",
      department: "Blood Bank & Pharmacy",
      room: "Cold Storage Room 1",
      equipment_name: "-80°C Ultra-Low Freezers & Vaccine Storage Banks",
      current_kw: 4.8,
      rated_kw: 6.0,
      priority: "CRITICAL",
      status: "Protected",
      source: "BESS Reserve",
      protection_status: "100% Protected",
      updated_at: new Date().toISOString(),
    },
    {
      id: "load-hvac-admin",
      facility_id: "SG-ACC-01",
      building: "Administrative Block D",
      floor: "Level 2",
      department: "Facility Services",
      room: "Air Handling Unit AHU-4",
      equipment_name: "Admin Wing Central Chiller & Variable Air Volume",
      current_kw: 7.0,
      rated_kw: 18.0,
      priority: "NON-CRITICAL",
      status: "Curtailable",
      source: "Grid Protected",
      protection_status: "Curtailable",
      updated_at: new Date().toISOString(),
    },
  ];

  private loadAuditLogs: LoadAuditLog[] = [
    {
      id: "audit-01",
      facility_id: "SG-ACC-01",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      operator: "Dr. A. Sharma (Chief Medical Officer)",
      load_id: "load-ot-01",
      load_name: "Hybrid Cardiac OR Suite 1",
      previous_priority: "HIGH",
      new_priority: "CRITICAL",
      reason: "Emergency aortic dissection repair procedure booked. Protocol P0 lock engaged.",
    },
    {
      id: "audit-02",
      facility_id: "SG-ACC-01",
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      operator: "R. Kulkarni (Lead Electrical Engineer)",
      load_id: "load-hvac-admin",
      load_name: "Admin Wing Central Chiller & AHU-4",
      previous_priority: "NORMAL",
      new_priority: "NON-CRITICAL",
      reason: "Automated peak-shaving curtailment scheduled during solar-to-battery transition.",
    },
  ];

  private emergencyMode: EmergencyModeState = {
    is_active: false,
    activated_at: null,
    activated_by: null,
    mode_label: "Standard Operations Mode",
  };

  private energySharingSummary: EnergySharingSummary = {
    id: "ess-01",
    facility_id: "SG-ACC-01",
    available_energy_kwh: 48.5,
    energy_shared_kwh: 142.0,
    energy_received_kwh: 24.5,
    credit_balance_kwh: 117.5,
    credit_rate_inr_per_kwh: 8.5,
    credits_earned: 998,
    total_earnings_inr: 1207,
    today_earnings_inr: 412,
    pending_earnings_inr: 185,
    avg_selling_rate_inr: 8.5,
    avg_buying_rate_inr: 9.2,
    avoided_cost_inr: 680,
    total_energy_sold_kwh: 142,
    sharing_status: "Active Sharing",
    updated_at: new Date().toISOString(),
  };

  private energyPeers: EnergyPeer[] = [
    {
      id: "peer-onco",
      name: "Apollo Oncology Center",
      type: "hospital_wing",
      distance_km: 0.8,
      demand_status: "High Demand",
      available_capacity_kwh: 15.0,
      current_rate_inr: 8.5,
    },
    {
      id: "peer-ruby",
      name: "Ruby Hall Clinic Microgrid",
      type: "clinic",
      distance_km: 2.3,
      demand_status: "Surplus",
      available_capacity_kwh: 65.0,
      current_rate_inr: 8.2,
    },
    {
      id: "peer-sahyadri",
      name: "Sahyadri Trauma BESS Hub",
      type: "storage_facility",
      distance_km: 3.1,
      demand_status: "Balanced",
      available_capacity_kwh: 120.0,
      current_rate_inr: 8.75,
    },
    {
      id: "peer-kem",
      name: "KEM Oxygen Refill Station",
      type: "microgrid_feeder",
      distance_km: 1.4,
      demand_status: "Critical",
      available_capacity_kwh: 0,
      current_rate_inr: 9.0,
    },
  ];

  private energyTransactions: EnergyTransaction[] = [
    {
      id: "tx-01",
      facility_id: "SG-ACC-01",
      type: "Sold",
      amount_kwh: 24.0,
      rate_inr: 8.5,
      total_amount_inr: 204.0,
      status: "Settled",
      peer_entity: "Apollo Oncology Center",
      notes: "Surplus rooftop solar dispatched to oncology radiotherapy chillers",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "tx-02",
      facility_id: "SG-ACC-01",
      type: "Shared",
      amount_kwh: 15.0,
      rate_inr: 0,
      total_amount_inr: 0,
      status: "Completed",
      peer_entity: "KEM Oxygen Refill Station",
      notes: "Emergency life-support feeder solidarity transfer during grid sag",
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: "tx-03",
      facility_id: "SG-ACC-01",
      type: "Bought",
      amount_kwh: 24.5,
      rate_inr: 8.2,
      total_amount_inr: 200.9,
      status: "Settled",
      peer_entity: "Ruby Hall Clinic Microgrid",
      notes: "Early morning clean energy balancing before on-site solar ramp",
      created_at: new Date(Date.now() - 28800000).toISOString(),
    },
  ];

  private campuses: HospitalCampusProfile[] = [
    {
      id: "apollo-pune",
      name: "Apollo Care Campus",
      campusCode: "SG-ACC-01",
      location: "Pune · Maharashtra, India",
      totalBeds: 450,
      criticalCareBeds: 84,
      solarCapacityKwp: 250,
      batteryCapacityKwh: 300,
      batteryPowerKw: 120,
      currentMode: "Clinical Priority Dispatch (NABH-Protected)",
      annualSolarGenerationMwh: 382.5,
      gridReliabilityPercent: 96.8,
    },
    {
      id: "aiims-trauma",
      name: "AIIMS Apex Trauma Center",
      campusCode: "SG-ATC-02",
      location: "New Delhi, India",
      totalBeds: 520,
      criticalCareBeds: 112,
      solarCapacityKwp: 320,
      batteryCapacityKwh: 450,
      batteryPowerKw: 180,
      currentMode: "Emergency Watch & Rapid Ride-Through",
      annualSolarGenerationMwh: 495.0,
      gridReliabilityPercent: 98.2,
    },
    {
      id: "fortis-gurgaon",
      name: "Fortis Memorial Research Institute",
      campusCode: "SG-FMRI-03",
      location: "Gurugram · Haryana, India",
      totalBeds: 380,
      criticalCareBeds: 72,
      solarCapacityKwp: 210,
      batteryCapacityKwh: 260,
      batteryPowerKw: 100,
      currentMode: "Self-Powered Solar Priority",
      annualSolarGenerationMwh: 318.0,
      gridReliabilityPercent: 97.4,
    },
  ];

  private departments: HospitalDepartment[] = [
    {
      id: "dept-icu",
      name: "Intensive Care Unit (ICU & CCU)",
      code: "ICU-300",
      building: "Wing A · Clinical Tower",
      floor: "Floor 3",
      clinicalLead: "Dr. Rajesh Sharma, MD (Critical Care)",
      description: "24-bed medical, surgical & cardiac intensive care units requiring 100% uninterruptible power with zero transfer delay.",
      totalRooms: 4,
      currentDemandKw: 14.8,
      minRequiredKw: 12.0,
      energyStatus: "Normal",
      activeAlerts: 0,
      p0Count: 3,
      p1Count: 1,
      p2Count: 0,
      p3Count: 0,
      iconName: "HeartPulse",
    },
    {
      id: "dept-ot",
      name: "Operation Theatre Complex",
      code: "OTC-400",
      building: "Wing A · Clinical Tower",
      floor: "Floor 4",
      clinicalLead: "Dr. Sunita Mehta, MS (Chief of Surgery)",
      description: "6 modular surgical suites including 1 Hybrid Robotic OT and 1 Cardiac Bypass suite with dedicated isolation transformers.",
      totalRooms: 3,
      currentDemandKw: 19.4,
      minRequiredKw: 16.5,
      energyStatus: "Normal",
      activeAlerts: 0,
      p0Count: 2,
      p1Count: 1,
      p2Count: 0,
      p3Count: 0,
      iconName: "ShieldAlert",
    },
    {
      id: "dept-er",
      name: "Emergency & Trauma Resuscitation",
      code: "ED-100",
      building: "Wing B · Ambulatory Care",
      floor: "Floor 1 (Ground Level)",
      clinicalLead: "Dr. Arvind Kulkarni, MD (Emergency Medicine)",
      description: "High-acuity triage bays, resuscitation crash carts, and dedicated rapid-access CT scanning support.",
      totalRooms: 3,
      currentDemandKw: 8.6,
      minRequiredKw: 7.2,
      energyStatus: "Normal",
      activeAlerts: 1,
      p0Count: 1,
      p1Count: 2,
      p2Count: 0,
      p3Count: 0,
      iconName: "Activity",
    },
    {
      id: "dept-diag",
      name: "Diagnostic Imaging & Cath Lab",
      code: "RAD-200",
      building: "Wing B · Ambulatory Care",
      floor: "Basement & Floor 2",
      clinicalLead: "Dr. Priya Nair, MD (Interventional Radiology)",
      description: "Advanced diagnostic equipment with high instantaneous peak demands including 3.0T MRI, 128-slice CT, and Biplane Cath Lab.",
      totalRooms: 3,
      currentDemandKw: 24.2,
      minRequiredKw: 14.0,
      energyStatus: "Normal",
      activeAlerts: 0,
      p0Count: 0,
      p1Count: 2,
      p2Count: 1,
      p3Count: 0,
      iconName: "Zap",
    },
    {
      id: "dept-ward",
      name: "Inpatient General & Step-Down Wards",
      code: "IPW-500",
      building: "Wing C · Patient Pavilion",
      floor: "Floors 5 & 6",
      clinicalLead: "Dr. Vikram Joshi, MD (Internal Medicine)",
      description: "Step-down telemetry beds and comfortable inpatient rooms with non-critical amenity loads curtail-eligible during grid distress.",
      totalRooms: 3,
      currentDemandKw: 6.8,
      minRequiredKw: 3.5,
      energyStatus: "Normal",
      activeAlerts: 0,
      p0Count: 0,
      p1Count: 0,
      p2Count: 2,
      p3Count: 1,
      iconName: "Bed",
    },
    {
      id: "dept-fac",
      name: "Hospital Central Facilities & Data Center",
      code: "FAC-000",
      building: "Service Block & Utility Basement",
      floor: "Basement Levels 1 & 2",
      clinicalLead: "Er. Ramesh Patel (Chief Hospital Engineer)",
      description: "Central medical gas manifolds, HVAC chilled water, pharmacy cold-chain freezers, and hospital HIS server infrastructure.",
      totalRooms: 4,
      currentDemandKw: 10.8,
      minRequiredKw: 8.0,
      energyStatus: "Normal",
      activeAlerts: 0,
      p0Count: 1,
      p1Count: 1,
      p2Count: 1,
      p3Count: 1,
      iconName: "Server",
    },
  ];

  private rooms: HospitalRoom[] = [
    {
      id: "room-icu-alpha",
      name: "ICU Pod Alpha (Beds 01–06)",
      code: "ICU-301",
      departmentId: "dept-icu",
      departmentName: "Intensive Care Unit (ICU)",
      building: "Wing A · Clinical Tower",
      floor: "Floor 3",
      roomType: "Intensive Care Unit (Critical)",
      priority: "P0",
      currentKw: 4.8,
      minRequiredKw: 4.2,
      peakKw: 6.4,
      energyTodayKwh: 92.4,
      energyTrend: "+3.2%",
      backupStatus: "Solar BESS + Dual UPS Online",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "6 / 6 Beds Occupied (100%)",
      clinicalFunction: "Post-cardiac arrest and neurosurgical critical care monitoring",
      authorizedBy: "Dr. Rajesh Sharma, MD",
      equipmentList: [
        {
          id: "eq-icu-vent-01",
          name: "Dräger Evita V800 ICU Ventilators (x6)",
          category: "Life-Support",
          drawKw: 1.8,
          minReqKw: 1.8,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Dual redundant UPS + 120kW BESS Dedicated Feed",
        },
        {
          id: "eq-icu-mon-01",
          name: "Philips IntelliVue MX800 Patient Monitors (x6)",
          category: "Life-Support",
          drawKw: 1.2,
          minReqKw: 1.2,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "UPS-backed isolated medical bus",
        },
        {
          id: "eq-icu-pump-01",
          name: "B. Braun Infusomat Space Syringe Pump Array (x18)",
          category: "Life-Support",
          drawKw: 0.6,
          minReqKw: 0.6,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Internal 6h battery + Hospital Clean Bus",
        },
        {
          id: "eq-icu-hvac-01",
          name: "HEPA Positive-Pressure Air Filtration AHU",
          category: "Facility Infrastructure",
          drawKw: 1.2,
          minReqKw: 0.6,
          status: "Running",
          criticality: "P1 Clinical",
          backupSupply: "Hybrid Solar Priority Circuit",
        },
      ],
      recentAlerts: [],
      recommendations: [
        {
          id: "rec-icu-01",
          title: "Maintain 100% Reserve Feeder Protection",
          detail: "Battery reserve buffer for Wing A Level 3 is fully primed. Zero load shed permitted under NABH standard.",
          type: "preserve",
          expectedImpact: "0 ms power disruption guarantee",
          reason: "All 6 beds currently occupied with invasive mechanical ventilation.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 4.6, solarKw: 0, minReqKw: 4.2 },
        { time: "04:00", demandKw: 4.5, solarKw: 0, minReqKw: 4.2 },
        { time: "08:00", demandKw: 4.8, solarKw: 2.4, minReqKw: 4.2 },
        { time: "12:00", demandKw: 5.1, solarKw: 4.8, minReqKw: 4.2 },
        { time: "16:00", demandKw: 4.9, solarKw: 3.1, minReqKw: 4.2 },
        { time: "20:00", demandKw: 4.7, solarKw: 0, minReqKw: 4.2 },
      ],
    },
    {
      id: "room-ot-cardiac",
      name: "Hybrid Cardiac OR Suite 01",
      code: "OT-401",
      departmentId: "dept-ot",
      departmentName: "Operation Theatre Complex",
      building: "Wing A · Clinical Tower",
      floor: "Floor 4",
      roomType: "Cardiac Surgical Suite",
      priority: "P0",
      currentKw: 9.6,
      minRequiredKw: 8.4,
      peakKw: 14.2,
      energyTodayKwh: 148.6,
      energyTrend: "+12.4%",
      backupStatus: "Solar BESS + Dual UPS Online",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "Active Procedure in Progress (CABG)",
      clinicalFunction: "Minimally-invasive transcatheter valve replacement and coronary bypass surgery",
      authorizedBy: "Dr. Sunita Mehta, MS",
      equipmentList: [
        {
          id: "eq-ot-bypass-01",
          name: "Sorin Stockert S5 Heart-Lung Bypass Machine",
          category: "Life-Support",
          drawKw: 3.2,
          minReqKw: 3.2,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Dedicated Medical Isolation Transformer + BESS",
        },
        {
          id: "eq-ot-carm-01",
          name: "Siemens Artis pheno Robotic C-Arm Fluoroscopy",
          category: "Critical Diagnostic",
          drawKw: 3.8,
          minReqKw: 3.0,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Regulated Solar Bus + 3-Phase UPS",
        },
        {
          id: "eq-ot-lights-01",
          name: "Maquet PowerLED Surgical Light Arrays (x3)",
          category: "Clinical Treatment",
          drawKw: 0.8,
          minReqKw: 0.8,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Emergency DC Bus Backup",
        },
        {
          id: "eq-ot-laminar-01",
          name: "Ultra-Clean Laminar Airflow Plenum",
          category: "Facility Infrastructure",
          drawKw: 1.8,
          minReqKw: 1.4,
          status: "Running",
          criticality: "P1 Clinical",
          backupSupply: "Hospital Essential HVAC Loop",
        },
      ],
      recentAlerts: [],
      recommendations: [
        {
          id: "rec-ot-01",
          title: "Procedure In Progress — Absolute Lockout",
          detail: "Active bypass procedure underway. Any grid fluctuation triggers instant seamless BESS ride-through.",
          type: "preserve",
          expectedImpact: "Guaranteed sterile field air and surgical equipment continuity",
          reason: "NABH Section 6.2 Life Safety Mandate.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 3.2, solarKw: 0, minReqKw: 3.0 },
        { time: "04:00", demandKw: 3.1, solarKw: 0, minReqKw: 3.0 },
        { time: "08:00", demandKw: 7.8, solarKw: 4.5, minReqKw: 6.5 },
        { time: "12:00", demandKw: 9.6, solarKw: 9.6, minReqKw: 8.4 },
        { time: "16:00", demandKw: 8.2, solarKw: 6.0, minReqKw: 7.0 },
        { time: "20:00", demandKw: 4.5, solarKw: 0, minReqKw: 3.0 },
      ],
    },
    {
      id: "room-er-triage",
      name: "Emergency Trauma Resuscitation Bays 01–04",
      code: "ER-101",
      departmentId: "dept-er",
      departmentName: "Emergency & Trauma Resuscitation",
      building: "Wing B · Ambulatory Care",
      floor: "Floor 1 (Ground Level)",
      roomType: "Emergency Resuscitation",
      priority: "P0",
      currentKw: 3.8,
      minRequiredKw: 3.2,
      peakKw: 5.6,
      energyTodayKwh: 76.2,
      energyTrend: "+5.1%",
      backupStatus: "Solar BESS + Dual UPS Online",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "4 / 4 Trauma Bays Active",
      clinicalFunction: "Initial assessment and hemodynamic stabilization of polytrauma patients",
      authorizedBy: "Dr. Arvind Kulkarni, MD",
      equipmentList: [
        {
          id: "eq-er-defib-01",
          name: "Zoll R Series Defibrillators & Pacing Monitors (x4)",
          category: "Life-Support",
          drawKw: 0.8,
          minReqKw: 0.8,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Battery + Clean Instrument Bus",
        },
        {
          id: "eq-er-suction-01",
          name: "Continuous Medical Suction & Gas Manifolds",
          category: "Life-Support",
          drawKw: 1.4,
          minReqKw: 1.4,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Redundant Compressor Plant Bus",
        },
        {
          id: "eq-er-warming-01",
          name: "Belmont Rapid Blood Infusers & Patient Warmers (x2)",
          category: "Clinical Treatment",
          drawKw: 1.6,
          minReqKw: 1.0,
          status: "Running",
          criticality: "P1 Clinical",
          backupSupply: "Hybrid Solar Priority Circuit",
        },
      ],
      recentAlerts: [
        {
          id: "al-er-01",
          severity: "warning",
          title: "Sudden Trauma Surge Inflow",
          message: "Mass casualty protocol activated. 3 simultaneous trauma arrivals incoming.",
          time: "10 mins ago",
          acknowledged: false,
          recommendedAction: "Pre-allocate +2.5 kW backup headroom on Wing B feeder.",
        },
      ],
      recommendations: [
        {
          id: "rec-er-01",
          title: "Pre-Position Wing B BESS Discharge Reserve",
          detail: "Spike in acute trauma arrivals will require immediate CT scan and surgical prep power.",
          type: "preserve",
          expectedImpact: "Zero transfer dip for rapid transfusers",
          reason: "Clinical priority protocol override.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 3.4, solarKw: 0, minReqKw: 3.0 },
        { time: "04:00", demandKw: 3.2, solarKw: 0, minReqKw: 3.0 },
        { time: "08:00", demandKw: 3.6, solarKw: 2.0, minReqKw: 3.2 },
        { time: "12:00", demandKw: 3.8, solarKw: 3.8, minReqKw: 3.2 },
        { time: "16:00", demandKw: 4.1, solarKw: 2.8, minReqKw: 3.2 },
        { time: "20:00", demandKw: 3.9, solarKw: 0, minReqKw: 3.2 },
      ],
    },
    {
      id: "room-diag-mri",
      name: "MRI Imaging Suite (3.0 Tesla Supercon)",
      code: "RAD-201",
      departmentId: "dept-diag",
      departmentName: "Diagnostic Imaging & Cath Lab",
      building: "Wing B · Ambulatory Care",
      floor: "Basement Level 1",
      roomType: "Magnetic Resonance Imaging",
      priority: "P1",
      currentKw: 14.2,
      minRequiredKw: 5.5,
      peakKw: 26.0,
      energyTodayKwh: 242.0,
      energyTrend: "-4.2%",
      backupStatus: "Grid Protected with Cryocooler UPS",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "Scanning In Progress (Brain Neuro-Perfusion)",
      clinicalFunction: "High-resolution non-invasive diagnostic neuro and musculoskeletal scans",
      authorizedBy: "Dr. Priya Nair, MD",
      equipmentList: [
        {
          id: "eq-mri-cryo-01",
          name: "Sumitomo Helium Coldhead Cryocooler Compressor",
          category: "Critical Diagnostic",
          drawKw: 5.5,
          minReqKw: 5.5,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Dedicated Cryocooler Uninterruptible Power Supply (UPS)",
        },
        {
          id: "eq-mri-gradient-01",
          name: "Siemens Magnetom 3T RF Gradient Amplifiers",
          category: "Critical Diagnostic",
          drawKw: 8.7,
          minReqKw: 0,
          status: "Running",
          criticality: "P1 Clinical",
          backupSupply: "Hospital Main Bus (Curtailable if Islanded)",
        },
      ],
      recentAlerts: [],
      recommendations: [
        {
          id: "rec-mri-01",
          title: "Cryocooler Continuous Power Protected",
          detail: "Helium boil-off prevention compressor drawing 5.5 kW constant. In islanded mode, gradient amps can pause while cryo stays locked.",
          type: "shift",
          expectedImpact: "Saves ₹8.5L in helium quench prevention",
          reason: "Superconducting magnet safety protocol.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 5.5, solarKw: 0, minReqKw: 5.5 },
        { time: "04:00", demandKw: 5.5, solarKw: 0, minReqKw: 5.5 },
        { time: "08:00", demandKw: 12.0, solarKw: 8.0, minReqKw: 5.5 },
        { time: "12:00", demandKw: 14.2, solarKw: 14.2, minReqKw: 5.5 },
        { time: "16:00", demandKw: 13.5, solarKw: 10.0, minReqKw: 5.5 },
        { time: "20:00", demandKw: 6.2, solarKw: 0, minReqKw: 5.5 },
      ],
    },
    {
      id: "room-ward-5a",
      name: "Step-Down Ward 5A (Telemetry Beds 501–512)",
      code: "IPW-501",
      departmentId: "dept-ward",
      departmentName: "Inpatient General & Step-Down Wards",
      building: "Wing C · Patient Pavilion",
      floor: "Floor 5",
      roomType: "Step-Down Intermediate Care",
      priority: "P2",
      currentKw: 2.8,
      minRequiredKw: 1.4,
      peakKw: 4.2,
      energyTodayKwh: 48.0,
      energyTrend: "-1.5%",
      backupStatus: "Essential Circuit Only",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "10 / 12 Beds Occupied",
      clinicalFunction: "Subacute patient recovery, post-ICU step-down monitoring",
      authorizedBy: "Dr. Vikram Joshi, MD",
      equipmentList: [
        {
          id: "eq-ward-tele-01",
          name: "Wireless ECG Telemetry Central Station",
          category: "Clinical Treatment",
          drawKw: 0.8,
          minReqKw: 0.8,
          status: "Running",
          criticality: "P1 Clinical",
          backupSupply: "Central Hospital UPS",
        },
        {
          id: "eq-ward-beds-01",
          name: "Motorized Hospital Beds & Nurse Call Console",
          category: "Inpatient Support",
          drawKw: 0.6,
          minReqKw: 0.6,
          status: "Running",
          criticality: "P2 Support",
          backupSupply: "Essential Lighting Circuit",
        },
        {
          id: "eq-ward-hvac-01",
          name: "Patient Room Comfort VAV Cooling Loop",
          category: "Facility Infrastructure",
          drawKw: 1.4,
          minReqKw: 0,
          status: "Running",
          criticality: "P3 Flexible",
          backupSupply: "Curtailable Grid Feeder",
        },
      ],
      recentAlerts: [],
      recommendations: [
        {
          id: "rec-ward-01",
          title: "Pre-stage Comfort HVAC Curtailment for Peak Hours",
          detail: "VAV cooling can be stepped down by 1.2 kW during 14:00 tariff peak without clinical temperature drift.",
          type: "conserve",
          expectedImpact: "Reduces peak demand by 1.2 kW (saves ₹180/hr)",
          reason: "Patient rooms within thermal comfort tolerance band.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 2.2, solarKw: 0, minReqKw: 1.4 },
        { time: "04:00", demandKw: 2.1, solarKw: 0, minReqKw: 1.4 },
        { time: "08:00", demandKw: 2.7, solarKw: 1.8, minReqKw: 1.4 },
        { time: "12:00", demandKw: 3.1, solarKw: 3.1, minReqKw: 1.4 },
        { time: "16:00", demandKw: 2.9, solarKw: 2.0, minReqKw: 1.4 },
        { time: "20:00", demandKw: 2.5, solarKw: 0, minReqKw: 1.4 },
      ],
    },
    {
      id: "room-fac-freezer",
      name: "Central Blood Bank & Vaccine Ultra-Low Freezers",
      code: "FAC-001",
      departmentId: "dept-fac",
      departmentName: "Hospital Central Facilities & Data Center",
      building: "Service Block & Utility Basement",
      floor: "Basement Level 1",
      roomType: "Biological Cold Storage",
      priority: "P0",
      currentKw: 4.8,
      minRequiredKw: 4.0,
      peakKw: 6.2,
      energyTodayKwh: 96.5,
      energyTrend: "+0.8%",
      backupStatus: "Solar BESS + Dual UPS Online",
      backupHealth: "Ready",
      energyStatus: "Normal",
      occupancy: "Fully Stocked (420 Units Blood / ₹1.4 Cr Inventory)",
      clinicalFunction: "Long-term cold preservation of whole blood, plasma, rare platelets, and vaccines",
      authorizedBy: "Er. Ramesh Patel",
      equipmentList: [
        {
          id: "eq-freezer-01",
          name: "Thermo Scientific TSX -80°C Ultra-Low Freezers (x4)",
          category: "Life-Support",
          drawKw: 3.2,
          minReqKw: 3.2,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Direct Dedicated Inverter Branch + BESS",
        },
        {
          id: "eq-freezer-ag-01",
          name: "Helmer Platelet Agitators & Refrigerators (x6)",
          category: "Clinical Treatment",
          drawKw: 1.6,
          minReqKw: 0.8,
          status: "Running",
          criticality: "P0 Life-Support",
          backupSupply: "Clean Medical Bus Dual Fed",
        },
      ],
      recentAlerts: [],
      recommendations: [
        {
          id: "rec-fac-01",
          title: "Cold Chain Inventory Thermal Inertia Active",
          detail: "All freezers operating at nominal -81.4°C. Thermal hold-over time exceeds 4.5 hours in case of compound failure.",
          type: "preserve",
          expectedImpact: "Guaranteed vaccine & plasma safety",
          reason: "NABH Section 8 Blood Transfusion Quality Standard.",
          isDemo: false,
        },
      ],
      history24h: [
        { time: "00:00", demandKw: 4.7, solarKw: 0, minReqKw: 4.0 },
        { time: "04:00", demandKw: 4.6, solarKw: 0, minReqKw: 4.0 },
        { time: "08:00", demandKw: 4.8, solarKw: 3.0, minReqKw: 4.0 },
        { time: "12:00", demandKw: 5.0, solarKw: 5.0, minReqKw: 4.0 },
        { time: "16:00", demandKw: 4.9, solarKw: 3.5, minReqKw: 4.0 },
        { time: "20:00", demandKw: 4.8, solarKw: 0, minReqKw: 4.0 },
      ],
    },
  ];

  private scenarios: Record<string, SimulationScenario> = {
    "grid-outage": {
      id: "grid-outage",
      name: "Catastrophic Grid Outage (Black Sky)",
      category: "Emergency & Islanding",
      description: "Utility grid drops to 0V. Hospital automatically islands on rooftop solar + 300 kWh BESS with zero-delay NABH priority transfer.",
      gridAvailable: false,
      solarMultiplier: 1.0,
      demandMultiplier: 0.82,
      batterySocPercent: 68,
      recommendedMode: "Emergency Watch",
    },
    "monsoon-overcast": {
      id: "monsoon-overcast",
      name: "Monsoon Heavy Overcast & Low Solar",
      category: "Weather & Renewables",
      description: "Dense cloud cover drops solar yield by 78%. AI algorithm triggers predictive pre-charging from off-peak grid to guarantee night surgical buffer.",
      gridAvailable: true,
      solarMultiplier: 0.22,
      demandMultiplier: 1.05,
      batterySocPercent: 88,
      recommendedMode: "Grid Backup",
    },
    "surgical-surge": {
      id: "surgical-surge",
      name: "Emergency Mass-Casualty Surgical Surge",
      category: "Clinical Acuity",
      description: "Triple simultaneous emergency trauma laparotomies demand +18 kW instantaneous draw across OR 1, 2, and Cath Lab.",
      gridAvailable: true,
      solarMultiplier: 1.0,
      demandMultiplier: 1.35,
      batterySocPercent: 74,
      recommendedMode: "Cost Saving",
    },
    "battery-depletion": {
      id: "battery-depletion",
      name: "BESS State-of-Charge Low (22% Reserve)",
      category: "Storage Stress",
      description: "Battery hits critical 22% floor during extended cloudy evening. Non-critical P2 and P3 administrative loads automatically curtailed.",
      gridAvailable: true,
      solarMultiplier: 0.05,
      demandMultiplier: 0.72,
      batterySocPercent: 22,
      recommendedMode: "Grid Backup",
    },
    "peer-microgrid-sharing": {
      id: "peer-microgrid-sharing",
      name: "Microgrid P2P Surplus Support",
      category: "Energy Sharing",
      description: "Surplus 48 kWh dispatched across campus microgrid to Apollo Oncology Wing at ₹8.5/kWh, earning green credits.",
      gridAvailable: true,
      solarMultiplier: 1.15,
      demandMultiplier: 0.95,
      batterySocPercent: 92,
      recommendedMode: "Self-Powered",
    },
  };

  /* ────────────────────────────────────────────
   * Getter & Setter methods
   * ──────────────────────────────────────────── */

  getFacility(): Facility {
    return { ...this.facility };
  }

  updateFacility(updates: Partial<Facility>): Facility {
    this.facility = { ...this.facility, ...updates };
    return this.getFacility();
  }

  getTelemetry(): TelemetryReading {
    // Add minor realistic micro-fluctuations (±0.2 kW) to simulate real-time telemetry
    const jitter = (Math.random() - 0.5) * 0.4;
    const solar = Number(Math.max(0, (this.telemetry.solar_generation_kw ?? 42.5) + jitter).toFixed(1));
    const load = Number(((this.telemetry.total_load_kw ?? 51.2) + jitter * 0.5).toFixed(1));

    return {
      ...this.telemetry,
      timestamp: new Date().toISOString(),
      solar_generation_kw: solar,
      total_load_kw: load,
    };
  }

  updateTelemetry(updates: Partial<TelemetryReading>): TelemetryReading {
    this.telemetry = {
      ...this.telemetry,
      ...updates,
      timestamp: new Date().toISOString(),
    };
    return this.getTelemetry();
  }

  getEnergyHistory(range: string = "24h"): EnergyHistoryPoint[] {
    if (range === "7d") {
      return [
        { time: "Mon", solar: 82, demand: 64, battery: 24, grid: 16, forecast: 80 },
        { time: "Tue", solar: 88, demand: 68, battery: 26, grid: 12, forecast: 85 },
        { time: "Wed", solar: 76, demand: 62, battery: 18, grid: 18, forecast: 78 },
        { time: "Thu", solar: 94, demand: 70, battery: 29, grid: 10, forecast: 90 },
        { time: "Fri", solar: 85, demand: 66, battery: 22, grid: 14, forecast: 84 },
        { time: "Sat", solar: 70, demand: 55, battery: 16, grid: 12, forecast: 72 },
        { time: "Sun", solar: 84.6, demand: 62.3, battery: 28.7, grid: 12.4, forecast: 83 },
      ];
    }
    return [...this.energyHistory];
  }

  addEnergyHistoryPoint(point: EnergyHistoryPoint): EnergyHistoryPoint[] {
    this.energyHistory.push(point);
    if (this.energyHistory.length > 48) {
      this.energyHistory.shift();
    }
    return this.getEnergyHistory();
  }

  getOperatingMode(): OperatingModeRecord {
    return { ...this.operatingMode };
  }

  updateOperatingMode(updates: Partial<OperatingModeRecord>): OperatingModeRecord {
    this.operatingMode = {
      ...this.operatingMode,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.getOperatingMode();
  }

  getForecast(): ForecastData {
    return { ...this.forecast };
  }

  updateForecast(updates: Partial<ForecastData>): ForecastData {
    this.forecast = {
      solar: { ...this.forecast.solar, ...(updates.solar || {}) },
      load: { ...this.forecast.load, ...(updates.load || {}) },
    };
    return this.getForecast();
  }

  getOptimization(): OptimizationDecision {
    return { ...this.optimization };
  }

  updateOptimization(updates: Partial<OptimizationDecision>): OptimizationDecision {
    this.optimization = { ...this.optimization, ...updates };
    return this.getOptimization();
  }

  getLoadTiers(): LoadTier[] {
    return [...this.loadTiers];
  }

  updateLoadTier(id: string, updates: Partial<LoadTier>): LoadTier | null {
    const idx = this.loadTiers.findIndex((t) => t.id === id || t.tier.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    this.loadTiers[idx] = { ...this.loadTiers[idx], ...updates };
    return this.loadTiers[idx];
  }

  getMetering(): MeteringRecord[] {
    return [...this.metering];
  }

  getAlerts(filters?: { status?: string; severity?: string }): AlertRecord[] {
    let result = [...this.alerts];
    if (filters?.status) {
      result = result.filter((a) => a.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters?.severity) {
      result = result.filter((a) => a.state.toLowerCase() === filters.severity!.toLowerCase());
    }
    return result;
  }

  createAlert(alert: Omit<AlertRecord, "id" | "created_at">): AlertRecord {
    const newAlert: AlertRecord = {
      ...alert,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  acknowledgeAlert(id: string | number): AlertRecord | null {
    const alert = this.alerts.find((a) => String(a.id) === String(id));
    if (!alert) return null;
    alert.status = "Acknowledged";
    return alert;
  }

  deleteAlert(id: string | number): boolean {
    const initialLen = this.alerts.length;
    this.alerts = this.alerts.filter((a) => String(a.id) !== String(id));
    return this.alerts.length < initialLen;
  }

  getHospitalLoads(): HospitalLoad[] {
    return [...this.hospitalLoads];
  }

  updateHospitalLoadPriority(
    loadId: string,
    newPriority: PriorityLevel,
    reason: string,
    operator: string
  ): { load: HospitalLoad; audit: LoadAuditLog } {
    const load = this.hospitalLoads.find((l) => l.id === loadId) ?? this.hospitalLoads[0];
    const prevPriority = load.priority;

    load.priority = newPriority;
    load.status = newPriority === "CRITICAL" ? "Protected" : "Active";
    load.protection_status =
      newPriority === "CRITICAL"
        ? "100% Protected"
        : newPriority === "HIGH"
        ? "Guaranteed"
        : "Curtailable";
    load.updated_at = new Date().toISOString();

    const audit: LoadAuditLog = {
      id: `audit-${Date.now()}`,
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      operator: operator || "Authorized Clinical Engineer",
      load_id: loadId,
      load_name: load.equipment_name,
      previous_priority: prevPriority,
      new_priority: newPriority,
      reason: reason || "Manual protocol override",
    };

    this.loadAuditLogs.unshift(audit);

    return { load, audit };
  }

  getLoadAuditLogs(): LoadAuditLog[] {
    return [...this.loadAuditLogs];
  }

  addLoadAuditLog(log: Omit<LoadAuditLog, "id" | "timestamp">): LoadAuditLog {
    const entry: LoadAuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.loadAuditLogs.unshift(entry);
    return entry;
  }

  getEmergencyMode(): EmergencyModeState {
    return { ...this.emergencyMode };
  }

  setEmergencyMode(active: boolean, operator: string, reason: string): EmergencyModeState {
    this.emergencyMode = {
      is_active: active,
      activated_at: active ? new Date().toISOString() : null,
      activated_by: active ? (operator || "Clinical Operations Lead") : null,
      mode_label: active
        ? "Emergency Critical Load Preservation Mode"
        : "Standard Operations Mode",
    };

    if (active) {
      this.operatingMode.mode = "Emergency Watch";
      this.operatingMode.flow_state = "recovery";
      this.operatingMode.mode_detail =
        "Emergency mode engaged: non-critical loads shed, 100% solar and BESS reserved for ICU/OR life-support.";
    } else {
      this.operatingMode.mode = "Self-Powered";
      this.operatingMode.flow_state = "normal";
      this.operatingMode.mode_detail =
        "Solar + BESS supplying priority clinical feeders; grid in hot standby.";
    }
    this.operatingMode.updated_at = new Date().toISOString();

    const audit: LoadAuditLog = {
      id: `audit-${Date.now()}`,
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      operator: operator || "Clinical Operations Controller",
      load_id: "ALL_LOADS",
      load_name: active ? "Emergency Critical Mode Engaged" : "Emergency Mode Disengaged",
      previous_priority: active ? "NORMAL" : "CRITICAL",
      new_priority: active ? "CRITICAL" : "NORMAL",
      reason: reason || (active ? "Grid contingency protocol active" : "Normal operating schedule restored"),
    };
    this.loadAuditLogs.unshift(audit);

    return this.getEmergencyMode();
  }

  getEnergySharingSummary(): EnergySharingSummary {
    return { ...this.energySharingSummary };
  }

  getEnergyPeers(): EnergyPeer[] {
    return [...this.energyPeers];
  }

  getEnergyTransactions(): EnergyTransaction[] {
    return [...this.energyTransactions];
  }

  createEnergyTransaction(
    tx: Omit<EnergyTransaction, "id" | "created_at">
  ): { transaction: EnergyTransaction; summary: EnergySharingSummary } {
    const newTx: EnergyTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    this.energyTransactions.unshift(newTx);

    if (tx.type === "Sold") {
      this.energySharingSummary.available_energy_kwh = Math.max(
        0,
        this.energySharingSummary.available_energy_kwh - tx.amount_kwh
      );
      this.energySharingSummary.energy_shared_kwh += tx.amount_kwh;
      this.energySharingSummary.total_energy_sold_kwh += tx.amount_kwh;
      this.energySharingSummary.total_earnings_inr += tx.total_amount_inr;
      this.energySharingSummary.today_earnings_inr += tx.total_amount_inr;
      this.energySharingSummary.credit_balance_kwh += tx.amount_kwh;
    } else if (tx.type === "Shared") {
      this.energySharingSummary.available_energy_kwh = Math.max(
        0,
        this.energySharingSummary.available_energy_kwh - tx.amount_kwh
      );
      this.energySharingSummary.energy_shared_kwh += tx.amount_kwh;
      this.energySharingSummary.credits_earned += 1;
      this.energySharingSummary.credit_balance_kwh += tx.amount_kwh;
    } else if (tx.type === "Bought" || tx.type === "Received") {
      this.energySharingSummary.energy_received_kwh += tx.amount_kwh;
      this.energySharingSummary.credit_balance_kwh -= tx.amount_kwh;
    }

    this.energySharingSummary.updated_at = new Date().toISOString();

    return { transaction: newTx, summary: this.getEnergySharingSummary() };
  }

  getCampuses(): HospitalCampusProfile[] {
    return [...this.campuses];
  }

  getDepartments(): HospitalDepartment[] {
    return [...this.departments];
  }

  getRooms(filters?: { departmentId?: string; priority?: RoomPriority }): HospitalRoom[] {
    let list = [...this.rooms];
    if (filters?.departmentId) {
      list = list.filter((r) => r.departmentId === filters.departmentId);
    }
    if (filters?.priority) {
      list = list.filter((r) => r.priority === filters.priority);
    }
    return list;
  }

  getRoomById(id: string): HospitalRoom | null {
    return this.rooms.find((r) => r.id === id) || null;
  }

  updateRoomPriority(
    roomId: string,
    newPriority: RoomPriority,
    justification: string,
    operator: string
  ): { room: HospitalRoom; audit: LoadAuditLog } | null {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return null;

    const prev = room.priority;
    room.priority = newPriority;

    const legacyMap: Record<RoomPriority, PriorityLevel> = {
      P0: "CRITICAL",
      P1: "HIGH",
      P2: "NORMAL",
      P3: "NON-CRITICAL",
    };

    const audit: LoadAuditLog = {
      id: `audit-${Date.now()}`,
      facility_id: "SG-ACC-01",
      timestamp: new Date().toISOString(),
      operator: operator || "Clinical Operations Controller",
      load_id: roomId,
      load_name: room.name,
      previous_priority: legacyMap[prev],
      new_priority: legacyMap[newPriority],
      reason: justification || "Room Priority Policy modified",
    };

    this.loadAuditLogs.unshift(audit);

    return { room: { ...room }, audit };
  }

  getScenarios(): Record<string, SimulationScenario> {
    return { ...this.scenarios };
  }

  applyScenario(scenarioId: string): { scenario: SimulationScenario; telemetry: TelemetryReading } | null {
    const sc = this.scenarios[scenarioId];
    if (!sc) return null;

    this.telemetry.grid_connected = sc.gridAvailable;
    this.telemetry.solar_generation_kw = Number((42.5 * sc.solarMultiplier).toFixed(1));
    this.telemetry.total_load_kw = Number((51.2 * sc.demandMultiplier).toFixed(1));
    this.telemetry.battery_soc_percent = sc.batterySocPercent;

    if (!sc.gridAvailable) {
      this.telemetry.grid_import_kw = 0;
      this.telemetry.battery_discharge_kw = Math.max(0, this.telemetry.total_load_kw - (this.telemetry.solar_generation_kw || 0));
      this.telemetry.battery_charge_kw = null;
    }

    this.operatingMode.mode = sc.recommendedMode as any;
    this.operatingMode.updated_at = new Date().toISOString();

    return { scenario: sc, telemetry: this.getTelemetry() };
  }
}

export const storage = new Storage();

