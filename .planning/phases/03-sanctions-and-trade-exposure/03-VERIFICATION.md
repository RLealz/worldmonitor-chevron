---
phase: 3
slug: sanctions-and-trade-exposure
status: complete
verified: 2026-04-28
---

# Phase 3 Verification - Sanctions and Trade Exposure

## Automated Verification

| Command | Result | Notes |
|---------|--------|-------|
| `npx tsx --test tests/compliance-exposure.test.mjs` | Passed | 8 tests covering sanctions-hit, entity lookup, trade-restricted, combined exposure, stale/missing provenance, low coverage, public screening copy, and static guardrails. |
| `npx tsx --test tests/supplier-risk-signals.test.mjs` | Passed | 8 tests; confirms sanctions/trade signal inputs did not regress supplier-risk behavior. |
| `npx tsx --test tests/scm-variant-config.test.mjs` | Passed | 6 tests; confirms SCM defaults, panel labels, public-data framing, and banned private-data wording guardrails. |
| `npm run typecheck` | Passed | `tsc --noEmit`. |
| `npm run lint:boundaries` | Passed | No architectural boundary violations. |
| `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build` | Passed | Windows-compatible SCM build smoke. |

## Requirement Evidence

| Requirement | Evidence |
|-------------|----------|
| CMP-01 | `src/utils/compliance-exposure.ts` composes public sanctions pressure, entity lookup, trade restrictions, barriers, tariffs, and trade-flow/Comtrade context. `DataLoaderManager` passes summaries to sanctions/trade panels. |
| CMP-02 | `ComplianceExposureEvidence` requires source, timestamp, date label, confidence, and reason; panel context renders source/list/name and date fallback. |
| CMP-03 | Tests scan touched compliance files for private-data-shaped and legal-finality wording; panel copy frames outputs as public screening signals. |
| CMP-04 | Exposure summaries include supplier archetype, country, HS/product, material, and context links; supplier-risk summaries consume public sanctions/trade country signals where available. |

## Manual Gaps

- Browser visual review was not run.
- Entity lookup is supported through the service wrapper and optional SCM data-loader method, but the dashboard does not auto-query arbitrary public entities on startup.

## Build Notes

- Vite emitted existing dynamic-import and chunk-size warnings. These were non-blocking and consistent with prior SCM build smoke behavior.
