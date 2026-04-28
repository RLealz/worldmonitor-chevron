# Architecture Map

Focus: adapting WorldMonitor from a general OSINT dashboard into an SCM / Chevron SCM dashboard.

## System Shape

WorldMonitor is a TypeScript single-page application served by Vite and deployed with Vercel Edge APIs.
The browser UI lives under `src/`, domain APIs live under `api/` and `server/worldmonitor/`, and long-running data acquisition is mostly in `scripts/`.
The app renders a real-time operational picture through maps, panels, workers, generated RPC clients, and Redis-backed bootstrap data.
The desktop build wraps the same SPA in Tauri and routes API calls through a bundled Node.js sidecar under `src-tauri/sidecar/`.
For SCM work, this means the product can be adapted by adding a focused variant, SCM panels, supply-chain server handlers, and seed/cache keys without changing the whole shell.

## Layer Direction

The intended dependency direction is `types -> config -> services -> components -> app -> App.ts`.
`src/types/` should stay free of internal imports.
`src/config/` defines panels, variants, map layers, route tables, and market/commodity configuration.
`src/services/` wraps generated RPC clients, fetchers, circuit breakers, persistent cache, auth helpers, and business logic.
`src/components/` contains class-based panel and map components that consume services and render UI.
`src/app/` orchestrates layout, data loading, refresh scheduling, event handlers, and search.
`src/App.ts` is the top-level coordinator and should remain orchestration-heavy rather than domain-heavy.

## SPA Lifecycle

`src/main.ts` installs global CSS, Sentry, Vercel Analytics, UTM interception, and creates the `App`.
`src/App.ts` constructs `PanelLayoutManager`, `DataLoaderManager`, `EventHandlerManager`, `SearchManager`, `CountryIntelManager`, `RefreshScheduler`, and `DesktopUpdater`.
On desktop, `App.init()` waits for sidecar readiness via `waitForSidecarReady()` from `src/services/runtime.ts`.
Before panels are constructed, `App.init()` calls `fetchBootstrapData()` from `src/services/bootstrap.ts`.
Layout then creates map and panel instances through `src/app/panel-layout.ts`.
Shared UI, search, map-layer handlers, URL sync, deep links, data loading, refresh scheduling, and desktop update checks follow in phases.
SCM adaptation should preserve this lifecycle: hydrate SCM-critical Redis keys early, create SCM panels in layout, then use refresh scheduling for live deltas.

## Data Loading

`src/app/data-loader.ts` is the main bulk loading hub.
It imports domain fetchers from `src/services/`, pushes data into panels, syncs data freshness, updates map layers, and manages viewport-aware work.
`src/services/bootstrap.ts` fetches `/api/bootstrap?tier=fast|slow`, stores successful payloads in an in-memory one-shot hydration cache, and falls back to IndexedDB persistent cache.
Panels and services read hydrated keys with `getHydratedData(key)` before making RPC calls.
SCM/Chevron work should identify the high-value first-paint payloads, add them to `api/bootstrap.js`, and consume them through domain services.
Examples already adjacent to SCM include `shippingRates`, `chokepoints`, `minerals`, and `shippingStress` in `src/services/supply-chain/index.ts`.

## Panels

Panels are class components extending `src/components/Panel.ts`.
Panel registration and default visibility live in `src/config/panels.ts` and variant modules under `src/config/variants/`.
`src/app/panel-layout.ts` imports concrete panel classes and instantiates them by panel id.
The existing SCM-adjacent panel is `src/components/SupplyChainPanel.ts`.
Related operational panels include `src/components/TradePolicyPanel.ts`, `src/components/HormuzPanel.ts`, `src/components/ChokepointStripPanel.ts`, `src/components/PipelineStatusPanel.ts`, `src/components/StorageFacilityMapPanel.ts`, `src/components/FuelShortagePanel.ts`, `src/components/EnergyDisruptionsPanel.ts`, and `src/components/EnergyRiskOverviewPanel.ts`.
Route-planning UI already exists in `src/components/RouteExplorer/`.
For a Chevron SCM dashboard, prefer new panels that compose these existing service contracts before introducing a parallel dashboard framework.

