# Structure Map

Focus: repository layout and likely homes for SCM / Chevron SCM work.

## Directory Map

`.` contains the main WorldMonitor app, build configs, deployment configs, docs, tests, and planning artifacts.
`src/` is the browser SPA source.
`src/app/` contains application orchestration modules.
`src/components/` contains map components, panel classes, modals, command UI, and route explorer UI.
`src/config/` contains panels, variants, map-layer definitions, geo/static data, route tables, feeds, market symbols, and feature config.
`src/services/` contains domain service clients, fetch wrappers, circuit breakers, cache helpers, auth, analytics, i18n, and runtime helpers.
`src/types/` contains shared frontend types.
`src/generated/` contains proto-generated TypeScript client and server stubs; do not edit by hand.
`src/workers/` contains web workers for analysis, ML, and vector-memory workloads.
`api/` contains Vercel API/Edge entrypoints and API-local helpers.
`server/` contains server-side shared code and proto-domain handler implementations bundled into Edge Functions.
`proto/` contains sebuf/protobuf service and message definitions.
`scripts/` contains seeders, build helpers, validation scripts, relay support, and data fetch jobs.
`shared/` contains cross-runtime static/shared data.
`src-tauri/` contains the desktop shell, Rust code, capabilities, and Node sidecar.
`tests/` contains node:test unit/integration tests.
`e2e/` contains Playwright specs.
`docs/` contains Mintlify docs and generated OpenAPI specs.
`convex/` contains Convex backend state for auth-adjacent product features, payments, preferences, and notifications.
`docker/`, `Dockerfile*`, `deploy/`, and `nixpacks.toml` support container and Railway-style deployments.
`.planning/codebase/` is planning documentation; this mapper owns only `ARCHITECTURE.md` and `STRUCTURE.md`.

## Key Entry Points

`index.html` is the Vite HTML entry.
`src/main.ts` bootstraps the browser runtime.
`src/App.ts` is the top-level app class and lifecycle coordinator.
`src/app/app-context.ts` defines the central mutable app context shape.
`src/app/panel-layout.ts` creates map and panel instances.
`src/app/data-loader.ts` coordinates bulk data loading and panel updates.
`src/app/refresh-scheduler.ts` controls recurring refresh and smart polling.
`src/app/event-handlers.ts` wires UI events, map layer controls, URL state, and snapshots.
`src/services/bootstrap.ts` hydrates first-paint data from `/api/bootstrap`.
`api/bootstrap.js` returns Redis-backed batched hydration data.
`api/health.js` checks freshness of seeded/cache keys.
`server/gateway.ts` wraps generated domain routes with CORS, auth, rate limit, entitlement, cache, and error behavior.
`Makefile` owns proto/OpenAPI generation through `make generate`.
`vite.config.ts`, `tsconfig.json`, `tsconfig.api.json`, `biome.json`, and `package.json` define build and validation surfaces.

## Important Frontend Modules

`src/components/Panel.ts` is the base class for panel UI.
`src/components/DeckGLMap.ts`, `src/components/GlobeMap.ts`, and map helpers implement the two map renderers.
`src/config/panels.ts` is the broad default panel and map-layer config source.
`src/config/variant.ts` resolves active variant from `VITE_VARIANT`, hostname, desktop localStorage, or localhost localStorage.
`src/config/variants/base.ts` defines variant config shape.
`src/config/variants/full.ts`, `tech.ts`, `finance.ts`, `happy.ts`, `commodity.ts`, and `energy.ts` define focused app variants.
`src/config/map-layer-definitions.ts` defines layer registry, renderer support, premium flags, variant layer order, and layer synonyms.
`src/config/trade-routes.ts` and `src/config/bypass-corridors.ts` are likely useful for SCM route work.
`src/services/rpc-client.ts` provides the RPC base URL behavior.
`src/services/premium-fetch.ts` is used when API-key/Clerk entitlement credentials are needed.
`src/utils/circuit-breaker.ts` protects client fetches and can persist fallback cache.
`src/utils/urlState.ts` owns URL-state parsing and sync.

## SCM-Relevant Frontend Files

`src/components/SupplyChainPanel.ts` is the main existing supply-chain panel.
`src/services/supply-chain/index.ts` wraps the generated supply-chain RPC client and exposes shipping, chokepoint, minerals, stress, route, sector, and cost-shock fetchers.
`src/components/TradePolicyPanel.ts` consumes trade policy data.
`src/services/trade/index.ts` wraps trade RPCs such as tariff trends, trade flows, barriers, restrictions, customs revenue, and Comtrade flows.
`src/components/RouteExplorer/RouteExplorer.ts` and sibling files implement lane, country, HS2, cargo, route-card, and tab UI.
`src/components/HormuzPanel.ts`, `src/components/ChokepointStripPanel.ts`, `src/components/PipelineStatusPanel.ts`, `src/components/StorageFacilityMapPanel.ts`, `src/components/FuelShortagePanel.ts`, and `src/components/EnergyDisruptionsPanel.ts` are energy/SCM operational panels.
`src/config/variants/energy.ts` and `src/config/variants/commodity.ts` are closest to a Chevron SCM default mix.
`src/config/map-layer-definitions.ts` already has SCM-friendly layer keys including `pipelines`, `storageFacilities`, `fuelShortages`, `liveTankers`, `ais`, `tradeRoutes`, `waterways`, and `commodityPorts`.

