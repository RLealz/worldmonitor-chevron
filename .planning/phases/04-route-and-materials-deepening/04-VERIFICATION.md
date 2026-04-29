---
phase: 4
slug: route-and-materials-deepening
status: complete
verified: 2026-04-29
---

# Phase 4 - Verification

## Result

Phase 4 passed. Route and materials deepening is implemented for the public-data-only SCM demo and Phase 5 remains the next phase for final demo hardening and broader private-data safety review.

## Commands Run

| Check | Result | Evidence |
|-------|--------|----------|
| Route/material focused tests | Pass | `npx tsx --test tests/scm-route-material-context.test.mjs` passed 10 tests |
| SCM config and UI guardrails | Pass | `npx tsx --test tests/scm-variant-config.test.mjs` passed 6 tests |
| Route Explorer picker/url regression | Pass | `npx tsx --test tests/route-explorer-url-state.test.mts tests/route-explorer-pickers.test.mts tests/scm-variant-config.test.mjs tests/scm-route-material-context.test.mjs` passed 52 tests |
| Phase cross-check suite | Pass | `npx tsx --test tests/scm-route-material-context.test.mjs tests/supplier-route-risk.test.mjs tests/scm-variant-config.test.mjs tests/compliance-exposure.test.mjs` passed 38 tests |
| TypeScript | Pass | `npm run typecheck` completed with `tsc --noEmit` |
| Boundary lint | Pass | `npm run lint:boundaries` reported no architectural boundary violations |
| SCM build smoke | Pass | `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build` completed successfully |

## Build Warnings

SCM build emitted existing Vite reporter warnings about modules that are both dynamically and statically imported, plus chunk-size warnings for large app chunks. These warnings did not block the build and are not new functional failures from Phase 4.

## Requirement Evidence

- **RTE-01:** Route Explorer still uses existing route lane, route impact, bypass, tab, URL, and map-highlight paths; Supply Chain still renders chokepoints, disruptions, bypasses, shipping, and critical materials.
- **RTE-02:** `SCM_ROUTE_PRESETS` provides public/demo route presets and Route Explorer exposes them only for the SCM variant.
- **RTE-03:** `buildScmRouteMaterialContext()` connects route presets to country, HS2/product, chokepoint, and material context; Supply Chain renders those summaries.
- **RTE-04:** SCM copy distinguishes public upstream unavailable, no current public data, stale data, route coverage gaps, and demo assumptions.
- **MAT-01:** SCM variant retains critical minerals, commodities, pipelines, storage, fuel shortages, energy disruptions, energy overview, and related map layers.
- **MAT-02:** Material mappings carry HS2/product links only where public mapping is defensible.
- **MAT-03:** Low and unavailable material mappings return fallback copy instead of precise product-impact claims.
- **MAT-04:** Energy overview and route/material summaries distinguish commodity/energy market context from public operational SCM signals.

## Residual Risks

- Static guardrails cannot prove every future copy edit stays demo-safe; Phase 5 should perform broader private-data and artifact review across public docs, generated assets, screenshots, analytics labels, and bootstrap/cache examples.
- Route Explorer preset ergonomics were verified by automated coverage and build smoke, not a fresh browser visual pass in this phase.