## Maps And Layers

The map system is split between flat DeckGL/MapLibre and globe rendering.
Layer metadata lives in `src/config/map-layer-definitions.ts`.
SCM-relevant layer keys include `pipelines`, `storageFacilities`, `fuelShortages`, `ais`, `liveTankers`, `tradeRoutes`, `waterways`, `commodityPorts`, `commodityHubs`, `minerals`, `sanctions`, `weather`, `natural`, `fires`, `climate`, and `outages`.
Layer availability is variant-scoped through `VARIANT_LAYER_ORDER` in `src/config/map-layer-definitions.ts`.
Map defaults are set per variant in `src/config/panels.ts` and `src/config/variants/*.ts`.
An SCM variant should start from the `energy` or `commodity` layer mix rather than the full geopolitical default.

## API, Server, And Proto Flow

Domain APIs follow a generated RPC pattern.
Proto definitions live under `proto/worldmonitor/<domain>/`.
Generated client stubs live under `src/generated/client/worldmonitor/`.
Generated server route/types live under `src/generated/server/worldmonitor/`.
Vercel route entrypoints live under `api/<domain>/v1/[rpc].ts` or equivalent versioned paths.
Server handlers live under `server/worldmonitor/<domain>/v1/handler.ts` plus per-RPC implementation files.
For example, `api/supply-chain/v1/[rpc].ts` wires generated routes to `server/worldmonitor/supply-chain/v1/handler.ts`.
The supply-chain proto surface is under `proto/worldmonitor/supply_chain/v1/`, with client wrappers in `src/services/supply-chain/index.ts`.
When adding Chevron-specific SCM endpoints, decide whether they belong in the existing `supply_chain`, `trade`, `market`, `maritime`, or `shipping` service before adding a new domain.

## Gateway And API Rules

`server/gateway.ts` centralizes CORS, API key validation, entitlement checks, rate limiting, route matching, error mapping, ETag handling, and cache headers.
Gateway cache tiers are selected by RPC path in `RPC_CACHE_TIER`.
Edge entrypoints in `api/` must remain self-contained Edge-compatible files and may import same-directory helpers or generated/server gateway wiring, but must not import browser `src/` code directly except generated server stubs used by the gateway pattern.
The project explicitly bans `fetch.bind(globalThis)` and expects server-side upstream fetches to include a `User-Agent`.
SCM endpoints with customer-sensitive or Chevron-specific data should be reviewed for entitlement, API-key, cache tier, and `no-store` needs before implementation.

## Caching And Seed Pipeline

Redis caching is centered in `server/_shared/redis.ts` and seed utilities under `scripts/_seed-utils.mjs`.
Server handlers use cached reads or `cachedFetchJson()` to coalesce cache misses and avoid upstream stampedes.
Seeder scripts write data keys plus `seed-meta:<key>` freshness records for health monitoring.
`api/bootstrap.js` batches selected Redis keys for frontend hydration.
`api/health.js` validates key freshness and reports stale/empty/warn states.
SCM adaptation should define canonical SCM cache keys early, add health metadata, and avoid duplicating key names across scripts, bootstrap, handlers, and panels.

## Existing SCM-Adjacent Domains

Supply chain handlers live in `server/worldmonitor/supply-chain/v1/`.
Trade handlers live in `server/worldmonitor/trade/v1/`.
Market handlers live in `server/worldmonitor/market/v1/`.
Maritime live vessel and navigational-warning handlers live in `server/worldmonitor/maritime/v1/`.
Shipping v2 webhook and route intelligence handlers live in `server/worldmonitor/shipping/v2/`.
Seeders relevant to SCM include `scripts/seed-supply-chain-trade.mjs`, `scripts/seed-comtrade-bilateral-hs4.mjs`, `scripts/seed-portwatch.mjs`, `scripts/seed-portwatch-disruptions.mjs`, `scripts/seed-portwatch-port-activity.mjs`, `scripts/seed-chokepoint-baselines.mjs`, `scripts/seed-chokepoint-flows.mjs`, `scripts/seed-pipelines-oil.mjs`, `scripts/seed-pipelines-gas.mjs`, `scripts/seed-storage-facilities.mjs`, `scripts/seed-fuel-shortages.mjs`, `scripts/seed-energy-disruptions.mjs`, and `scripts/seed-commodity-quotes.mjs`.