## Server And API Layout

`api/<domain>/v1/[rpc].ts` files are thin Edge entrypoints that call `createDomainGateway()`.
`api/supply-chain/v1/[rpc].ts` wires `createSupplyChainServiceRoutes()` to `supplyChainHandler`.
`server/worldmonitor/<domain>/v1/handler.ts` exports an object matching the generated service handler type.
`server/worldmonitor/<domain>/v1/<rpc-name>.ts` contains individual RPC behavior.
`server/_shared/redis.ts` owns Redis cache helpers and cache-miss coalescing.
`server/_shared/rate-limit.ts`, `server/_shared/entitlement-check.ts`, and `server/_shared/response-headers.ts` support gateway policy.
`server/router.ts` matches generated route descriptors.
`server/error-mapper.ts` maps domain errors to HTTP responses.
`api/_cors.js`, `api/_rate-limit.js`, `api/_api-key.js`, `api/_relay.js`, and other `_*.js` helpers are API-local utilities.

## SCM-Relevant Server Files

`server/worldmonitor/supply-chain/v1/handler.ts` is the supply-chain service registry.
`server/worldmonitor/supply-chain/v1/get-shipping-rates.ts` handles shipping rates.
`server/worldmonitor/supply-chain/v1/get-chokepoint-status.ts` handles current chokepoint status.
`server/worldmonitor/supply-chain/v1/get-chokepoint-history.ts` handles lazy transit history.
`server/worldmonitor/supply-chain/v1/get-shipping-stress.ts` handles carrier stress.
`server/worldmonitor/supply-chain/v1/get-country-chokepoint-index.ts` handles country/HS2 exposure.
`server/worldmonitor/supply-chain/v1/get-bypass-options.ts` handles bypass routes.
`server/worldmonitor/supply-chain/v1/get-country-cost-shock.ts` handles cost shock modeling.
`server/worldmonitor/supply-chain/v1/get-route-explorer-lane.ts` and `get-route-impact.ts` back route explorer flows.
`server/worldmonitor/supply-chain/v1/list-pipelines.ts`, `list-storage-facilities.ts`, `list-fuel-shortages.ts`, and `list-energy-disruptions.ts` support energy atlas panels.
`server/worldmonitor/trade/v1/` covers tariff, barrier, restriction, customs, and Comtrade flows.
`server/worldmonitor/maritime/v1/` covers vessel snapshots and navigational warnings.
`server/worldmonitor/shipping/v2/` covers route intelligence and webhooks.
`server/worldmonitor/market/v1/` covers commodities, sectors, quotes, gold, COT, ETF flows, and related market data.

## Proto And Generated Areas

`proto/worldmonitor/supply_chain/v1/service.proto` defines supply-chain RPCs.
`proto/worldmonitor/supply_chain/v1/*.proto` defines supply-chain request/response messages.
`proto/worldmonitor/trade/v1/service.proto` defines trade RPCs.
`proto/worldmonitor/maritime/v1/service.proto`, `proto/worldmonitor/shipping/v2/service.proto`, and `proto/worldmonitor/market/v1/service.proto` cover related domains.
`src/generated/client/worldmonitor/supply_chain/v1/service_client.ts` is generated and imported by `src/services/supply-chain/index.ts`.
`src/generated/server/worldmonitor/supply_chain/v1/service_server.ts` is generated and imported by `api/supply-chain/v1/[rpc].ts` and server handlers.
`docs/api/*.openapi.yaml` and `docs/api/*.openapi.json` are generated API docs.
Do not edit `src/generated/` or `docs/api/` directly; change proto files and run `make generate`.

## Seed And Data Acquisition Areas

`scripts/_seed-utils.mjs` is the shared seed-publish utility and should be reused.
`scripts/_trade-parse-utils.mjs` supports trade parsing.
`scripts/seed-supply-chain-trade.mjs` is an existing supply-chain/trade seeder.
`scripts/seed-comtrade-bilateral-hs4.mjs` supports HS trade exposure.
`scripts/seed-chokepoint-baselines.mjs` and `scripts/seed-chokepoint-flows.mjs` support chokepoint analytics.
`scripts/seed-portwatch.mjs`, `seed-portwatch-disruptions.mjs`, and `seed-portwatch-port-activity.mjs` support port disruption/activity data.
`scripts/seed-pipelines-oil.mjs`, `seed-pipelines-gas.mjs`, `seed-storage-facilities.mjs`, `seed-fuel-shortages.mjs`, and `seed-energy-disruptions.mjs` support energy infrastructure.
`scripts/seed-commodity-quotes.mjs`, `seed-market-quotes.mjs`, and `seed-gulf-quotes.mjs` support market context.
`scripts/ais-relay.cjs` hosts relay/loop behavior for several live-ish streams and backup seed loops.
SCM/Chevron ingestion should start by extending these seed patterns instead of inventing another scheduler.

