---
title: "Chevron SCM Demo API Data Index"
description: "Panel-to-endpoint-to-seed wiring index for the public-data Chevron SCM demo dashboard."
---

# Chevron SCM Demo API Data Index

This is the working control sheet for wiring real public API data into the
Chevron SCM Demo Dashboard. It intentionally tracks only public/open-source data.
Do not add Chevron supplier rosters, contracts, shipments, inventory,
facility-sensitive routes, pricing, or operational secrets.

## Data Flow

Most dashboard APIs are cache readers, not live upstream fetchers.
The expected path is:

```text
Public upstream API or file
  -> seed script
  -> Upstash Redis key
  -> server/worldmonitor RPC handler
  -> /api/<service>/v1/<rpc-name>
  -> panel/service in the browser
```

Required cache credentials:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional public-source credentials depend on which seeders are enabled:

```env
EIA_API_KEY=...
FRED_API_KEY=...
WTO_API_KEY=...
GIE_API_KEY=...
ALPHA_VANTAGE_API_KEY=...
```

Keep all keys in deployment/local environment files such as `.env.local` or
`.env`. Do not commit them or expose them through `VITE_*` variables unless the
value is intentionally public.

## API Reference Locations

- Human API catalog: `docs/api-reference.mdx`
- Full OpenAPI bundle: `docs/api/worldmonitor.openapi.yaml`
- SCM-relevant OpenAPI specs:
  - `docs/api/SupplyChainService.openapi.yaml`
  - `docs/api/TradeService.openapi.yaml`
  - `docs/api/SanctionsService.openapi.yaml`
  - `docs/api/MarketService.openapi.yaml`
  - `docs/api/EconomicService.openapi.yaml`
- Broad data catalog: `docs/data-sources.mdx`
- Seed/cron deployment runbook: `docs/railway-seed-consolidation-runbook.md`
- SCM safety framing: `docs/scm-demo-safety.md`

## SCM Panel Wiring