## Desktop And Sidecar

The Tauri app lives in `src-tauri/`.
The Node sidecar under `src-tauri/sidecar/local-api-server.mjs` loads local API handler bundles, forwards requests, enforces SSRF protections, limits upstream concurrency, forces IPv4 for flaky upstream APIs, and rate-gates Yahoo Finance.
Desktop builds are controlled by scripts in `package.json`, including `desktop:dev`, `desktop:build:full`, `desktop:build:tech`, and `desktop:build:finance`.
Build helpers such as `scripts/build-sidecar-sebuf.mjs` and `scripts/build-sidecar-handlers.mjs` package generated server routes and handlers for the desktop runtime.
For a Chevron SCM desktop build, sidecar parity matters: new SCM endpoints must be included in sidecar handler generation and should work without depending on Vercel-only behavior.

## Deployment

The web SPA and Edge APIs deploy to Vercel using `vercel.json`.
Static app routes rewrite to `index.html`; `/api/*` routes go to Edge Functions; docs are proxied to Mintlify.
Railway/Docker surfaces exist for relay services and seed jobs in `Dockerfile*`, `docker/`, `deploy/`, and `scripts/ais-relay.cjs`.
Convex supports auth, entitlements, payments, preferences, and notification-related state under `convex/`.
Docs and OpenAPI artifacts live in `docs/` and `docs/api/`.
SCM work that changes public API contracts must update proto-generated OpenAPI docs via `make generate`.

## Extension Points

Add a panel by creating `src/components/<Name>Panel.ts`, exporting it from component barrels if needed, registering it in `src/app/panel-layout.ts`, and adding config in `src/config/panels.ts` or `src/config/variants/<variant>.ts`.
Add a domain RPC by editing proto files under `proto/worldmonitor/<domain>/`, running generation, adding a handler under `server/worldmonitor/<domain>/v1/`, and wiring cache tier in `server/gateway.ts`.
Add a client service wrapper under `src/services/<domain>/index.ts` that uses generated clients, circuit breakers, `premiumFetch` when required, and bootstrap hydration when useful.
Add map data by extending `src/types/`, map layer definitions, map renderers, and data-loader updates.
Add seeded datasets by creating scripts under `scripts/`, writing Redis keys through shared seed utilities, adding `seed-meta`, exposing health in `api/health.js`, and hydrating through `api/bootstrap.js` when first-paint critical.

## SCM / Chevron Adaptation Implications

The fastest low-risk path is likely a focused `chevron` or `scm` variant that reuses existing energy, commodity, trade, shipping, and supply-chain modules.
Core Chevron views probably map to existing primitives: upstream/downstream energy corridors, chokepoints, tanker/live AIS, pipelines, storage, fuel shortages, sanctions, weather/natural hazards, port disruptions, commodity prices, and route alternatives.
The existing `energy` variant layer order in `src/config/map-layer-definitions.ts` is closer to Chevron SCM than the broad `full` variant.
Customer-specific SCM data should be modeled as overlays and panels with clear cache/entitlement boundaries, not hardcoded into general OSINT feeds.
Chevron-specific labels, watchlists, asset groups, supplier tiers, and facility metadata should likely live in `src/config/` or `shared/` if static, and in Redis-backed seeded data if dynamic.
Avoid mixing Chevron-specific operational secrets into public docs, generated OpenAPI, or unauthenticated bootstrap payloads.
For planning, first inventory the existing supply-chain RPCs and decide which Chevron use cases are configuration-only, which need new server-side aggregation, and which require new upstream sources or private data ingestion.
