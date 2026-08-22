# SolarGrid Repository Memory

> **Purpose:** This is the durable operating context for people and AI agents working in this repository. Read it completely before exploring files, making assumptions, or changing code. Update it after every completed task.

## Product context

SolarGrid is a static frontend prototype for a distributed-solar operations platform. Its users are asset operators who need a calm, high-signal view of generation, storage, export, fleet health, and operational attention items.

The product’s current promise is: **the focused operating layer for teams who need to see, understand, and act on distributed solar performance without noise.** The brand personality is precise, calm, and field-ready.

## Current implementation

| Area | Current decision |
| --- | --- |
| Framework | React 19, TypeScript, Vite, Tailwind CSS 4, Wouter, and Recharts. |
| Application root | The frontend source tree is `client/src/`, following the managed static-project template. |
| Routes | `/`, `/energy`, `/intelligence`, `/alerts`, and `/fleet`. |
| Layout | `DashboardLayout` supplies a sticky desktop instrument rail and a compact top control bar. |
| Visual system | **Grid Atlas**: blue-black graphite surfaces, low-key field imagery, Space Grotesk display type, IBM Plex Mono utility text, micro-grid texture, and Signal Lime for selected/live/healthy state. |
| Signal Lime | `#D8FF3E`; reserve it for selected navigation, live or healthy state, decisive numerals, and locator geometry. Amber and coral are reserved for watch and critical conditions. |
| UI components | Reusable components are grouped by function beneath `components/layout`, `dashboard`, `power-flow`, `charts`, `alerts`, and `common`. |
| Data and services | `data/mockData.ts` contains typed prototype data. `services/api.ts`, `websocket.ts`, and `firebase.ts` are intentionally client-safe seams, not live integrations. |
| Visual assets | Brand mark and visual imagery are stored through managed `/manus-storage/` URLs. Do not copy large media into the project tree. |

## Design non-negotiables

The desktop experience must retain a visible proprietary navigation anchor: the chartreuse solar-core mark, SolarGrid wordmark, and left-edge instrument rail. Every route should read as an **operations map**: one dominant intelligence plane supported by satellite modules, with locator lines and status pips clarifying relationships.

Avoid generic bright SaaS panels, purple gradients, rounded-card monoculture, default Inter typography, and decorative neon. Operational language should be concrete and field-aware, such as “Review dispatch plan,” not generic starter copy.

## Working conventions

| Topic | Required approach |
| --- | --- |
| Before coding | Read this file completely, review `agents.md`, and add specific unchecked work items to `todo.md` for substantial changes. |
| New work | Preserve the existing route shell and reusable component organization. Prefer a small component extension over page-level duplication. |
| State and data | Keep mock data typed and centralized. Do not portray a mock interaction as a working real-world control. |
| External systems | Do not introduce credentials, API calls, analytics vendors, payment flows, or persistent data without explicit user approval and the appropriate project capability. |
| Visual assets | Use managed asset URLs for media. Ensure text stays readable over imagery with deliberate overlays. |
| Verification | Run `pnpm check` and `pnpm build` after implementation work. Inspect key routes visually before declaring the task complete. |
| Handoff | Update this file with what changed, relevant decisions, verification status, and any unresolved follow-up. |

## Last completed changes

| Date | Change | Verification |
| --- | --- | --- |
| 2026-08-22 | Created the initial SolarGrid Grid Atlas dashboard, including five routes, reusable UI modules, mock data, service seams, managed visual assets, and a branded desktop instrument rail. | `pnpm check` and `pnpm build` passed. Visual review completed. |
| 2026-08-22 | Added `agents.md`, `memory.md`, and `todo.md` to provide persistent guidance for future AI and automated work. | Required files exist, `git diff --check` passed, and checkpoint `d95b3b16` was created. |
| 2026-08-22 | Applied the attached Smart Solar Grid & Energy Optimization MVP guidance. Added centralized critical-infrastructure mock data, safe service methods, a state-ready power-flow diagram, four operational energy charts, mock forecast/optimization/dispatch UI, local alert acknowledgement, responsive mobile navigation, `/overview` root routing, and a Metering data instrument. | Desktop and mobile route screenshots reviewed. `pnpm check`, `pnpm build`, and `git diff --check` passed. |
| 2026-08-22 | Tested the enabled GitHub connector with read-only GitHub CLI calls. | Authenticated profile and three recently updated public repositories were returned successfully; no repository content was changed. |

## Open opportunities

The next highest-value product increments are live inverter/weather/battery telemetry, interactive asset topology with drill-down, and action workflows for alert acknowledgement and storage dispatch. The current `operatingState` and service seams were deliberately shaped so all demo states can later be supplied by one validated system-state feed. Treat these as opportunities, not commitments; validate scope and integration readiness before implementation.
