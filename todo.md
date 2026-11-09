# Active Repository Tasks

## Full-Stack Backend Integration Expansion & Git Sync — Complete

- [x] Connect `HospitalScenarioSimulator` to `api.applyHospitalScenario` and dashboard data refetching.
- [x] Connect operating mode switching in `DashboardDataContext` and `ModeIndicator` to `/api/operating-mode`.
- [x] Upgrade `client/src/services/websocket.ts` to stream from `/api/stream` (SSE) with live event distribution.
- [x] Ensure alert acknowledgement across `AlertList` and `Alerts` connects to `/api/alerts/:id/acknowledge`.
- [x] Run `pnpm check` and `pnpm build` verification.
- [x] Update `memory.md` with integration details.
- [x] Commit all changes and push to git repository (`git push origin main`).

## Backend Generation and Full-Stack Integration — Complete

- [x] Design and create server architecture (`server/index.ts`, `server/routes.ts`, `server/storage.ts`).
- [x] Implement all REST API endpoints matching frontend contracts:
  - [x] System health (`/api/health`) and Facility identity (`/api/facility`)
  - [x] Live Telemetry with dynamic variation (`/api/telemetry`)
  - [x] Historical Energy 24h/7d/30d datasets (`/api/energy-history`)
  - [x] Operating Mode switching and state (`/api/operating-mode`)
  - [x] Solar and Load Forecasts (`/api/forecast`)
  - [x] Optimization decisions (`/api/optimization`)
  - [x] Priority Dispatch / Load Tiers (`/api/priority-dispatch`, `/api/load-tiers`)
  - [x] Metering records (`/api/metering`)
  - [x] Alert management and acknowledgement (`/api/alerts`, `/api/alerts/:id/acknowledge`)
  - [x] Hospital critical loads & audit logs (`/api/hospital-loads`, `/api/hospital-loads/:id/priority`, `/api/load-audit-logs`)
  - [x] Emergency mode controls (`/api/emergency-mode`)
  - [x] P2P Energy sharing summary, peers, and transactions (`/api/energy-sharing/*`)
  - [x] Hospital campus, departments, rooms, and scenario simulation endpoints (`/api/hospital/*`)
  - [x] Real-time telemetry event stream (SSE `/api/stream`)
- [x] Integrate backend into Vite dev environment via Vite API middleware plugin so `pnpm dev` serves both seamlessly.
- [x] Update `package.json` build and start scripts to build and run standalone backend server (`dist/index.js`).
- [x] Connect frontend services (`api.ts`, `DepartmentsRooms.tsx`) to use backend endpoints.
- [x] Verify TypeScript types (`pnpm check`) and build (`pnpm build`).
- [x] Test API endpoints and verify that frontend status switches to live.
- [x] Update `memory.md` with decisions, changes, and verification.

## Runtime Error and Landing Restoration — In Progress

- [x] Re-audit the landing first-scroll DOM and all parent coordinate systems against the supplied restoration brief.
- [x] Make only a proven viewport/renderer correction; preserve the intro scene, camera, model, animation, and scroll choreography. No source correction was warranted.
- [ ] Visually verify the landing at 90%, 100%, 110%, and 125% browser zoom and check implemented routes for shared-style regressions.
- [ ] Run type check and production build, then record the final restoration result in repository memory. `npm run check` passed; production build still needs a clean completion.
- [x] Reproduce and trace the live `res.json is not a function` exception to the Vite API middleware.
- [x] Apply the smallest root-cause correction without disturbing unrelated working-tree changes.
- [x] Inspect the landing overlay and canvas coordinate systems; confirm normal CSS scale while preserving the 3D animation.
- [x] Verify the live API, landing default viewport, landing scroll behavior, smaller desktop viewport, and implemented routes.
- [x] Run the project type check and record the build limitation and route gaps in memory.
- [ ] Perform real browser zoom checks at 90%, 110%, and 125% when browser zoom control is available.
- [ ] Resolve the existing production-build completion issue caused after Vite reports undefined analytics-template environment values.

## Natural SolarGrid Design Refinement — Complete

- [x] Audit the current route shell, tracker, charts, and visual system against the required Natural Web Design guidance.
- [x] Refine the shared visual language and key overview modules into a more grounded, instrument-led composition without changing behavior.
- [x] Render and inspect the primary desktop and mobile views; run typecheck and attempt production build.
- [x] Record the design decision, verification, and follow-up in `memory.md`.

- [x] Create durable agent guidance in `agents.md`.
- [x] Record the current SolarGrid architecture and product context in `memory.md`.
- [x] Save a verified checkpoint containing the repository guidance.

