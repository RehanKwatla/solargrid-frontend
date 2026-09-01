-- SolarGrid Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on your project.
-- Safe to re-run: uses "if not exists" / "or replace" where practical.

-- ============================================================================
-- TABLES
-- ============================================================================

create table if not exists public.telemetry (
  id bigint generated always as identity primary key,
  site text not null default 'Apollo Care Campus',
  solar_kw numeric not null,
  grid_kw numeric not null,
  battery_soc numeric not null,
  battery_kw numeric not null,
  load_kw numeric not null,
  critical_load_kw numeric not null,
  tier2_load_kw numeric not null,
  tier3_load_kw numeric not null,
  estimated_savings_inr numeric not null,
  grid_connected boolean not null default true,
  recorded_at timestamptz not null default now()
);
create index if not exists telemetry_recorded_at_idx on public.telemetry (recorded_at desc);

create table if not exists public.energy_history (
  id bigint generated always as identity primary key,
  time_label text not null,
  solar numeric not null,
  demand numeric not null,
  battery numeric not null,
  grid numeric not null,
  forecast numeric not null,
  recorded_at timestamptz not null default now()
);
create index if not exists energy_history_recorded_at_idx on public.energy_history (recorded_at desc);

create table if not exists public.alerts (
  id bigint generated always as identity primary key,
  title text not null,
  detail text not null,
  occurred_at text not null,
  state text not null check (state in ('healthy', 'watch', 'critical')),
  site text not null default 'Apollo Care Campus',
  status text not null default 'Open' check (status in ('Open', 'Acknowledged')),
  asset_id text,
  created_at timestamptz not null default now()
);
create index if not exists alerts_created_at_idx on public.alerts (created_at desc);

