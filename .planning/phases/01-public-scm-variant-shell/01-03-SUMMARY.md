# Phase 1 Plan 03 Summary

## Implemented

- Added `tests/scm-variant-config.test.mjs` as a focused text-based `node:test` guardrail for the SCM shell.
- Locked SCM variant registration checks in `src/config/variant.ts` for build, Tauri, localhost, and `scm.` hostname paths.
- Locked SCM metadata framing in `src/config/variant-meta.ts` to public-data, open-source, and demo-safe language.
- Locked SCM default panel registration and map-layer defaults in `src/config/panels.ts`.
- Locked SCM empty/degraded/stale/demo copy expectations in `src/components/EnergyRiskOverviewPanel.ts` and `src/components/SupplyChainPanel.ts`.
- Added bans for Chevron-private implication phrases inside SCM-relevant shell files.

## Verification

- `npx tsx --test tests/scm-variant-config.test.mjs` passed.
- `npm run typecheck` passed.
- `npm run lint:boundaries` passed.

## Blockers / Deviations

- `npm run test:data -- tests/scm-variant-config.test.mjs` still executes the entire `test:data` suite because `package.json` expands `tsx --test tests/*.test.mjs tests/*.test.mts ...`. The SCM guardrail passed inside that run, but the command exited non-zero on pre-existing unrelated failures.
- Pre-existing failures observed during that suite run included:
  - `tests/mdx-lint.test.mjs`
  - `tests/regulatory-seed-unit.test.mjs`
  - `tests/bundle-runner.test.mjs` with Windows path `C:\C:\...` fixture `ENOENT`
  - `tests/product-catalog-freshness.test.mjs` because `grep` is unavailable in this PowerShell/Windows environment
  - `tests/edge-functions.test.mjs` with `ERR_UNSUPPORTED_ESM_URL_SCHEME`
- Direct `cross-env VITE_VARIANT=scm playwright test e2e/runtime-fetch.spec.ts` was not feasible in this shell because `cross-env` is not on PATH outside npm scripts.
- Fallback attempt `npx cross-env VITE_VARIANT=scm playwright test e2e/runtime-fetch.spec.ts` also failed before the spec ran because Playwright's configured web server starts with Unix-style `VITE_E2E=...` env assignment, which Windows reported as `'VITE_E2E' is not recognized as an internal or external command`.
