# Chevron SCM Demo Dashboard

Public-data operational intelligence demo for energy supply chain monitoring.

This repository adapts the World Monitor dashboard architecture into a standalone Chevron-framed SCM demo. The product shell, navigation, settings, and demo documentation are oriented around energy supply-chain workflows rather than the upstream World Monitor public product.

## Demo Scope

The demo covers four public-data SCM risk areas:

- Supplier and country risk signals
- Port, maritime, route, and chokepoint disruption
- Sanctions, trade policy, and export-control exposure context
- Energy materials, commodities, pipelines, storage, and market stress

The dashboard includes Chevron-branded demo views for SCM operations, energy risk, materials, routes, trade controls, and markets. These views reuse existing panels, APIs, seed pipelines, and map layers where possible.

## Safety Boundaries

This is a public/open-source-data-only demo. It must not ingest, model, display, or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventories, facility-sensitive details, internal routes, customer routes, contract pricing, restricted-party case files, or final compliance determinations.

Chevron wording is demo framing only. The implementation should remain reusable as a generic energy SCM dashboard and must not imply Chevron endorsement or production deployment.

See:

- [SCM demo safety notes](./docs/scm-demo-safety.md)
- [SCM API data index](./docs/scm-api-data-index.md)

## Quick Start

```bash
npm install
npm run dev
```

For the Chevron SCM shell, set:

```env
VITE_VARIANT=scm
```

Then open [http://localhost:5173](http://localhost:5173).

## Environment Variables

Local and hosted deployments should provide the public-data/cache credentials needed by the seeders and API cache readers:

```env
VITE_VARIANT=scm
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
EIA_API_KEY=...
FRED_API_KEY=...
WTO_API_KEY=...
```

Optional keys may be added for other public sources as needed. Do not commit `.env` files or expose secrets through `VITE_*` variables unless the value is intentionally public.

## Data Flow

Most dashboard API endpoints read cached public data rather than fetching every upstream source live from the browser:

```text
Public upstream API or file
  -> seed script
  -> Upstash Redis key
  -> server/worldmonitor RPC handler or api/ endpoint
  -> browser panel/service
```

Key SCM surfaces include supply-chain chokepoints, shipping stress, sanctions pressure, trade restrictions, critical minerals, energy prices, oil inventories, pipelines, storage facilities, fuel shortages, and route exploration.

## Development

```bash
npm run typecheck
npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-demo-no-auth-gating.test.mjs tests/scm-demo-view-navigation.test.mjs tests/scm-public-artifact-safety.test.mjs tests/scm-variant-config.test.mjs
```

Browser smoke checks:

```bash
VITE_VARIANT=scm npx playwright test e2e/scm-demo-branding.spec.ts e2e/scm-demo-view-navigation.spec.ts e2e/scm-no-auth-gating.spec.ts
```

Build:

```bash
npm run build
```

## Vercel Deployment

The repo is Vercel-ready: it includes `vercel.json`, Vite build output, SPA rewrites, and `api/` serverless/edge endpoints.

Recommended Vercel settings:

- Build command: `npm run build`
- Environment variable: `VITE_VARIANT=scm`
- Add Redis and public-source API keys listed above

Without Redis/upstream keys, the application can still deploy, but panels that depend on seeded public data may show unavailable, stale, or cached fallback states.

## Upstream Provenance

This project is based on the open-source World Monitor codebase and keeps the original architecture patterns: TypeScript/Vite browser app, Vercel API endpoints, sebuf/protobuf API contracts, Redis-backed cache readers, and Tauri desktop support.

When syncing from upstream, do it on a branch and review conflicts carefully. Do not overwrite the Chevron SCM demo commits with a hard reset.

## License

The upstream project is licensed under AGPL-3.0 with commercial-use restrictions stated in the original repository. Keep attribution and license obligations in mind when deploying, modifying, or presenting this demo.
