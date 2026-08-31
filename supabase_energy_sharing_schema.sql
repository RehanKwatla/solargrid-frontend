-- ============================================================================
-- SolarGrid: Energy Sharing & Peer Microgrid Trading Schema
-- ============================================================================

-- 1. Energy Sharing Summary Table
CREATE TABLE IF NOT EXISTS energy_sharing_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id TEXT NOT NULL,
  available_energy_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  energy_shared_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  energy_received_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  credit_balance_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  credit_rate_inr_per_kwh NUMERIC(10, 2) NOT NULL DEFAULT 6.80,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  total_earnings_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  today_earnings_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  pending_earnings_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  avg_selling_rate_inr NUMERIC(10, 2) NOT NULL DEFAULT 6.80,
  total_energy_sold_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  sharing_status TEXT NOT NULL DEFAULT 'Active Sharing',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Energy Transactions Table (Trading / Sharing Log)
CREATE TABLE IF NOT EXISTS energy_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Sold', 'Bought', 'Shared', 'Received')),
  amount_kwh NUMERIC(10, 2) NOT NULL,
  rate_inr NUMERIC(10, 2) NOT NULL,
  total_amount_inr NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Settled', 'Failed')),
  peer_entity TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Energy Sharing Microgrid Peers
CREATE TABLE IF NOT EXISTS energy_sharing_peers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  distance_km NUMERIC(5, 2) NOT NULL,
  demand_status TEXT NOT NULL,
  available_capacity_kwh NUMERIC(10, 2) NOT NULL,
  current_rate_inr NUMERIC(10, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE energy_sharing_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_sharing_peers ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated read & insert access for dashboard operations
CREATE POLICY "Allow public read on energy_sharing_summary"
  ON energy_sharing_summary FOR SELECT USING (true);

CREATE POLICY "Allow public read on energy_transactions"
  ON energy_transactions FOR SELECT USING (true);

CREATE POLICY "Allow public insert on energy_transactions"
  ON energy_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on energy_sharing_summary"
  ON energy_sharing_summary FOR UPDATE USING (true);

CREATE POLICY "Allow public read on energy_sharing_peers"
  ON energy_sharing_peers FOR SELECT USING (true);

-- Seed Initial Records
INSERT INTO energy_sharing_summary (
  facility_id,
  available_energy_kwh,
  energy_shared_kwh,
  energy_received_kwh,
  credit_balance_kwh,
  credit_rate_inr_per_kwh,
  credits_earned,
  total_earnings_inr,
  today_earnings_inr,
  pending_earnings_inr,
  avg_selling_rate_inr,
  total_energy_sold_kwh,
  sharing_status
) VALUES (
  'SG-ACC-01',
  142.80,
  384.50,
  96.20,
  124.50,
  6.80,
  42,
  18450.00,
  2614.00,
  1088.00,
  6.80,
  2713.20,
  'Active Sharing'
) ON CONFLICT DO NOTHING;

INSERT INTO energy_sharing_peers (id, name, type, distance_km, demand_status, available_capacity_kwh, current_rate_inr) VALUES
  ('peer-01', 'Apollo Clinical Annex (Wing B)', 'hospital_wing', 0.3, 'High Demand', 45.0, 7.10),
  ('peer-02', 'Pune Municipal Primary Health Substation', 'clinic', 1.2, 'Critical', 60.0, 7.40),
  ('peer-03', 'District Vaccine Cold Storage Hub', 'storage_facility', 2.1, 'Balanced', 80.0, 6.80),
  ('peer-04', 'West Feeder Microgrid Bus #04', 'microgrid_feeder', 0.8, 'Surplus', 120.0, 6.50)
ON CONFLICT DO NOTHING;

INSERT INTO energy_transactions (facility_id, type, amount_kwh, rate_inr, total_amount_inr, status, peer_entity, notes, created_at) VALUES
  ('SG-ACC-01', 'Sold', 35.0, 7.10, 248.50, 'Completed', 'Apollo Clinical Annex (Wing B)', 'Surplus dispatch during morning peak', NOW() - INTERVAL '3 hours'),
  ('SG-ACC-01', 'Shared', 20.0, 6.80, 136.00, 'Completed', 'District Vaccine Cold Storage Hub', 'Critical cold-chain emergency support credit', NOW() - INTERVAL '6 hours'),
  ('SG-ACC-01', 'Sold', 50.0, 7.40, 370.00, 'Settled', 'Pune Municipal Primary Health Substation', 'Automated peak shaving trade', NOW() - INTERVAL '1 day'),
  ('SG-ACC-01', 'Received', 15.0, 6.50, 97.50, 'Completed', 'West Feeder Microgrid Bus #04', 'Night reserve top-up', NOW() - INTERVAL '2 days'),
  ('SG-ACC-01', 'Bought', 25.0, 6.60, 165.00, 'Completed', 'West Feeder Microgrid Bus #04', 'Pre-storm reserve buffer acquisition', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;
