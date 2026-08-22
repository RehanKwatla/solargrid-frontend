# SolarGrid Frontend

SolarGrid is a **hackathon-ready, static frontend MVP** for a smart solar-grid and energy-optimization platform serving critical infrastructure in India. It makes the complete operating story visible with centralized mock data: **solar + grid + battery + loads → telemetry services → forecasting → optimization → priority-based energy allocation**.

The UI uses the **Grid Atlas** system: graphite operational surfaces, an instrument-rail navigation system, technical mono labels, photovoltaic chamfers, and Signal Lime (`#D8FF3E`) reserved for selected, live, and healthy system state.

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
| `/` | Redirects to `/overview`. |
| `/overview` | Live mock energy overview, operating mode, KPI field, and state-ready power allocation diagram. |
| `/energy` | Solar, demand, battery, and grid analytics with an operational energy-mix view. |
| `/intelligence` | Mock forecast, optimization recommendation, and tier-priority dispatch policy. |
| `/alerts` | Severity-aware mock event stream with local acknowledgement interaction. |
| `/feature-1` | **Metering** instrument for future government-reference and utility-meter data; every value is explicitly marked as demo data. |

## Component and service map

| Area | Role |
| --- | --- |
| `client/src/components/layout` | Desktop instrument rail, top controls, and responsive mobile drawer. |
| `client/src/components/power-flow/PowerFlow.tsx` | State-ready visual allocation path across solar, EMS, battery, grid, critical, Tier 2, and Tier 3 loads. |
| `client/src/components/charts/EnergyChart.tsx` | Reusable operational chart for solar, facility demand, battery power, and grid consumption. |
| `client/src/components/alerts/AlertList.tsx` | Reusable alert list with prototype acknowledgement state. |
| `client/src/data/mockData.ts` | Centralized telemetry, operating mode, power-flow, forecasts, optimization output, priority dispatch, alerts, energy history, and metering data. |
| `client/src/services/api.ts` | Mock-ready functions: `getTelemetry`, `getForecast`, `getOptimization`, `getAlerts`, `getHistoricalEnergy`, and `getFeature1Data`. |
| `client/src/services/websocket.ts` | Safe local telemetry simulation abstraction. It does not connect to an external backend. |
| `client/src/services/firebase.ts` | Environment-backed configuration placeholder only; Firebase is not initialized. |

## What is mocked

All numeric telemetry, forecasts, optimization recommendations, dispatch policy, alerts, historical energy data, and meter values are mock data. The acknowledgement action updates local UI state only. The product does not claim live hardware, real-time telemetry, government statistics, Firebase, APIs, authentication, or control authority.

## What to connect later

Replace the service methods with approved backend endpoints, map incoming telemetry to the centralized types, and drive `operatingState` from a real system-state feed. Connect actual forecasts and optimizer output only after validation, and use research-backed meter data for the Metering instrument. The repository’s `memory.md` and `agents.md` define the workflow required for these changes.
