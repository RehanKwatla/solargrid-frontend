# SolarGrid Frontend

SolarGrid is a smart solar-grid and energy-optimization platform serving critical infrastructure in India. It makes the complete operating story visible: **solar + grid + battery + loads → telemetry services → forecasting → optimization → priority-based energy allocation**.

The UI uses the **Grid Atlas** system: graphite operational surfaces, an instrument-rail navigation system, technical mono labels, photovoltaic chamfers, and Signal Lime (`#D8FF3E`) reserved for selected, live, and healthy system state.

## Backend: Supabase

The app is backed by [Supabase](https://supabase.com) for auth and data. All operational data (telemetry, energy history, alerts, forecasts, optimization decisions, priority dispatch, and metering) lives in Postgres tables and updates live in the UI via Supabase Realtime.

### 1. Apply the schema

In your Supabase project's SQL editor, run `supabase/migrations/0001_init.sql`. This creates the tables, row-level security policies, adds the tables to the realtime publication, and seeds them with starter data so the UI isn't empty.

### 2. Configure environment variables

Copy `.env.example` to `.env` at the **repo root** (not inside `client/`) and fill in your project's URL and anon/publishable key, found under Project Settings → API in the Supabase dashboard:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

### 3. Auth

The dashboard routes (`/overview`, `/energy`, `/intelligence`, `/alerts`, `/feature-1`) are gated behind Supabase Auth. Visit `/login` to create an account (email/password) or sign in. By default Supabase requires email confirmation for new accounts — disable that in Authentication → Providers → Email if you want instant sign-in during a demo, or use magic links/social providers instead by extending `client/src/contexts/AuthContext.tsx`.

### 4. What's live vs. still local

| Data | Source |
| --- | --- |
| Telemetry (solar/grid/battery/load kW, SoC, savings) | `telemetry` table, live via realtime INSERT |
| Energy history chart series | `energy_history` table, live via realtime INSERT |
| Alerts / event log, including acknowledgement | `alerts` table; acknowledging writes an UPDATE that syncs across clients |
| Solar & load forecasts | `solar_forecast` / `load_forecast` tables |
| Dispatch recommendation & operating mode | `optimization_decisions` / `operating_state` tables |
| Tier 01–03 priority dispatch policy | `priority_dispatch` table |
| Metering instrument (`/feature-1`) | `feature1_metering` table |
| Panel-tracking animation (sun position, tracker angle) | Still a local physics simulation (`client/src/lib/solarSimulation.ts`) — it's a UI demo of panel movement, not telemetry, so it wasn't moved to the database. It now uses live telemetry as its baseline instead of the static mock. |

None of the tables are written to automatically — seed data is a snapshot. To see real "live" movement (new telemetry ticking in, a new alert appearing), insert new rows into `telemetry` / `alerts` / etc. from the Supabase dashboard, the SQL editor, or a script; the UI will pick it up over Realtime without a refresh.

## Running the project

```bash
# Either package manager can run the declared development script.
pnpm dev
# or
npm run dev

# Verification
pnpm check
pnpm build
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing/intro page. |
| `/login` | Sign in / create account. |
| `/overview` | Live energy overview, operating mode, KPI field, and power allocation diagram. |
| `/energy` | Solar, demand, battery, and grid analytics with an operational energy-mix view. |
| `/intelligence` | Forecast, optimization recommendation, and tier-priority dispatch policy. |
| `/alerts` | Severity-aware event stream with acknowledgement synced to the database. |
| `/feature-1` | **Metering** instrument for utility-meter data. |

## Component and service map

| Area | Role |
| --- | --- |
| `client/src/components/layout` | Desktop instrument rail, top controls, and responsive mobile drawer. Profile icon in `TopBar` signs out. |
| `client/src/components/power-flow/PowerFlow.tsx` | Live visual allocation path across solar, EMS, battery, grid, critical, Tier 2, and Tier 3 loads. |
| `client/src/components/charts/EnergyChart.tsx` | Reusable operational chart; takes energy history data as a prop. |
| `client/src/lib/supabase.ts` | Supabase client singleton, reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. |
| `client/src/contexts/AuthContext.tsx` | Session state, `signIn` / `signUp` / `signOut`. |
| `client/src/hooks/` | One hook per data domain (`useTelemetry`, `useEnergyHistory`, `useAlerts`, `useForecast`, `useOptimization`, `usePriorityDispatch`, `useFeature1Metering`), each doing an initial fetch plus a Realtime subscription. |
| `client/src/types/database.ts` | Hand-written TypeScript mirror of the Supabase schema. |
| `client/src/services/api.ts` | One-shot Supabase query wrappers, kept for non-live call sites. |
| `client/src/services/websocket.ts` | Plain subscribe/unsubscribe wrapper around Supabase Realtime for non-React call sites. |
| `supabase/migrations/0001_init.sql` | Schema, RLS policies, realtime publication, and seed data. |

## What to connect later

Seed data is a static snapshot. To make the dashboard feel truly live, add a small process (edge function, cron job, or IoT ingestion pipeline) that periodically inserts new `telemetry` and `energy_history` rows, and creates rows in `optimization_decisions` / `solar_forecast` / `load_forecast` from your actual forecasting/optimization model. The repository's `memory.md` and `agents.md` define the workflow required for these changes.

