# Testing Reference

Focus for future planning: preserve existing quality gates while adapting the OSINT dashboard into an SCM / Chevron SCM dashboard.

## Test Frameworks

- Unit and integration tests use Node's built-in `node:test` runner with `node:assert` or `node:assert/strict`.
- TypeScript-flavored tests run through `tsx --test`; see `npm run test:data`.
- Playwright drives browser E2E and visual tests from `e2e/`.
- Convex-specific tests use Vitest through `vitest.config.mts` and scripts `test:convex` / `test:convex:watch`.
- API helper and sidecar tests are mostly `.mjs` Node tests with mocked local servers and direct handler imports.
- Biome is the code linter/formatter gate for `src`, `server`, `api`, `tests`, `e2e`, `scripts`, and `middleware.ts`.

## Core Scripts

- `npm run typecheck` runs `tsc --noEmit` for `src` only, using `tsconfig.json`.
- `npm run typecheck:api` runs `tsc --noEmit -p tsconfig.api.json` over `api`, `src/generated`, and `server`.
- `npm run typecheck:all` runs both typecheck passes.
- `npm run lint` runs Biome lint across app, API, server, tests, scripts, and E2E.
- `npm run lint:boundaries` checks dependency direction and layer guardrails.
- `npm run lint:api-contract` enforces sebuf/API contract conventions.
- `npm run lint:rate-limit-policies` checks endpoint rate-limit policy coverage.
- `npm run lint:premium-fetch` checks premium fetch parity.
- `npm run lint:unicode` checks Unicode safety.
- `npm run test:data` runs `tsx --test tests/*.test.mjs tests/*.test.mts`.
- `npm run test:sidecar` runs sidecar and selected API handler tests.
- `npm run test:e2e` runs runtime, full, tech, and finance Playwright suites.
- `npm run test:e2e:visual` runs golden screenshot checks for full and tech variants.

## Test File Layout

- General unit/integration tests live under `tests/`.
- Legacy API helper tests can live beside helpers under `api/`, such as `api/_cors.test.mjs` and `api/youtube/embed.test.mjs`.
- Tauri sidecar tests live under `src-tauri/sidecar/`, especially `src-tauri/sidecar/local-api-server.test.mjs`.
- Browser E2E specs live under `e2e/*.spec.ts`.
- Playwright snapshots use the configured template under `e2e/<spec>-snapshots/`.
- Generated server/client code under `src/generated/` is verified indirectly by typecheck, route tests, proto freshness checks, and handler tests.
- Docs/Markdown checks are handled separately by markdownlint and MDX tests when relevant.

## Edge Function Tests

- `tests/edge-functions.test.mjs` enforces legacy Edge Function constraints.
- It checks `api/*.js` and `api/oauth/*.js` routed functions do not import from `../server/` or `../src/`.
- It scans all routed `api/**/*.js` and `api/**/*.ts` files for unsupported `node:` built-in imports.
- It checks shared data mirrored into `scripts/shared/` stays byte-identical for selected shared files.
- It includes safety assertions for OAuth, Slack callback CSP, Redis write behavior, and CORS/preflight invariants.
- New legacy `api/*.js` endpoints should include focused tests beside the helper or in `tests/edge-functions.test.mjs` when they touch these invariants.
- New generated/RPC endpoints should usually be tested at handler level plus cache-tier/parity level rather than as legacy isolated JS functions.

## Server And Gateway Tests

- `tests/route-cache-tier.test.mjs` extracts generated GET routes from `src/generated/server/worldmonitor/**/service_server.ts` and verifies every route has an explicit `RPC_CACHE_TIER` entry in `server/gateway.ts`.
- Gateway behavior includes CORS, auth/API keys, entitlements, rate limiting, ETags, cache headers, no-store for upstream unavailable data, and usage telemetry scope.
- Handler tests live in `tests/*handler*.test.*`, domain-specific tests, and seed/data tests.
- Redis/cache behavior has focused tests such as `tests/circuit-breaker-persistent-stale-ceiling.test.mts` and cache-key sensitivity tests.
- For SCM/Chevron endpoints, add tests for cache-key dimensions, private/public cache separation, and upstream unavailable handling.