## Naming And Location Conventions

Panel classes use PascalCase filenames ending in `Panel.ts`, with panel ids usually kebab-case in config.
Service wrappers usually live in `src/services/<domain>/index.ts`.
Server RPC files use kebab-case names matching proto RPC names converted from lowerCamel/Pascal, such as `get-route-impact.ts`.
API RPC entrypoints use version folders, such as `api/supply-chain/v1/[rpc].ts`.
Proto packages use snake_case directories where needed, such as `proto/worldmonitor/supply_chain/v1/`.
Generated client imports also use snake_case paths, such as `@/generated/client/worldmonitor/supply_chain/v1/service_client`.
Static variant-specific configuration belongs in `src/config/variants/`.
Static shared datasets that are not browser-only can live under `shared/`.
Public static assets belong in `public/`; generated/protected API artifacts belong in `docs/api/`.

## Protected Or Generated Areas

Do not hand-edit `src/generated/`.
Do not hand-edit generated OpenAPI files in `docs/api/`.
Be cautious with `convex/_generated/`.
Do not mix browser-only imports into Edge API files under `api/`.
Do not edit `src/generated/server/...` handler types directly; update proto and regenerate.
Do not treat `.omx/` runtime state as source.
For this mapping task, do not modify files outside `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STRUCTURE.md`.

## Likely Homes For Chevron SCM Work

Chevron-specific dashboard defaults likely belong in a new `src/config/variants/chevron.ts` or `src/config/variants/scm.ts`.
Variant resolution changes would be in `src/config/variant.ts`, plus exports/aggregation in `src/config/variants/` and any central config barrel.
Panel registration would be in `src/config/panels.ts` and `src/app/panel-layout.ts`.
Chevron SCM panel components should likely live in `src/components/`, using names such as `ScmOverviewPanel.ts`, `ChevronRoutesPanel.ts`, or `EnergySupplyRiskPanel.ts`.
Business/data access wrappers should likely live in `src/services/supply-chain/`, `src/services/trade/`, or a new `src/services/scm/` only if the model is truly cross-domain.
Server aggregations should likely extend `server/worldmonitor/supply-chain/v1/` before creating a new service.
Trade exposure and tariff work likely belongs under `server/worldmonitor/trade/v1/`.
Tanker, vessel, port, and route-intelligence work likely belongs under `server/worldmonitor/maritime/v1/`, `server/worldmonitor/shipping/v2/`, or supply-chain route handlers.
Static Chevron asset/facility/watchlist config should live under `src/config/` if browser-safe, or `shared/` if needed by both scripts and server.
Private Chevron operational data should be server/Redis-backed and gated, not included in public `src/config/` bundles.
New seeders should live under `scripts/` and write `seed-meta:<key>` records consumed by `api/health.js`.
First-paint SCM data should be added to `api/bootstrap.js` and read with `getHydratedData()` in frontend services.

## Tests And Validation Surfaces

`npm run typecheck` runs the main TypeScript check.
`npm run typecheck:api` checks API/server types.
`npm run test:data` runs broad node:test coverage in `tests/`.
`npm run test:sidecar` runs sidecar and selected API tests.
`npm run test:e2e` runs Playwright suites.
`npm run lint:boundaries` checks dependency direction.
`tests/supply-chain-*.test.mjs`, `tests/supplier-route-risk.test.mjs`, `tests/transit-summaries.test.mjs`, `tests/route-explorer-*.test.mts`, `tests/shipping-v2-handler.test.mjs`, and trade/seed tests are likely relevant for SCM work.
`tests/edge-functions.test.mjs` guards Edge import boundaries.
`tests/proto` freshness is enforced by `.github/workflows/proto-check.yml` through generated output checks.

## Practical First Planning Pass

Start SCM adaptation by listing which Chevron requirements map to existing panel/service/RPC capabilities.
Use the existing `energy` and `commodity` variants as prototypes for panel order and map layer defaults.
Choose a small set of first-paint SCM metrics for bootstrap rather than hydrating every dataset.
Keep Chevron-private data behind server-side auth and avoid public bundle leakage.
Prefer adding narrowly scoped supply-chain/trade RPCs and seeders over a new monolithic SCM backend.
Verify desktop sidecar parity if the Chevron deliverable includes a desktop app.
