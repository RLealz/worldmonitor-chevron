# Chevron SCM Demo Architecture

## Recommendation
Build a `chevron-scm` or `scm` variant as a thin orchestration layer over the existing WorldMonitor stack. Keep the browser bundle public-data-only, and treat any private or tenant-specific SCM capability as a separate future service boundary.

## Component Boundaries
- `src/config/variants/*` should define the variant identity and default experience.
- `src/config/panels.ts` should own panel order, labels, and variant-scoped map layers.
- `src/app/panel-layout.ts` should instantiate panels and wire cross-panel callbacks.
- `src/app/data-loader.ts` should fan out fetches, update panels, update the map, and record freshness.
- `src/services/supply-chain/index.ts` should remain the client-facing supply-chain wrapper.
- `server/worldmonitor/supply-chain/v1/handler.ts` should remain the RPC registry.
- `proto/worldmonitor/supply_chain/v1/service.proto` should remain the contract source of truth.
- `api/supply-chain/v1/[rpc].ts` should stay a thin gateway surface.

## Demo-Safe Reuse
- Safe public first-paint data: shipping rates, chokepoints, critical minerals, shipping stress, pipelines, storage facilities, fuel shortages, and energy disruptions.
- Safe UI containers: `SupplyChainPanel`, `EnergyRiskOverviewPanel`, `PipelineStatusPanel`, `StorageFacilityMapPanel`, `FuelShortagePanel`, `EnergyDisruptionsPanel`, `ChokepointStripPanel`, and `HormuzPanel`.
- Treat `TradePolicyPanel`, `RouteExplorer`, and the PRO-gated supply-chain RPCs as conditional, not core demo dependencies, unless the upstream data source is confirmed public and entitlement-free.

## Data Flow
1. Bootstrap hydrates first-paint public keys from `/api/bootstrap` through `src/services/bootstrap.ts`.
2. `PanelLayoutManager` creates the variant's panels from `DEFAULT_PANELS`.
3. `DataLoaderManager.loadSupplyChain()` fans out with `Promise.allSettled()` so one failed source does not blank the workspace.
4. Each service response updates its panel; chokepoint data also updates the map, and the loader records freshness and API status centrally.
5. Panels own rendering plus empty and error states; the loader owns fetch orchestration; the map owns overlay state.

## Build Order
- If the change is config-only, add the variant, panel order, and map layers first.
- If a new public aggregate is required, do proto -> generated client/server -> handler -> API route -> service wrapper -> loader/panel -> bootstrap key -> tests.
- Add bootstrap keys only for public OSINT payloads that materially improve first paint.
- Add private SCM data only behind a separate auth/cache/no-store design, not in this demo.

## Variant, Panel, Service, API, And Test Boundaries
- Variant defaults should start from `energy` and only widen where the demo needs it.
- `VARIANT_PANEL_OVERRIDES` should carry labels and presentation only, not hidden business logic.
- `src/services/supply-chain/index.ts` should remain the aggregation point for public supply-chain RPCs.
- Keep `server/worldmonitor/supply-chain/v1/handler.ts` as the registry of public demo RPCs; anything private should move to a new service namespace later.
- Guardrails should land in `tests/bootstrap.test.mjs`, `tests/panel-config-guardrails.test.mjs`, `tests/variant-layer-guardrail.test.mjs`, `tests/supply-chain-handlers.test.mjs`, `tests/supply-chain-v2.test.mjs`, and the route explorer tests.

## Public-Data Safety
- Do not add proprietary Chevron supplier rosters, contracts, shipments, inventory, internal routes, pricing, or facility-sensitive details anywhere in `src/`, `api/`, `server/`, `docs/`, bootstrap, logs, analytics, or screenshots.
- Use source, timestamp, confidence, and provenance in every operator-facing risk card.
- Prefer static or curated public datasets over inferred private-looking values.
- Sanitize errors so they never reveal tenant data or hidden upstream fields.
- If a capability cannot be backed by open/public sources, leave it out of the demo.

## Net Result
The brownfield fit is a focused public SCM variant that reuses the existing energy and supply-chain stack, keeps the public bootstrap fast, and preserves a clean path to a future private SCM product without leaking Chevron-sensitive data.
