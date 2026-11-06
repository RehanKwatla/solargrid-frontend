# SolarGrid Repository Memory

> **Purpose:** This is the durable operating context for people and AI agents working in this repository. Read it completely before exploring files, making assumptions, or changing code. Update it after every completed task.

## Product context

SolarGrid is a static frontend prototype for a distributed-solar operations platform. Its users are asset operators who need a calm, high-signal view of generation, storage, export, fleet health, and operational attention items.

The product's current promise is: **the focused operating layer for teams who need to see, understand, and act on distributed solar performance without noise.** The brand personality is precise, calm, and field-ready.

## Current implementation

| Area | Current decision |
| --- | --- |
| Framework | React 19, TypeScript, Vite, Tailwind CSS 4, Wouter, Recharts, Three.js (react-three/fiber + drei). |
| Application root | The frontend source tree is `client/src/`, following the managed static-project template. |
| Routes | `/overview`, `/energy`, `/intelligence`, `/alerts`, `/feature-1`. `/` redirects to `/overview`. |
| Layout | `DashboardLayout` supplies a sticky desktop instrument rail, compact top control bar, and mobile bottom tab bar. |
| Visual system | **Grid Atlas**: blue-black graphite surfaces, low-key field imagery, Space Grotesk display type, IBM Plex Mono utility text, micro-grid texture, and Signal Lime for selected/live/healthy state. |
| Signal Lime | `#D8FF3E`; reserve it for selected navigation, live or healthy state, decisive numerals, and locator geometry. Amber (#f1bf70) and coral (#fa856e) are reserved for watch and critical conditions. |
| UI components | Reusable components are grouped by function beneath `components/layout`, `dashboard`, `power-flow`, `charts`, `alerts`, `solar-tracking`, and `common`. |
| Data and services | `data/mockData.ts` contains typed prototype data. `services/api.ts` and `websocket.ts` are intentionally client-safe seams, not live integrations. |
| Visual assets | Brand mark and visual imagery are stored through managed `/manus-storage/` URLs. Do not copy large media into the project tree. |
| 3D Solar Tracking | Full Three.js solar panel tracking simulation with panel model, sun model, azimuth/tilt controls, time presets, and day simulation playback. Panel rotates to follow simulated sun. |
| Operating modes | 4 modes: Self-Powered, Cost Saving, Emergency Watch, Grid Backup. Currently hardcoded to Self-Powered. |
| Power flow | 5-node energy flow: Solar → EMS → Battery → Grid → Critical Loads. Desktop shows animated connectors with directional arrows. Mobile shows 2-column grid. |
| Mobile | Bottom tab bar for quick route navigation, slide-out drawer for full navigation. |
| Critical load tiers | Tier 1 (Critical), Tier 2 (Important), Tier 3 (Deferrable) — shown in power flow and intelligence pages. |

## Design non-negotiables

The desktop experience must retain a visible proprietary navigation anchor: the chartreuse solar-core mark, SolarGrid wordmark, and left-edge instrument rail. Every route should read as an **operations map**: one dominant intelligence plane supported by satellite modules, with locator lines and status pips clarifying relationships.

Avoid generic bright SaaS panels, purple gradients, rounded-card monoculture, default Inter typography, and decorative neon. Operational language should be concrete and field-aware, such as "Review dispatch plan," not generic starter copy.

## CSS Design System — Key Classes

| Class | Purpose |
| --- | --- |
| `.dashboard-canvas` | Main page background with micro-grid texture |
| `.operational-panel` | Standard panel with border, gradient, shadow, and left accent mark |
| `.hero-reading` | Panel with background image and gradient overlay |
| `.section-label` | IBM Plex Mono 10px uppercase utility label |
| `.action-button` | Signal Lime outlined action button |
| `.node-icon` / `.node-icon-amber` | Standard and amber icon badges |
| `.pf-node` / `.pf-node-active` | Power flow node with optional glow animation |
| `.flow-line-lime` / `.flow-line-amber` | Animated energy flow connectors |
| `.mode-bar` | Operating mode indicator bar |
| `.kpi-value` | Large animated value display |
| `.metric-inline` | Compact inline metric row |
| `.alert-critical` / `.alert-watch` / `.alert-info` | Severity-based alert left borders |
| `.mobile-tab-bar` | Fixed bottom navigation for mobile |
| `.live-dot` | Pulsing green dot for live status |
| `.live-shimmer` | Subtle shimmer animation for live values |

## Working conventions

| Topic | Required approach |
| --- | --- |
| Before coding | Read this file completely, review `agents.md`, and add specific unchecked work items to `todo.md` for substantial changes. |
| New work | Preserve the existing route shell and reusable component organization. Prefer a small component extension over page-level duplication. |
| State and data | Keep mock data typed and centralized. Do not portray a mock interaction as a working real-world control. |
| External systems | Do not introduce credentials, API calls, analytics vendors, payment flows, or persistent data without explicit user approval and the appropriate project capability. |
| Visual assets | Use managed asset URLs for media. Ensure text stays readable over imagery with deliberate overlays. |
| Verification | Run `npx tsc --noEmit` and `npx vite build` after implementation work. Inspect key routes visually before declaring the task complete. |
| Handoff | Update this file with what changed, relevant decisions, verification status, and any unresolved follow-up. |

## Last completed changes

| Date | Change | Verification |
| --- | --- | --- |
| 2026-08-22 | Created the initial SolarGrid Grid Atlas dashboard, including five routes, reusable UI modules, mock data, service seams, managed visual assets, and a branded desktop instrument rail. | `pnpm check` and `pnpm build` passed. Visual review completed. |
| 2026-08-22 | Added `agents.md`, `memory.md`, and `todo.md` to provide persistent guidance for future AI and automated work. | Required files exist, `git diff --check` passed, and checkpoint `d95b3b16` was created. |
| 2026-08-22 | Applied the attached Smart Solar Grid & Energy Optimization MVP guidance. Added centralized critical-infrastructure mock data, safe service methods, a state-ready power-flow diagram, four operational energy charts, mock forecast/optimization/dispatch UI, local alert acknowledgement, responsive mobile navigation, `/overview` root routing, and a Metering data instrument. | Desktop and mobile route screenshots reviewed. `pnpm check`, `pnpm build`, and `git diff --check` passed. |
| 2026-08-22 | Tested the enabled GitHub connector with read-only GitHub CLI calls. | Authenticated profile and three recently updated public repositories were returned successfully; no repository content was changed. |
| 2026-08-22 | **Mission-critical energy control UI overhaul.** Restructured Overview page with proper visual hierarchy (status banner → mode indicator → KPIs → 3D solar → power flow → protection posture → alerts). Created ModeIndicator component. Enhanced PowerFlow with animated connectors and directional arrows. Enhanced MetricBlock with icon support and accent lines. Added live status overlay to 3D solar canvas. Created MobileTabBar for mobile navigation. Updated TopBar with live clock. Enhanced AlertList with severity-based borders. Updated NotFound page to Grid Atlas dark theme. Enhanced Intelligence page with forecast cards and tier flow visualization. Added comprehensive CSS animation system (flow-dash, flow-pulse, node-glow, value-count, battery-charge, alert-slide, shimmer-in, mobile-tab-bar). | `npx tsc --noEmit` and `npx vite build` both pass. |
| 2026-08-22 | Applied the mandatory Natural Web Design direction to the overview. Replaced the repetitive rounded-card composition with a field-instrument layout: datum rules, technical labels, shared boundaries, an earth/field palette, Space Grotesk + IBM Plex Mono, a daylight tracker scene, and an energy-bus diagram. Tracker telemetry stacks below the canvas until ample horizontal space is available. Routes, mock data, controls, and simulation behavior were preserved. | Local `tsc --noEmit` passed; desktop and mobile were rendered in local Chrome and inspected. Vite production build was attempted outside the sandbox but did not print a completion result after transform (existing undefined analytics-template warnings appeared), so it is not marked as passed. |
| 2026-09-01 | Fixed the Vite development API runtime error. The API router had been mounted directly on Vite's Connect middleware, whose raw Node response lacks Express helpers such as `res.json`. It is now mounted through a small Express app that initializes Express request/response helpers before routing. The landing iframe, CSS viewport dimensions, and Three.js canvas were inspected live; no scaling transform, zoom, or pixel-ratio/layout coupling was present, and no landing animation or scene code was changed. | Live `GET /api/health` returned JSON; root landing loaded with no console errors, normal 1x overlay measurements, and intact forward/back scroll behavior. Implemented routes loaded without errors; `/metering`, `/events`, and `/settings` remain unimplemented and resolve to Not Found. `npm run check` passed. `npm run build` again stopped after Vite's existing undefined analytics-template warnings, so build and browser zoom tests are not marked passed. |
| 2026-09-01 | Re-audited the urgent landing first-scroll scaling report. `SolarGridIntro` embeds an isolated fixed `100vw × 100vh` iframe; the intro overlay is direct document DOM and has no transformed, scaled, zoomed, or oversized ancestor. The canvas uses CSS viewport sizing and capped DPR independently. No CSS, camera, model, scene, animation, or renderer change was warranted; the observed one-third overlay is consistent with persisted browser/site zoom near 33%. The prior uncommitted Express sub-app repair in `vite.config.ts` remains the correct API fix. | `GET /api/health` returned JSON and `npm run check` passed. Automated visual/browser zoom verification could not run because the available Chrome instance crashed before screenshot/CDP initialization; 90/100/110/125% checks, console capture, other-page visual review, and clean production-build completion remain open. Reset the browser site zoom to 100% before manual comparison. |
| 2026-11-06 | **Backend Generation and Full-Stack Integration.** Generated and integrated a complete, stateful Node.js + Express backend (`server/index.ts`, `server/routes.ts`, `server/storage.ts`). Implemented 20+ REST API endpoints covering system health (`/api/health`), facility identity, live telemetry with realistic micro-variations (`/api/telemetry`), 24h/7d energy history, operating mode switching, solar and load forecasting, AI optimization decisions, load tiers, power quality metering, alert CRUD & acknowledgement, hospital critical loads & clinical audit trails, emergency mode controls, P2P microgrid energy sharing (transactions, peers, sell/request), hospital campus & department hierarchy, room priority policies, and simulation scenario management. Added Server-Sent Events (`/api/stream`) for real-time telemetry streaming. Embedded backend into Vite dev server via `vitePluginSolarGridApi()` in `vite.config.ts` for unified `pnpm dev` execution, and configured production bundling via `esbuild server/index.ts --outdir=dist` with static file serving and SPA client fallback in `dist/index.js`. Connected frontend services (`api.ts`, `DepartmentsRooms.tsx`, `HospitalScenarioSimulator.tsx`, `ModeIndicator.tsx`, `Alerts.tsx`, `websocket.ts`) to consume live backend data, switch modes interactively, dispatch contingency scenarios, and stream live SSE telemetry. | `pnpm check` and `pnpm build` passed with zero errors. Verified live API endpoints (`GET /api/health`, `GET /api/telemetry`, `GET /api/hospital/rooms`, `PATCH /api/hospital/rooms/:id/priority`, `PATCH /api/alerts/:id/acknowledge`, `GET /api/load-audit-logs`) across both standalone server on port 5000 and Vite dev middleware on port 3000. |
| 2026-11-06 | **Complete UI/UX redesign.** Replaced the dashboard theme with an ink-black canvas, lavender/pink/mint/lemon palette, editorial Space Grotesk hierarchy, sharper neo-brutalist borders and shadows, and responsive bento layouts. Added route-specific asymmetric grid spans for Energy, Intelligence, Energy Sharing, and Critical Loads; applied the shared visual treatment across Overview, Departments, Alerts, Metering, Settings, public Landing, and Not Found. Existing components, routes, API calls, form and simulation controls, and data workflows were retained. The prompt referenced a visual image, but only its text attachment was available. | `npm run check` and `npm run build` passed (TypeScript, Vite production build, and server esbuild bundle); `git diff --check` passed. `pnpm check`/`pnpm build` could not launch because Corepack attempted an unavailable npm registry fetch. Browser rendering and interactions remain unverified: the in-app browser could not reach local Vite and computer-use stopped because the active Chrome URL could not be confidently identified. |

## Open opportunities

The next highest-value product increments are live inverter/weather/battery telemetry, interactive asset topology with drill-down, and action workflows for alert acknowledgement and storage dispatch. The current `operatingState` and service seams were deliberately shaped so all demo states can later be supplied by one validated system-state feed. Treat these as opportunities, not commitments; validate scope and integration readiness before implementation.