## Sidecar Tests

- `npm run test:sidecar` includes `src-tauri/sidecar/local-api-server.test.mjs`.
- Sidecar tests construct temporary API directories and local HTTP servers to verify local handler routing, cloud fallback behavior, CORS, compression, auth, local secret validation, and SSRF protections.
- Sidecar local API behavior matters for desktop SCM usage because local/offline or customer-hosted environments may rely on `LOCAL_API_MODE` and local secrets.
- If Chevron adaptation adds local connectors or private data access, add sidecar tests for auth-required local endpoints, stripped query logging, no cloud fallback for sensitive paths, and timeout/error behavior.

## E2E And Visual Tests

- Playwright config lives in `playwright.config.ts`.
- Tests run against `http://127.0.0.1:4173` with `VITE_E2E=1 npm run dev -- --host 127.0.0.1 --port 4173`.
- Browser config uses Chromium, dark mode, `en-US`, UTC timezone, 1280x720 viewport, traces and videos retained on failure.
- E2E specs include map harnesses, mobile map behavior, auth UI, theme toggles, runtime fetch behavior, widget builder, and domain flows.
- Visual regression scripts run golden screenshot comparisons for selected variants: `test:e2e:visual:full`, `test:e2e:visual:tech`, and aggregate `test:e2e:visual`.
- For SCM/Chevron UI changes, add Playwright coverage for panel visibility, map layer toggles, route/chokepoint drilldowns, tab switching, responsive layout, and stale/error states.
- If visual changes affect map rendering or panel composition, update or add golden screenshots deliberately with the `test:e2e:visual:update:*` scripts.

## Typecheck, Lint, And Pre-Push

- `.husky/pre-push` is the broadest local gate.
- Pre-push runs dependency install if `node_modules` is missing.
- It checks branch PR state and rejects pushes to closed/merged PR branches.
- It runs `npm run typecheck`, `npm run typecheck:api`, Convex typecheck, CJS syntax checks, Unicode safety, architecture boundary checks, Sentry coverage, rate-limit policies, premium-fetch parity, edge function bundling, selected unit tests, edge function tests, markdown/MDX lint when relevant, proto freshness, pro-test bundle freshness, and version sync.
- Edge function bundle check uses `esbuild` with browser platform over routed `api/*.js` and top-level `api/*.ts`.
- Proto changes trigger `make generate` when `buf` and plugins are available, then fail if `src/generated/` or `docs/api/` drift.
- Public `/pro` bundle freshness is checked when `pro-test/` or `public/pro/` changes.

## Recommended SCM / Chevron Test Additions

- Add handler tests for any new SCM RPC under `tests/`, especially for request validation, missing params, cache keys, entitlement behavior, and upstream failure shape.
- Add route cache tier tests by ensuring generated GET routes have explicit `RPC_CACHE_TIER` entries in `server/gateway.ts`.
- Add data-shaping tests for Chevron SCM concepts such as supplier risk rollups, route exposure, facility dependency, commodity input exposure, and chokepoint impact scoring.
- Add UI unit-style tests where existing test harnesses support panel logic; otherwise add Playwright flows for key SCM panels.
- Add E2E coverage for a Chevron/SCM variant once introduced: default panels, map layers, first-load data hydration, route/chokepoint interactions, and premium/private gating.
- Add tests proving private Chevron data never uses public CDN cache headers.
- Add tests proving public OSINT feeds and private SCM overlays are separated in cache keys, response types, and freshness metadata.
- Add tests for `upstreamUnavailable` and empty-data paths so panels show unavailable/stale states instead of silently rendering zero-risk.
- Add sidecar tests if private SCM connectors run locally, validating auth, timeout, request-body preservation, no credential leakage in logs, and SSRF blocks.
- Add visual tests for dense SCM dashboards where text overflow, route tables, status badges, and map popups are likely regression points.
- Add regression tests before refactoring existing supply-chain or energy panels; many useful SCM pieces already live in `src/components/SupplyChainPanel.ts`, `src/components/ChokepointStripPanel.ts`, and energy-related panels.
- Avoid adding new dependencies for test support unless explicitly approved; current stack already covers unit, integration, E2E, visual, type, lint, and static contract checks.
