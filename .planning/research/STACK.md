# Chevron SCM Demo Stack Research

## Prescriptive Stack

- Use the existing TypeScript + Vite + Preact SPA, not a new frontend stack.
- Use the existing WorldMonitor variant system, with `src/config/variants/energy.ts` as the closest baseline and `src/config/panels.ts` as the panel/variant control point.
- Use the existing Edge/API + server + proto flow for any new data surface:
  - `api/*`
  - `server/worldmonitor/*`
  - `proto/worldmonitor/*`
  - generated stubs under `src/generated/*` via `make generate`
- Use the existing cache/bootstrap path for first-paint public OSINT data:
  - `api/bootstrap.js`
  - `server/_shared/redis.ts`
  - `src/services/bootstrap.ts`
  - `src/app/data-loader.ts`
- Keep desktop/Tauri as optional packaging only:
  - `src-tauri/`
  - `src-tauri/sidecar/`

## Existing Technical Surfaces To Reuse

- `src/components/SupplyChainPanel.ts` for the main SCM aggregation surface. Confidence: high.
- `src/components/RouteExplorer/RouteExplorer.ts`, `src/components/RouteExplorer/url-state.ts`, and `src/components/RouteExplorer/RouteExplorer.utils.ts` for route disruption and corridor analysis. Confidence: high.
- `src/components/SanctionsPressurePanel.ts` and `src/components/TradePolicyPanel.ts` for sanctions/export-control exposure. Confidence: high.
- `src/components/EnergyRiskOverviewPanel.ts`, `src/components/EnergyDisruptionsPanel.ts`, `src/components/PipelineStatusPanel.ts`, `src/components/StorageFacilityMapPanel.ts`, `src/components/FuelShortagePanel.ts`, `src/components/HormuzPanel.ts`, `src/components/EnergyComplexPanel.ts`, and `src/components/OilInventoriesPanel.ts` for the energy/materials workspace. Confidence: high.
- `src/services/supply-chain/`, `src/services/sanctions-pressure.ts`, `src/services/trade/`, `src/services/maritime/`, and `src/services/live-tankers.ts` for client-side data orchestration. Confidence: high.
- `server/worldmonitor/supply-chain/v1/`, `server/worldmonitor/sanctions/v1/`, `server/worldmonitor/trade/v1/`, `server/worldmonitor/maritime/v1/`, and `server/worldmonitor/shipping/v2/` for backend aggregation. Confidence: high.
- `proto/worldmonitor/supply_chain/v1/`, `proto/worldmonitor/sanctions/v1/`, `proto/worldmonitor/trade/v1/`, and `proto/worldmonitor/maritime/v1/` for contract-first additions. Confidence: high.
- `scripts/seed-supply-chain-trade.mjs`, `scripts/seed-portwatch.mjs`, `scripts/seed-chokepoint-baselines.mjs`, `scripts/seed-chokepoint-flows.mjs`, `scripts/seed-pipelines-oil.mjs`, `scripts/seed-pipelines-gas.mjs`, `scripts/seed-storage-facilities.mjs`, `scripts/seed-fuel-shortages.mjs`, `scripts/seed-energy-disruptions.mjs`, and `scripts/seed-commodity-quotes.mjs` for public-data hydration. Confidence: medium-high.

## What To Use For The Brownfield Demo

1. Build a new `chevron-scm` or `scm` variant, but keep it inside the existing variant/panel system. Confidence: high.
2. Reuse the energy layout pattern from `src/config/variants/energy.ts` instead of starting from `full`. Confidence: high.
3. Reuse existing supply-chain, maritime, trade, sanctions, energy, and route components instead of creating a parallel dashboard shell. Confidence: high.
4. Keep all demo data public/open-source only, with clear empty-state copy that says the dashboard is not using proprietary Chevron data. Confidence: high.

## What Not To Use

- Do not fork the app into a second dashboard framework. Confidence: high.
- Do not start from `src/config/variants/full.ts` or the broad `full` panel mix when the demo is SCM-focused. Confidence: high.
- Do not hand-edit `src/generated/*`; regenerate contracts from `proto/worldmonitor/*`. Confidence: high.
- Do not route proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive details, internal routes, pricing, or operational secrets through public surfaces. Confidence: high.
- Do not send sensitive SCM payloads through public bootstrap hydration, public docs, analytics, Sentry, screenshots, or public cache tiers. Confidence: high.
- Do not add a new data stack unless the current supply-chain, maritime, trade, sanctions, and energy surfaces cannot satisfy a required public-data view. Confidence: medium.

## Bottom Line

The right stack for this brownfield SCM demo is the existing WorldMonitor stack, specialized through a new SCM variant and existing operational panels. The demo should stay OSINT-only, reuse the current TypeScript/Vite/Preact + Edge/API + proto architecture, and avoid any path that implies proprietary Chevron data access.
