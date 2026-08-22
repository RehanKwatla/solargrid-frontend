# Active Repository Tasks

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
