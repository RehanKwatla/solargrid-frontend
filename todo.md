# Active Repository Tasks

## Charcoal Light Theme — In Progress

- [x] Replace only light-theme semantic color tokens with the approved charcoal, limestone, olive, and terracotta palette.
- [x] Retune light-mode chart and tooltip colors that bypass semantic tokens; leave existing dark-mode branches unchanged.
- [x] Visually verify light and dark modes, then run typecheck and production build.
- [x] Record the palette decision and verification in `memory.md`.

## Locked Version 4 Intro Adoption — Complete

- [x] Replace the served root intro with an exact copy of approved Version 4.
- [x] Keep dashboard entry handling outside the locked Version 4 source.
- [x] Verify source identity and the root-to-dashboard flow, then update memory.

## Shared Dashboard Energy Field — Complete

- [x] Add one OGL-based Strands component and a dashboard-level background host.
- [x] Tune the shared layer for restrained SolarGrid dark and light palettes, reduced motion, and responsive density.
- [x] Verify the dashboard shell visually and run typecheck and production build.
- [x] Record the implementation and verification in `memory.md`.

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

## Dashboard Responsive Layout & Overflow Fix — Complete

- [x] Audit root layout: html, body, #root, dashboard-shell, main content, sidebar width constraints
- [x] Fix viewport containers: add width:100%, max-width:100%, min-width:0, box-sizing:border-box to root elements
- [x] Fix Overview.tsx grid blowout: replace bare `Xfr` columns with `minmax(0,Xfr)` in all 4 responsive section grids
- [x] Remove fixed max-w-[1440px] overview container that ignored sidebar offset
- [x] Rewrite SolarTrackingSection internal layout: replace fixed `2xl:w-72 shrink-0` flex row with responsive grid `minmax(0,1.15fr) minmax(260px,0.85fr)`, break earlier at xl breakpoint
- [x] Fix time-of-day preset controls: add flex-wrap + responsive min-width (50% below sm), shrink padding; prevent Night button clipping and horizontal overflow
- [x] Fix PowerFlow diagram: replace fixed `px-10/px-16/px-32` padding with responsive steps, replace fixed `w-48` node cards with flexible `flex-1 max-w` sizing
- [x] Fix EnergyMetrics grid: add minmax() columns, responsive padding, truncation and whitespace handling for hero value and supporting metric cells
- [x] Fix TopBar: reduce padding, tighten gaps, hide secondary actions below breakpoints, add truncation and shrink-0 on static labels
- [x] Harden AppSidebar: add max-w constraints and overflow-x-hidden
- [x] Run `tsc --noEmit` → PASS (zero errors)
- [x] Run `vite build` → PASS (completed successfully with existing pre-existing warnings only)
- [x] Run GetDiagnostics → PASS (empty array)
- [x] Confirm intro page / SolarGrid 3D animation untouched (solargrid-intro.html and SolarGridIntro.tsx unchanged)

### Remaining weaknesses / follow-up

- [ ] No real telemetry integration — all data is mock. When live data arrives, the SolarTrackingContext and api.ts service seams are ready.
- [ ] PowerFlow does not yet animate actual particle movement along connectors — current implementation uses CSS pulsing.
- [ ] Operating mode switching is not yet interactive (mode is hardcoded to "Self-Powered").
- [ ] Energy charts on the Energy page are not updated with the new CSS design system refinements.
- [ ] The mobile bottom tab bar could benefit from a badge count on the Alerts tab.
- [ ] No dark/light theme toggle is exposed in the UI (ThemeProvider supports it, but switchable defaults to false).
