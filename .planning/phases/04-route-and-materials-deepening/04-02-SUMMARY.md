---
phase: 4
plan: 02
status: complete
completed: 2026-04-29
---

# Plan 02 Summary - Route Presets and Material Context UI Wiring

## What Changed

- Added SCM-only public demo corridor presets to Route Explorer.
- Added a route/material context section to Supply Chain that summarizes demo corridors, chokepoint scores, materials, source/freshness posture, and low-confidence fallback copy.
- Wired supply-chain chokepoint data through the route/material context model in the data loader.
- Clarified Energy Risk Overview SCM copy so Brent is market context while Hormuz, storage, and disruptions are public operational signals.
- Expanded SCM config guardrails to cover Route Explorer presets, Supply Chain route/material context, and market-vs-operational wording.

## Key Files

- `src/components/RouteExplorer/RouteExplorer.ts`
- `src/components/RouteExplorer/CargoTypeDropdown.ts`
- `src/components/SupplyChainPanel.ts`
- `src/components/EnergyRiskOverviewPanel.ts`
- `src/app/data-loader.ts`
- `src/styles/route-explorer.css`
- `src/styles/supply-chain-panel.css`
- `tests/scm-variant-config.test.mjs`

## Verification

- `npx tsx --test tests/scm-route-material-context.test.mjs`
- `npx tsx --test tests/scm-variant-config.test.mjs`
- `npx tsx --test tests/route-explorer-url-state.test.mts tests/route-explorer-pickers.test.mts tests/scm-variant-config.test.mjs tests/scm-route-material-context.test.mjs`
- `npm run typecheck`
- `npm run lint:boundaries`

## Self-Check: PASSED

The SCM UI uses the tested route/material context model, keeps demo corridor wording public-data framed, and distinguishes market indicators from operational public signals.