| Dashboard surface | Primary component | API endpoint(s) | Redis key(s) | Seeder/upstream |
|---|---|---|---|---|
| Supply chain chokepoints | `src/components/SupplyChainPanel.ts` | `/api/supply-chain/v1/get-chokepoint-status` | `supply_chain:chokepoints:v4`, `supply_chain:transit-summaries:v1`, `energy:chokepoint-flows:v1` | `scripts/ais-relay.cjs`, `scripts/seed-chokepoint-flows.mjs`, PortWatch/EIA baselines |
| Shipping stress/rates | `src/components/SupplyChainPanel.ts` | `/api/supply-chain/v1/get-shipping-stress`, `/api/supply-chain/v1/get-shipping-rates` | `supply_chain:shipping_stress:v1`, `supply_chain:shipping:v2` | supply-chain shipping seed/relay jobs |
| Critical minerals/materials | `src/components/SupplyChainPanel.ts` | `/api/supply-chain/v1/get-critical-minerals` | `supply_chain:minerals:v2` | server-side public minerals reference logic |
| Supplier/public country risk | `src/components/SupplierRiskPanel.ts` | Uses public SCM/country risk services | mixed public risk keys | public country, sanctions, trade, and disruption indicators only |
| Sanctions pressure | `src/components/SanctionsPressurePanel.ts` | `/api/sanctions/v1/list-sanctions-pressure`, `/api/sanctions/v1/lookup-sanction-entity` | `sanctions:pressure:v1`, `sanctions:entities:v1`, `sanctions:country-counts:v1` | `scripts/seed-sanctions-pressure.mjs`, OFAC public XML downloads |
| Trade restrictions | `src/components/TradePolicyPanel.ts` | `/api/trade/v1/get-trade-restrictions` | `trade:restrictions:v1:tariff-overview:50` | `scripts/seed-supply-chain-trade.mjs`, WTO |
| Trade barriers | `src/components/TradePolicyPanel.ts` | `/api/trade/v1/get-trade-barriers` | `trade:barriers:v1:tariff-gap:50` | `scripts/seed-supply-chain-trade.mjs`, WTO |
| Tariff trends | `src/components/TradePolicyPanel.ts` | `/api/trade/v1/get-tariff-trends` | `trade:tariffs:v1:<reporter>:<sector>:<years>` | `scripts/seed-supply-chain-trade.mjs`, WTO |
| Bilateral trade flows | `src/components/TradePolicyPanel.ts` | `/api/trade/v1/get-trade-flows`, `/api/trade/v1/list-comtrade-flows` | `trade:flows:v1:<reporter>:<partner>:<years>`, `comtrade:flows:<reporter>:<cmdCode>` | `scripts/seed-supply-chain-trade.mjs`, Comtrade/WTO |
| Commodity quotes | market and SCM panels | `/api/market/v1/list-commodity-quotes` | `market:commodities-bootstrap:v1`, `market:commodities:v1:<symbols>` | `scripts/seed-commodity-quotes.mjs`, market quote providers |
| Energy complex | `src/components/EnergyComplexPanel.ts` | `/api/economic/v1/get-energy-prices` | `economic:energy:v1:all` | economy/energy seeders, EIA series |
| Oil inventories | `src/components/OilInventoriesPanel.ts` | `/api/economic/v1/get-oil-inventories`, `/api/economic/v1/get-crude-inventories` | `economic:crude-inventories:v1`, `economic:spr:v1`, `economic:nat-gas-storage:v1`, `economic:eu-gas-storage:v1`, `energy:oil-stocks-analysis:v1`, `economic:refinery-inputs:v1` | `scripts/seed-eia-petroleum.mjs`, `scripts/seed-iea-oil-stocks.mjs`, `scripts/seed-gie-gas-storage.mjs` |
| Pipeline status | `src/components/PipelineStatusPanel.ts` | `/api/supply-chain/v1/list-pipelines`, `/api/supply-chain/v1/get-pipeline-detail` | `energy:pipelines:gas:v1`, `energy:pipelines:oil:v1` | `scripts/seed-pipelines-gas.mjs`, `scripts/seed-pipelines-oil.mjs` |
| Storage facilities | `src/components/StorageFacilityMapPanel.ts` | `/api/supply-chain/v1/list-storage-facilities`, `/api/supply-chain/v1/get-storage-facility-detail` | `energy:storage-facilities:v1` | `scripts/seed-storage-facilities.mjs` |
| Fuel shortages | `src/components/FuelShortagePanel.ts` | `/api/supply-chain/v1/list-fuel-shortages`, `/api/supply-chain/v1/get-fuel-shortage-detail` | `energy:fuel-shortages:v1` | `scripts/seed-fuel-shortages.mjs` |
| Energy disruptions | `src/components/EnergyDisruptionsPanel.ts` | `/api/supply-chain/v1/list-energy-disruptions` | `energy:disruptions:v1` | `scripts/seed-energy-disruptions.mjs` |
| Hormuz tracker | `src/components/HormuzPanel.ts` | `/api/supply-chain/hormuz-tracker` | `supply_chain:hormuz_tracker:v1` | `scripts/seed-hormuz.mjs`, WTO DataLab / AXSMarine public tracker |

## Bootstrap Keys

The bootstrap endpoint hydrates many non-request-varying panel payloads from
Redis. SCM-relevant bootstrap keys are defined in `server/_shared/cache-keys.ts`.

| Bootstrap id | Redis key | Tier |
|---|---|---|
| `chokepoints` | `supply_chain:chokepoints:v4` | fast |
| `shippingRates` | `supply_chain:shipping:v2` | fast |
| `shippingStress` | `supply_chain:shipping_stress:v1` | fast |
| `commodityQuotes` | `market:commodities-bootstrap:v1` | fast |
| `sanctionsPressure` | `sanctions:pressure:v1` | slow |
| `customsRevenue` | `trade:customs-revenue:v1` | slow |
| `crudeInventories` | `economic:crude-inventories:v1` | slow |
| `natGasStorage` | `economic:nat-gas-storage:v1` | slow |
| `euGasStorage` | `economic:eu-gas-storage:v1` | slow |
| `oilStocksAnalysis` | `energy:oil-stocks-analysis:v1` | slow |
| `pipelinesGas` | `energy:pipelines:gas:v1` | slow |
| `pipelinesOil` | `energy:pipelines:oil:v1` | slow |
| `storageFacilities` | `energy:storage-facilities:v1` | slow |
| `fuelShortages` | `energy:fuel-shortages:v1` | slow |
| `energyDisruptions` | `energy:disruptions:v1` | slow |
| `energyCrisisPolicies` | `energy:crisis-policies:v1` | slow |

