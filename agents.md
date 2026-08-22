# Agent Instructions

These instructions apply to **all AI agents, Claude Code sessions, automated pipelines, and human contributors** working in this repository.

## Mandatory operating rules

### RULE 1: Read repository memory first

**Before doing ANYTHING in this codebase, read `memory.md` completely.** Do this before opening implementation files, forming a plan, proposing a fix, or making a change.

### RULE 2: Update repository memory after work

**After completing any task, update `memory.md` to reflect what changed.** Record the decision, affected area, verification performed, and any unresolved follow-up. Keep entries concise, accurate, and durable.

### RULE 3: Never assume

**Never assume.** If something is unclear, check `memory.md` first before exploring files. If the memory does not resolve the uncertainty, inspect the smallest relevant part of the codebase and state the assumption you are making.

### RULE 4: Maintain a visible work checklist

For any substantial task, add specific unchecked items to `todo.md` before implementation. Mark each item complete only after the relevant work has been verified. Do not erase prior completed history without the user’s explicit request.

### RULE 5: Protect working product behavior

Preserve successful existing behavior unless the user explicitly asks for a change. Prefer small, composable, reversible changes over broad rewrites. Do not delete routes, shared components, design tokens, data models, or managed assets merely because they are not used by the current task.

### RULE 6: Verify before handoff

For frontend implementation work, run `pnpm check` and `pnpm build`. Visually inspect the affected primary routes when the change affects layout, color, responsiveness, typography, or interaction. Report real limitations rather than claiming unverified functionality.

### RULE 7: Preserve the SolarGrid product system

Follow the Grid Atlas design system captured in `memory.md`. The proprietary energy-cell mark, instrument rail, Signal Lime live-state language, operational typography, and field-aware voice are product assets—not optional styling.

### RULE 8: Be honest about data and controls

Do not fabricate customer reviews, user activity, financial outcomes, external integrations, or real-time operational control. Prototype data must remain clearly represented as mock or staged behavior until a real approved integration exists.

### RULE 9: Handle integrations deliberately

Do not add secrets, external APIs, database access, billing, authentication, telemetry vendors, or background processes without explicit user approval and a documented integration plan. Reuse the existing typed service seams where suitable.

### RULE 10: Keep the system ready for profitable innovation

Agents are encouraged to identify and propose **small, practical, and ethical improvements** that could increase product value through better operator retention, faster decisions, lower operational effort, clearer conversion paths, or more useful premium capabilities. Innovation is encouraged when it is grounded in the current product, measurable where possible, reversible, and does not dilute the SolarGrid brand.

> Innovation should create a concrete operator or business advantage—not novelty for its own sake. When an opportunity falls outside the user’s request, document it under **Open opportunities** in `memory.md` or present it as an optional next step; do not silently expand scope.

## Decision protocol

| Situation | Required response |
| --- | --- |
| The request is clear and narrow | Read `memory.md`, update `todo.md` if substantial, implement, verify, and update memory. |
| The request conflicts with memory | Explain the conflict, prioritize the user’s current instruction, then update memory with the new decision. |
| The request is unclear | Read memory first, inspect only the relevant code, then ask a focused question if a safe assumption is not possible. |
| A valuable opportunity is discovered | Assess user benefit, implementation cost, risk, reversibility, and brand fit. Propose it separately unless expressly in scope. |
| A change introduces risk | Create a checkpoint before the risk, avoid destructive commands, and use the repository’s recovery workflow if needed. |

## Completion record

Before closing a task, confirm that the work is implemented, tested at the appropriate level, reflected in `memory.md`, marked in `todo.md`, and summarized truthfully for the user.

