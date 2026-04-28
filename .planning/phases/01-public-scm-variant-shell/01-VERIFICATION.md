---
phase: 1
status: passed
verified: 2026-04-28
---

# Phase 1 Verification — Public SCM Variant Shell

## Result

Status: passed

Phase 1 created a runnable public-data SCM demo variant shell using existing WorldMonitor panels, map layers, and public-data-safe framing.

## Requirements Verified

| Requirement | Status | Evidence |
|-------------|--------|----------|
| VAR-01 | passed | `src/config/variant.ts` supports `scm` in build, Tauri/local storage, localhost, and `scm.` hostname paths; `tests/scm-variant-config.test.mjs` covers this. |
| VAR-02 | passed | `SCM_PANELS` and `VARIANT_DEFAULTS.scm` in `src/config/panels.ts` define SCM-focused existing public-data panels; guardrail test covers required panel ids. |
| VAR-03 | passed | `SCM_MAP_LAYERS` and `SCM_MOBILE_MAP_LAYERS` in `src/config/panels.ts` define SCM-focused map defaults; guardrail test covers required enabled and disabled layers. |
| VAR-04 | passed | `src/app/panel-layout.ts` adds SCM Demo to desktop and mobile variant navigation. |
| FRM-01 | passed | `VARIANT_META.scm`, panel labels, `SupplyChainPanel`, and `EnergyRiskOverviewPanel` frame the variant as public/open-source/demo data. |
| FRM-02 | passed | Guardrail test rejects Chevron-private implication phrases; implementation avoids proprietary Chevron supplier, route, shipment, inventory, pricing, contract, or facility-sensitive claims. |
| FRM-03 | passed | `SupplyChainPanel` and `EnergyRiskOverviewPanel` include SCM-specific copy for public upstream unavailable, no public data returned, stale public data, and demo-only assumptions. |
| FRM-04 | passed | Runtime variant id is `scm`; user-facing labels are generic SCM/Energy SCM Demo rather than Chevron-internal. |
| VER-01 | passed | `npm run typecheck` passed. |
| VER-02 | passed | `npm run lint:boundaries` passed. |
| VER-03 | passed | `npx tsx --test tests/scm-variant-config.test.mjs` passed 6/6 tests. |
| VER-05 | passed with caveat | Direct SCM production smoke passed via `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build`. Full `npm run build` is blocked on Windows by existing Unix `rm` in `build:blog`; Playwright config webServer is blocked on Windows by existing Unix-style `VITE_E2E=...` env assignment. |

## Commands Run

- `npm install` — restored local toolchain; reported existing npm audit vulnerabilities.
- `npm run typecheck` — passed.
- `npm run lint:boundaries` — passed.
- `npx tsx --test tests/scm-variant-config.test.mjs` — passed, 6 tests.
- `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build` — passed.

## Known Caveats

- `npm run build` fails on Windows after the blog build because `build:blog` uses Unix `rm`, `mkdir -p`, and `cp` commands.
- Playwright smoke through the repo config fails on Windows before running the spec because `config.webServer` uses Unix-style `VITE_E2E=...` env assignment.
- `npm run test:data -- tests/scm-variant-config.test.mjs` is not path-scoped; it runs the entire data suite and currently fails on unrelated/pre-existing Windows and fixture issues. The focused SCM guardrail passes when run directly with `npx tsx --test tests/scm-variant-config.test.mjs`.

## Phase Summary

Phase 1 is complete. The SCM demo shell is registered, curated, guarded by tests, and verified with typecheck, boundary lint, focused tests, and a direct SCM Vite build.