create table if not exists public.solar_forecast (
  id bigint generated always as identity primary key,
  current numeric not null,
  next_hour numeric not null,
  peak_expected numeric not null,
  confidence text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.load_forecast (
  id bigint generated always as identity primary key,
  current numeric not null,
  expected_peak numeric not null,
  peak_time text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.optimization_decisions (
  id bigint generated always as identity primary key,
  action text not null,
  reason text not null,
  expected_effect jsonb not null default '[]'::jsonb,
  confidence text not null,
  created_at timestamptz not null default now()
);
create index if not exists optimization_decisions_created_at_idx on public.optimization_decisions (created_at desc);

create table if not exists public.operating_state (
  id bigint generated always as identity primary key,
  mode text not null check (mode in ('Self-Powered', 'Cost Saving', 'Emergency Watch', 'Grid Backup')),
  flow_state text not null check (flow_state in ('normal', 'high-demand', 'grid-outage', 'recovery')),
  mode_detail text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.priority_dispatch (
  id bigint generated always as identity primary key,
  tier text not null unique,
  asset_id text not null,
  label text not null,
  description text not null,
  state text not null,
  status text not null check (status in ('healthy', 'watch', 'critical', 'neutral')),
  allocation text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.feature1_metering (
  id bigint generated always as identity primary key,
  metric text not null,
  current_value text not null,
  reference_value text not null,
  status text not null,
  source text not null,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- All tables are readable by any signed-in user. Only `alerts` accepts writes
-- from clients (acknowledging an event); everything else is written by a
-- trusted process (seed data, or a service-role job/edge function later).
-- ============================================================================

alter table public.telemetry enable row level security;
alter table public.energy_history enable row level security;
alter table public.alerts enable row level security;
alter table public.solar_forecast enable row level security;
alter table public.load_forecast enable row level security;
alter table public.optimization_decisions enable row level security;
alter table public.operating_state enable row level security;
alter table public.priority_dispatch enable row level security;
alter table public.feature1_metering enable row level security;

drop policy if exists "authenticated read telemetry" on public.telemetry;
create policy "authenticated read telemetry" on public.telemetry for select to authenticated using (true);

drop policy if exists "authenticated read energy_history" on public.energy_history;
create policy "authenticated read energy_history" on public.energy_history for select to authenticated using (true);

drop policy if exists "authenticated read alerts" on public.alerts;
create policy "authenticated read alerts" on public.alerts for select to authenticated using (true);
drop policy if exists "authenticated acknowledge alerts" on public.alerts;
create policy "authenticated acknowledge alerts" on public.alerts for update to authenticated using (true) with check (true);

drop policy if exists "authenticated read solar_forecast" on public.solar_forecast;
create policy "authenticated read solar_forecast" on public.solar_forecast for select to authenticated using (true);

drop policy if exists "authenticated read load_forecast" on public.load_forecast;
create policy "authenticated read load_forecast" on public.load_forecast for select to authenticated using (true);

drop policy if exists "authenticated read optimization_decisions" on public.optimization_decisions;
create policy "authenticated read optimization_decisions" on public.optimization_decisions for select to authenticated using (true);

drop policy if exists "authenticated read operating_state" on public.operating_state;
create policy "authenticated read operating_state" on public.operating_state for select to authenticated using (true);

drop policy if exists "authenticated read priority_dispatch" on public.priority_dispatch;
create policy "authenticated read priority_dispatch" on public.priority_dispatch for select to authenticated using (true);

drop policy if exists "authenticated read feature1_metering" on public.feature1_metering;
create policy "authenticated read feature1_metering" on public.feature1_metering for select to authenticated using (true);

-- ============================================================================
-- REALTIME
-- Adds these tables to the default `supabase_realtime` publication so
-- postgres_changes subscriptions on the client receive INSERT/UPDATE events.
-- ============================================================================

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'telemetry'
  ) then
    alter publication supabase_realtime add table
      public.telemetry,
      public.energy_history,
      public.alerts,
      public.solar_forecast,
      public.load_forecast,
      public.optimization_decisions,
      public.operating_state,
      public.priority_dispatch,
      public.feature1_metering;
  end if;
end $$;

-- ============================================================================
-- SEED DATA (mirrors client/src/data/mockData.ts so the UI isn't empty)
-- ============================================================================

insert into public.telemetry (site, solar_kw, grid_kw, battery_soc, battery_kw, load_kw, critical_load_kw, tier2_load_kw, tier3_load_kw, estimated_savings_inr, grid_connected)
values ('Apollo Care Campus', 42.5, 12.3, 78, 8.4, 51.2, 30.4, 13.8, 7.0, 1240, true);

insert into public.energy_history (time_label, solar, demand, battery, grid, forecast) values
  ('06', 2, 29, 0, 27, 3),
  ('07', 8, 32, 0, 24, 7),
  ('08', 17, 35, 2, 16, 15),
  ('09', 28, 39, 5, 6, 25),
  ('10', 36, 45, 7, 2, 34),
  ('11', 42.5, 51.2, 8.4, 12.3, 40),
  ('12', 49, 53, 10, 0, 47),
  ('13', 53, 57, 11, 0, 55),
  ('14', 47, 60, 12, 1, 50),
  ('15', 37, 62, -7, 18, 40),
  ('16', 23, 55, -12, 20, 26),
  ('17', 9, 46, -10, 27, 10);

insert into public.alerts (title, detail, occurred_at, state, site, status, asset_id) values
  ('Grid instability detected', 'Voltage variance above preferred operating band. Critical loads remain protected.', '07:42', 'critical', 'Apollo Care Campus', 'Open', 'GRID-01'),
  ('Dispatch activated', 'Battery discharge initiated to offset projected demand peak while preserving Tier 01 reserve.', '07:43', 'watch', 'Apollo Care Campus', 'Open', 'BESS-01'),
  ('Critical load protection active', 'Tier 01 allocation held at 30.4 kW — ICU, emergency lighting, cold-chain circuits.', '07:44', 'healthy', 'Apollo Care Campus', 'Open', 'LOAD-T1'),
  ('Solar output above forecast', 'Irradiance ahead of model; battery charging window extended.', '07:48', 'healthy', 'Apollo Care Campus', 'Open', 'PV-01'),
  ('Cold-chain load stable', 'Temperature-protection circuit operating within expected consumption range.', '09:41', 'healthy', 'Cold Storage Wing', 'Acknowledged', 'LOAD-T2');

insert into public.solar_forecast (current, next_hour, peak_expected, confidence) values (42, 48, 55, '92%');
insert into public.load_forecast (current, expected_peak, peak_time) values (51, 68, '14:30');

insert into public.optimization_decisions (action, reason, expected_effect, confidence) values (
  'Discharge BESS-01',
  'Projected demand exceeds available solar generation during the upcoming peak window.',
  '[{"label":"Grid import","value":"-18%"},{"label":"Critical reserve","value":"+12 min"}]',
  'High confidence'
);

insert into public.operating_state (mode, flow_state, mode_detail) values (
  'Self-Powered', 'normal', 'Solar currently covers critical and facility demand while BESS absorbs surplus.'
);

insert into public.priority_dispatch (tier, asset_id, label, description, state, status, allocation) values
  ('Tier 01', 'LOAD-T1', 'Critical', 'ICU, emergency lighting, cold-chain protection', 'Protected', 'healthy', '30.4 kW'),
  ('Tier 02', 'LOAD-T2', 'Important', 'Clinical support and operations', 'Reduce if required', 'watch', '13.8 kW'),
  ('Tier 03', 'LOAD-T3', 'Deferrable', 'Non-essential deferred loads', 'Shed if required', 'neutral', '7.0 kW');

insert into public.feature1_metering (metric, current_value, reference_value, status, source) values
  ('Daily solar export', '148.6 kWh', 'Demo baseline 132.0 kWh', 'Above baseline', 'Mock utility meter'),
  ('Grid import', '84.2 kWh', 'Demo ceiling 110.0 kWh', 'Within target', 'Mock campus meter'),
  ('Demand peak', '68.0 kW', 'Demo reference 72.0 kW', 'Within target', 'Mock demand meter');