Current local-dev caveat: `/api/bootstrap` must be executed as an API route.
If Vite serves `api/bootstrap.js` as `text/javascript`, bootstrap hydration is
not actually running.

## EIA Wiring Notes

As of 2026-04-29, this exact EIA API URL was tested without a key:

```text
https://api.eia.gov/v2/crude-oil-imports/data/?frequency=monthly&data[0]=quantity&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5
```

The response was `403 API_KEY_MISSING` with the message:

```text
No api_key was supplied. Please register for one at https://www.eia.gov/opendata/register.php
```

So the EIA API endpoint is free to use, but it still expects `api_key` or an
equivalent API key header/parameter. EIA bulk files may be usable without an API
key, but the `api.eia.gov/v2/...` API path should be treated as key-required.

The route the SCM demo should add next is:

```text
GET https://api.eia.gov/v2/crude-oil-imports/data/
  ?frequency=monthly
  &data[0]=quantity
  &sort[0][column]=period
  &sort[0][direction]=desc
  &offset=0
  &length=5000
  &api_key=$EIA_API_KEY
```

Recommended cache target:

```text
energy:eia-crude-imports:v1
```

Recommended first dashboard use:

- Energy materials risk: import concentration by origin country.
- Route disruption: crude import origins crossing Hormuz, Suez, Panama, or Cape
  alternate lanes.
- Sanctions/export exposure: origin-country overlay against public sanctions
  pressure and trade-control context.

Do not infer Chevron cargoes, suppliers, routes, or procurement exposure from
EIA imports. Keep labels at public-market or public-country level.

## Minimum SCM Seeding Set

To make the demo feel live with public data, run these first:

```powershell
node scripts/seed-commodity-quotes.mjs
node scripts/seed-sanctions-pressure.mjs
node scripts/seed-supply-chain-trade.mjs
node scripts/seed-eia-petroleum.mjs
node scripts/seed-iea-oil-stocks.mjs
node scripts/seed-gie-gas-storage.mjs
node scripts/seed-portwatch.mjs
node scripts/seed-portwatch-disruptions.mjs
node scripts/seed-chokepoint-flows.mjs
node scripts/seed-pipelines-gas.mjs
node scripts/seed-pipelines-oil.mjs
node scripts/seed-storage-facilities.mjs
node scripts/seed-fuel-shortages.mjs
node scripts/seed-energy-disruptions.mjs
node scripts/seed-hormuz.mjs
```

Some scripts are dependency ordered. For example, `seed-chokepoint-flows.mjs`
expects PortWatch and chokepoint baseline data to already exist in Redis.

## Verification Checklist

After keys and seeders are wired, verify these endpoints return non-empty JSON:

```text
/api/bootstrap?tier=fast
/api/bootstrap?tier=slow
/api/supply-chain/v1/get-chokepoint-status
/api/market/v1/list-commodity-quotes?symbols=CL%3DF&symbols=BZ%3DF
/api/sanctions/v1/list-sanctions-pressure?maxItems=5
/api/trade/v1/get-trade-restrictions?limit=5
/api/economic/v1/get-oil-inventories
```

If an endpoint returns empty arrays with `upstreamUnavailable: true`, check:

1. Redis credentials are present in the API runtime.
2. The corresponding seed script ran successfully.
3. The expected Redis key exists without a Vercel preview prefix mismatch.
4. `/api/bootstrap` is returning JSON, not raw JavaScript source.

## Adding A New SCM Data Route

Use this sequence for new public data such as EIA crude oil imports:

1. Pick the public upstream URL and verify whether a key is required.
2. Add or extend a seed script under `scripts/`.
3. Write one canonical Redis key plus `seed-meta:<domain>` health metadata.
4. Add the key to `server/_shared/cache-keys.ts` if it is bootstrap-safe.
5. Add or extend a server RPC handler under `server/worldmonitor/...`.
6. Expose/confirm the RPC in the relevant OpenAPI/proto path.
7. Wire the frontend panel through the existing service/helper pattern.
8. Add a smoke test or endpoint verification command.

Prefer seeded server-side fetches over browser-direct fetches. This keeps keys
off the client, smooths rate limits, and makes the demo reproducible.
