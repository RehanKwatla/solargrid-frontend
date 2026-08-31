-- ============================================================================
-- SolarGrid: Hospital Critical Load Management Schema
-- ============================================================================

-- 1. Hospital Loads Table
CREATE TABLE IF NOT EXISTS hospital_loads (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL,
  building TEXT NOT NULL,
  floor TEXT NOT NULL,
  department TEXT NOT NULL,
  room TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  current_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  rated_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  priority TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'NORMAL', 'NON-CRITICAL')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Protected', 'Active', 'Curtailable', 'Standby', 'Shed')),
  source TEXT NOT NULL DEFAULT 'Solar + Battery',
  protection_status TEXT NOT NULL DEFAULT '100% Protected',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Load Audit Logs Table
CREATE TABLE IF NOT EXISTS load_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operator TEXT NOT NULL,
  load_id TEXT NOT NULL,
  load_name TEXT NOT NULL,
  previous_priority TEXT NOT NULL,
  new_priority TEXT NOT NULL,
  reason TEXT NOT NULL
);

-- 3. Emergency Mode State Table
CREATE TABLE IF NOT EXISTS emergency_mode_state (
  id TEXT PRIMARY KEY DEFAULT 'current_state',
  facility_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  activated_at TIMESTAMPTZ,
  activated_by TEXT,
  mode_label TEXT NOT NULL DEFAULT 'Standard Operations Mode',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE hospital_loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_mode_state ENABLE ROW LEVEL SECURITY;

-- Policies for public/authenticated read and write
CREATE POLICY "Allow public read on hospital_loads" ON hospital_loads FOR SELECT USING (true);
CREATE POLICY "Allow public update on hospital_loads" ON hospital_loads FOR UPDATE USING (true);
CREATE POLICY "Allow public read on load_audit_logs" ON load_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on load_audit_logs" ON load_audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on emergency_mode_state" ON emergency_mode_state FOR SELECT USING (true);
CREATE POLICY "Allow public update on emergency_mode_state" ON emergency_mode_state FOR UPDATE USING (true);

-- Seed Initial Hospital Loads for Apollo Care Campus
INSERT INTO hospital_loads (id, facility_id, building, floor, department, room, equipment_name, current_kw, rated_kw, priority, status, source, protection_status) VALUES
  ('load-icu-01', 'SG-ACC-01', 'Main Clinical Block', 'Floor 3', 'Intensive Care Unit (ICU)', 'ICU-01', 'Ventilator Bank & Invasive Monitor 01', 2.80, 3.50, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-icu-02', 'SG-ACC-01', 'Main Clinical Block', 'Floor 3', 'Intensive Care Unit (ICU)', 'ICU-02', 'Ventilator Bank & Infusion Array 02', 2.40, 3.20, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-icu-03', 'SG-ACC-01', 'Main Clinical Block', 'Floor 3', 'Intensive Care Unit (ICU)', 'ICU Central', 'Central Life Support Power Bus', 5.20, 6.00, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-ot-01', 'SG-ACC-01', 'Surgical Wing', 'Floor 2', 'Operation Theatre (OT)', 'OT Suite 01', 'Surgical Shadowless Lamps & Anesthesia Station', 4.60, 5.50, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-ot-02', 'SG-ACC-01', 'Surgical Wing', 'Floor 2', 'Operation Theatre (OT)', 'OT Suite 02', 'Laparoscopic Surgical Tower & Electrosurgery', 4.20, 5.00, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-emg-01', 'SG-ACC-01', 'Emergency Pavilion', 'Ground Floor', 'Emergency & Trauma', 'Trauma Bay 01', 'Resuscitation Defibrillator & Suction Unit', 3.50, 4.00, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-emg-02', 'SG-ACC-01', 'Emergency Pavilion', 'Ground Floor', 'Emergency & Trauma', 'Triage Bay 02', 'High-Flow Oxygen Concentrator', 2.70, 3.50, 'HIGH', 'Active', 'Solar + Battery', 'Guaranteed'),
  ('load-cold-01', 'SG-ACC-01', 'Pharmacy & Labs', 'Basement 1', 'Vaccine & Blood Storage', 'Cold Room 01', 'Ultra-Low Temperature (-86°C) Vaccine Freezers', 5.00, 6.00, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-cold-02', 'SG-ACC-01', 'Pharmacy & Labs', 'Basement 1', 'Vaccine & Blood Storage', 'Blood Bank 02', 'Refrigerated Plasma & Platelet Agitators', 2.70, 3.20, 'CRITICAL', 'Protected', 'Solar + Battery', '100% Protected'),
  ('load-rad-01', 'SG-ACC-01', 'Diagnostic Wing', 'Ground Floor', 'Radiology & Imaging', 'MRI Standby', 'MRI Cryocooler Compressor Loop', 5.50, 7.00, 'HIGH', 'Active', 'Grid Protected', 'Guaranteed'),
  ('load-wrd-01', 'SG-ACC-01', 'Inpatient Pavilion', 'Floor 4', 'General Inpatient Wards', 'Ward Block 4A', 'Ward Lighting, Bedside Telemetry & Medical Air', 4.20, 5.50, 'NORMAL', 'Active', 'Hybrid Priority', 'Curtailable'),
  ('load-wrd-02', 'SG-ACC-01', 'Inpatient Pavilion', 'Floor 5', 'General Inpatient Wards', 'Ward Block 5B', 'Floor HVAC Air Handlers & Nurse Station', 3.40, 4.80, 'NORMAL', 'Active', 'Hybrid Priority', 'Curtailable'),
  ('load-adm-01', 'SG-ACC-01', 'Administration Wing', 'Floor 1', 'Facility Utilities', 'Kitchen & Laundry', 'Commercial Dishwasher & Water Heating Pumps', 3.20, 6.00, 'NON-CRITICAL', 'Curtailable', 'Hybrid Priority', 'Curtailable'),
  ('load-adm-02', 'SG-ACC-01', 'Administration Wing', 'Floor 1', 'Administration', 'Records & Billing', 'Workstations & Auxiliary Air Conditioning', 1.80, 3.00, 'NON-CRITICAL', 'Curtailable', 'Hybrid Priority', 'Curtailable')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Emergency Mode State
INSERT INTO emergency_mode_state (id, facility_id, is_active, mode_label) VALUES
  ('current_state', 'SG-ACC-01', false, 'Standard Operations Mode')
ON CONFLICT (id) DO NOTHING;

-- Seed Audit Log Entries
INSERT INTO load_audit_logs (facility_id, timestamp, operator, load_id, load_name, previous_priority, new_priority, reason) VALUES
  ('SG-ACC-01', NOW() - INTERVAL '2 hours', 'Dr. A. Sharma (Chief Medical Officer)', 'load-ot-02', 'OT Suite 02 — Laparoscopic Tower', 'HIGH', 'CRITICAL', 'Emergency neurosurgery scheduled during grid peak period'),
  ('SG-ACC-01', NOW() - INTERVAL '5 hours', 'R. Mehta (Lead Electrical Engineer)', 'load-cold-01', 'Cold Room 01 — Vaccine Ultra-Low Freezers', 'HIGH', 'CRITICAL', 'WHO cold-chain certification compliance mandatory lock'),
  ('SG-ACC-01', NOW() - INTERVAL '1 day', 'S. Kulkarni (Facilities Supervisor)', 'load-adm-01', 'Kitchen & Laundry — Water Heating', 'NORMAL', 'NON-CRITICAL', 'Automated peak shaving policy enforcement')
ON CONFLICT DO NOTHING;