> Future agents must add their task-specific checklist items here before substantial implementation work, then mark them complete only after verification.

## Attached Guidance Update — Complete

- [x] Review the attached guided prompt and map its requirements to the current SolarGrid architecture.
- [x] Implement the scoped frontend, data, and documentation changes required by the guidance.
- [x] Verify the affected experience and update `memory.md` with the completed work.

## GitHub Connector Test — Complete

- [x] Inspect the configured GitHub connector and confirm safe read-only access.
- [x] Fetch a small non-sensitive GitHub data sample and report the result.
- [x] Record the connector test outcome in `memory.md`.

## Mission-Critical Energy Control UI Overhaul — Complete

- [x] Audit entire frontend: routes, components, styling, dependencies, mock data, responsive behavior, 3D solar tracking, dashboard layout.
- [x] Add CSS animation system: energy flow dash/pulse, node glow, value count, battery charge, alert slide, shimmer-in, mobile tab bar styles.
- [x] Restructure Overview page: status banner → operating mode → KPIs → 3D solar → power flow + mode detail → protection posture + alerts.
- [x] Create ModeIndicator component: prominent operating mode bar with mode badge, detail text, and quick status chips (solar/battery/grid).
- [x] Enhance PowerFlow: animated flow connectors with pulsing lines and directional arrows, mobile 2-column grid fallback.
- [x] Enhance MetricBlock: optional Lucide icon support, gradient top accent line, animated value class, improved spacing.
- [x] Polish SolarTracking3D: live status overlay (bottom-left) with time and tracking status, generation readout (bottom-right).
- [x] Simplify SolarTrackingSection: single controls block below stats, live tracking badge in header.
- [x] Create MobileTabBar: fixed bottom 5-tab navigation for mobile (Overview, Energy, Intel, Alerts, Metering).
- [x] Update DashboardLayout: added MobileTabBar, adjusted padding for bottom tab bar on mobile.
- [x] Update TopBar: live clock indicator with formatted simulation time and pulsing dot.
- [x] Enhance AlertList: severity-based left border (alert-critical, alert-watch, alert-info), staggered animation.
- [x] Polish StatusPill: animated pulse for critical, static dot for watch, cleaner rendering.
- [x] Update NotFound page: Grid Atlas dark theme, operational-panel styling, consistent action-button.
- [x] Enhance Intelligence page: forecast cards with distinct border colors (solar=lime, demand=amber), tier flow visualization, improved tier dispatch cards.
- [x] Run typecheck (`tsc --noEmit`) and production build (`vite build`) — both pass.

### Remaining weaknesses / follow-up

- [ ] No real telemetry integration — all data is mock. When live data arrives, the SolarTrackingContext and api.ts service seams are ready.
- [ ] PowerFlow does not yet animate actual particle movement along connectors — current implementation uses CSS pulsing.
- [ ] Operating mode switching is not yet interactive (mode is hardcoded to "Self-Powered").
- [ ] Energy charts on the Energy page are not updated with the new CSS design system refinements.
- [ ] The mobile bottom tab bar could benefit from a badge count on the Alerts tab.
- [ ] No dark/light theme toggle is exposed in the UI (ThemeProvider supports it, but switchable defaults to false).

## Complete UI/UX Redesign — In Progress

- [x] Audit application routes, shared shell, frontend services, and page workflows before styling changes.
- [x] Establish the lavender, mint, pink, lemon, charcoal design tokens and responsive bento layout primitives.
- [x] Redesign the shared dashboard shell and route pages while preserving all existing controls, API calls, and business behavior.
- [x] Run type check and production client/server builds. `npm run check` and `npm run build` passed; the `pnpm` launcher attempted an unavailable registry fetch.
- [ ] Inspect desktop and mobile views for primary routes and verify major interactions.
- [x] Update `memory.md` with design decisions, verification, and any follow-up.

> Visual review remains open because the in-app browser could not reach the local Vite server, and Windows computer-use stopped when it could not confidently identify the active Chrome URL. No browser layout or interaction behavior is claimed as verified.

## Supabase Environment Configuration — In Progress

- [x] Add the provided Supabase project URL and publishable key to ignored root `.env.local` using Vite variable names.
- [x] Update the tracked environment example and existing Supabase client to recognize the publishable key while preserving the anon-key fallback.
- [x] Run type check and production build; verify `.env.local` remains ignored and uses only the browser-safe publishable key.
- [x] Record the Vite-specific integration decision and verification in `memory.md`.

> Supabase project connectivity, database schema, and row-level security permissions still need an environment-level check. Next.js SSR helpers and middleware were not added because this application runs as a Vite SPA with an Express API.
