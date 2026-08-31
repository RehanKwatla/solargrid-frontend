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
| Routes | `/` serves the locked SolarGrid 3D intro before the user enters the dashboard; dashboard routes are `/overview`, `/energy`, `/intelligence`, `/alerts`, and `/feature-1`. |
| Layout | `DashboardLayout` supplies a sticky desktop instrument rail, compact top control bar, and mobile bottom tab bar. |
| Visual system | **Grid Atlas**: blue-black graphite surfaces, low-key field imagery, Space Grotesk display type, IBM Plex Mono utility text, micro-grid texture, and Signal Lime for selected/live/healthy state. |
| Signal Lime | `#D8FF3E`; reserve it for selected navigation, live or healthy state, decisive numerals, and locator geometry. Amber (#f1bf70) and coral (#fa856e) are reserved for watch and critical conditions. |
| UI components | Reusable components are grouped by function beneath `components/layout`, `dashboard`, `power-flow`, `charts`, `alerts`, `solar-tracking`, and `common`. |
| Data and services | `data/mockData.ts` contains typed prototype data. `data/types.ts` has comprehensive Supabase schema types. `services/api.ts` queries Supabase when configured, falls back to mock. `hooks/useSupabaseData.ts` provides domain-specific data hooks. `contexts/DashboardDataContext.tsx` aggregates all data with loading/error/status. `lib/supabase.ts` initializes the Supabase client from VITE_ env vars. |
| Visual assets | Brand mark and visual imagery are stored through managed `/manus-storage/` URLs. Do not copy large media into the project tree. |
| 3D Intro source of truth | `solargrid-brutalist-hero (4).html` is the sole approved, locked source/reference for the root 3D intro. Never use or merge `solargrid-brutalist-hero (3).html`; do not alter Version 4's scene, environment, tracker architecture, animation, telemetry, final Smart Grid state, or Enter SolarGrid button. Dashboard enhancements—including Strands—begin only after entering the dashboard. |
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
| 2026-08-23 | Added one shared OGL Strands energy-field backdrop to `DashboardLayout` only. The field uses restrained Grid Atlas palettes for dark/light themes, capped DPR, pointer-event isolation, responsive opacity/height, `prefers-reduced-motion` static rendering, and WebGL/observer cleanup. The root SolarGrid intro and all dashboard content/behavior remain outside the change. | `npm run check` and a direct `npx tsc --noEmit` passed. Automated browser QA confirmed readable desktop dark and mobile views, one Strands canvas on dashboard routes, and no Strands canvas on `/` while the intro remains present. Direct Vite builds consistently transformed 2,884 modules but did not return a completion result before the local execution limit; existing undefined analytics template warnings were emitted. `pnpm check` remains blocked by pnpm build-script approval for existing tooling. |
| 2026-08-23 | Adopted Version 4 (`solargrid-brutalist-hero (4).html`) as the exact, served root intro; Version 3 is prohibited. The `SolarGridIntro` iframe host adds the dashboard transition externally, leaving the locked HTML—including scene and CTA markup—byte-for-byte intact. | SHA-256 hashes for Version 4 and `client/public/solargrid-intro.html` match. Browser QA confirmed `/` loads the intro canvas and its Enter SolarGrid CTA, then transitions to `/overview`, where one Strands canvas is present. `npx tsc --noEmit` and `npx vite build` passed; Vite reported the pre-existing undefined analytics-template and large-chunk warnings. |
| 2026-08-23 | Rethemed the switchable light dashboard mode to the approved charcoal palette: charcoal canvas/surfaces, limestone typography, olive routine state, and terracotta attention state. Updated light-only Energy chart, tooltip, active-dot, energy-field, tracker-overlay, and slider-thumb values; `.dark` token and component branches remain unchanged. | Automated browser QA confirmed `#1C1C1A` canvas and no white Overview/Energy DOM surfaces in light mode, then toggled back to the existing `#151914` dark canvas. `npm run check` and `git diff --check` passed. `npm run build` began successfully and transformed modules but did not return a completion result before the local command limit; it emitted the existing undefined analytics-template warnings. |
| 2026-08-28 | **Dashboard responsive layout root-cause fix.** Replaced viewport-oblivious fixed widths and bare `fr` grid columns with constrained sizing across the stack. Root: html/body/#root/dashboard-shell now have width:100%, max-width:100%, min-width:0, and explicit box-sizing. Overview grid columns all use `minmax(0, Xfr)` instead of bare fractions — the classic CSS grid blowout issue. Fixed-width overview container `max-w-[1440px]` replaced with fluid `w-full max-w-full`. SolarTrackingSection internal layout rebuilt from `flex-row + 2xl:w-72 shrink-0` (forced min-width) to `xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]`, allowing both 3D canvas and telemetry to compress. Time-of-day preset buttons wrapped with `flex-wrap` and `min-w-[50%-gap]` on narrow columns to eliminate Night button clipping instead of forcing a 4-across row. PowerFlow diagram: removed `px-32` and `px-16` hard paddings (replaced with responsive stepped padding) and replaced fixed `w-48` node cards with `flex-1 max-w-[170–192px] min-w-0`. EnergyMetrics grid rewritten with minmax columns, responsive padding, truncation guards. TopBar padding and gaps reduced; secondary actions (search, theme toggle, dividers) now hide below sm/lg with proper shrink-0 + truncate on labels. Sidebar hardened with max-w and `overflow-x-hidden`. Locked intro page / 3D landing animation (solargrid-intro.html, SolarGridIntro.tsx iframe host) were deliberately not touched. | `npx tsc --noEmit` → 0 errors. `npm run build` → 0 exit code (2,884 modules transformed; existing undefined-analytics-template and chunk-size warnings retained as baseline). `GetDiagnostics` → empty array (no IDE diagnostics). Dev server opened on /overview via OpenPreview. Grep audit of remaining fixed widths confirms they are confined to dialogs, tables wrapped inside overflow-x-auto, and mobile tab bars with appropriate containers. |

## Last completed changes — 2026-08-28 Final Design Polish

| Change | Details |
| --- | --- |
| Color tokens refined | Light theme warmed (#f0f2eb), accent darkened to #4d7a1e for contrast. Dark theme stepped deeper (#0e110d/#131711/#191e16). Grid texture tokenized. |
| TopBar compacted | 72px → 60px, breadcrumbs refined, system status uses semantic tokens. |
| AppSidebar compacted | 268px → 256px, nav items tightened, brand mark scaled down. |
| SolarTracking theme-aware | All hardcoded hex overlays replaced with theme tokens (--accent-soft, --healthy-bg, --surface). |
| PowerFlow cleaned | Node cards refined, connectors with duration-300 transitions, semantic accent borders. |
| EnergyMetrics refined | Hero card cleaned, supporting metric grid standardized. |
| Energy page | Green battery card → themed panel. Supply bars standardized. Cards use consistent radius. |
| Intelligence page | Dispatch card uses bg-[var(--accent)] for reliable contrast. Load tiers cleaned. |
| Alerts page | Severity counts redesigned as grid with dot indicators. |
| Metering table | instrument-label headers, monospace source column. |
| NotFound | Replaced hardcoded coral with semantic danger tokens. |
| EnergyChart | Space Grotesk/IBM Plex Mono fonts, theme-aware tooltip styling. |
| EventStream | Severity borders use ring/30 tokens. |
| SolarTrackingControls | Preset buttons use healthy-bg tokens, buttons reduced to h-9. |
| SolarTrackingStats | Row dividers, consistent telemetry layout. |
| DayTimeline | Active dot uses accent color-mix glow. |
| Mobile components | TabBar touch targets refined, Navigation drawer compacted. |
| Bug fix | Overview.tsx assets import fixed (was undefined local declaration). |
| Landing page | Completely untouched (SolarGridIntro.tsx, solargrid-intro.html). |

**Verification:** `npx tsc --noEmit` → 0 errors. `npx vite build` → 2,884 modules, 0 errors. |

## Phase 1: Dashboard Data Layer — Complete

| Change | Details |
| --- | --- |
| Supabase client | Created `lib/supabase.ts` — initializes client from VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY env vars. Returns null when unconfigured, enabling seamless mock fallback. |
| Typed data models | Created `data/types.ts` — comprehensive TypeScript interfaces for all dashboard data: TelemetryReading, EnergyHistoryPoint, OperatingModeRecord, ForecastData, OptimizationDecision, LoadTier, AlertRecord, MeteringRecord, PredictedDemand, Facility, DataSourceStatus. |
| DataState components | Created `components/common/DataState.tsx` — reusable loading, error, empty, not-available, stale indicator, last-updated timestamp, and data source badge (live/mock/unavailable) components. |
| DashboardDataContext | Created `contexts/DashboardDataContext.tsx` — central provider aggregating all Supabase queries with per-domain loading/error/status. When Supabase is not configured, all data falls back to existing mock values. |
| API service updated | Rewrote `services/api.ts` — each method now checks isSupabaseConfigured, queries live backend, catches errors, and falls back to mock data. Returns consistent typed shapes. |
| useSupabaseQuery hooks | Created `hooks/useSupabaseData.ts` — generic Supabase query hook with auto-polling, stale detection, error handling, and mock fallback. 10 domain-specific hooks: telemetry (30s poll), energy history, operating mode, forecast, optimization, load tiers, alerts (60s poll), metering, predicted demand, facility. |
| App.tsx updated | Wrapped DashboardRoutes in DashboardDataProvider — data context available to all dashboard pages. |
| Overview page | Consumes DashboardDataContext for facility, operatingMode, optimization, alerts. Shows DataSourceBadge, LastUpdated, DataEmpty when backend unavailable. |
| Energy page | Consumes DashboardDataContext for telemetry. Shows DataEmpty for missing battery SOC, supply composition uses live values when available. |
| Intelligence page | Consumes DashboardDataContext for forecast, optimization, loadTiers, predictedDemand. Shows predicted demand section only when live Supabase data exists. |
| Alerts page | Consumes DashboardDataContext for alerts. Shows severity counts from live data. |
| Metering page | Consumes DashboardDataContext for metering records. Shows mock notice only when data source is mock. |
| TopBar | Shows backend status indicator: "Backend Live" (green pulse), "Simulated" (gray), or "Offline" (red) based on overallStatus. |
| PowerFlow | Prefers Supabase telemetry when live, falls back to SolarTracking simulation telemetry. |
| EnergyMetrics | Prefers Supabase telemetry when live, falls back to SolarTracking simulation telemetry. Shows ValueNA when data unavailable. |
| EventStream | Updated to accept both old AlertItem (number id) and new AlertRecord (string id) formats via AlertItemLike type. |
| .env template | Created with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY placeholders. |
| @supabase/supabase-js | Installed as production dependency. |

**Data flow architecture:**
- `Supabase client` → `useSupabaseQuery` hooks → `DashboardDataContext` → page components
- `SolarTrackingContext` (3D simulation) → `useTelemetry()` hook → PowerFlow, EnergyMetrics (fallback path)
- `api.ts` service → available for non-context consumers (websocket, external integrations)

**When Supabase is not configured (current state):**
- All hooks return mock data with `kind: "mock"` status
- DataSourceBadge shows "MOCK DATA" on pages
- TopBar shows "Simulated" indicator
- No console errors, no failed network requests

**When Supabase IS configured:**
- Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
- Hooks will query Supabase tables: telemetry_readings, energy_history, operating_modes, solar_forecasts, load_forecasts, optimization_decisions, load_tiers, alerts, metering_records, predicted_demand, facilities
- If a table doesn't exist, falls back to mock with error message in status
- DataSourceBadge shows "LIVE BACKEND" on pages
- TopBar shows "Backend Live" green pulse indicator
- Auto-polling: telemetry every 30s, alerts every 60s
- Stale detection: marks data as stale after 2 minutes without refresh

**Verification:** `npx tsc --noEmit` → 0 errors. `npx vite build` → 2,933 modules, 0 errors. SolarGridIntro page, solargrid-intro.html, ThemeContext, SolarTrackingContext all untouched. All routes functional.

## Open opportunities

The next highest-value product increments are live inverter/weather/battery telemetry, interactive asset topology with drill-down, and action workflows for alert acknowledgement and storage dispatch. The current `operatingState` and service seams were deliberately shaped so all demo states can later be supplied by one validated system-state feed. Treat these as opportunities, not commitments; validate scope and integration readiness before implementation.

## Last completed changes — 2026-08-31

| Change | Details | Verification |
| --- | --- | --- |
| Critical Loads UI correction | Limited hospital critical-load mock data to one CRITICAL, Solar + Battery, 100% Protected representative load for ICU, OT, and Emergency & Trauma. Made the Set Priority dialog an opaque `#10150f` graphite surface with an elevated shadow and replaced the shared dialog backdrop with `bg-black/70`; priority-editing controls and semantic priority colors remain intact. Updated priority overview and audit references to the reduced department set. | `npm run check` passed and `git diff --check` passed. `npm run build` transformed 2,988 modules but did not complete before the local execution window, with only existing analytics-template warnings. `pnpm check/build` was blocked by existing ignored-build-script approval. Local HTTP checks reached the Critical Loads route, but the embedded visual-review browser could not connect to the local development host, so 100% zoom visual QA remains outstanding in `todo.md`. |
