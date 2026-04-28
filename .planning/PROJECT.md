# Chevron SCM Demo Dashboard

## What This Is

WorldMonitor is being adapted into an open-source-data-only Chevron SCM demo dashboard. The demo presents a reusable energy supply-chain management intelligence workspace covering supplier risk, port and route disruption, sanctions and export-control exposure, and energy materials risk using public data already available in the repository or obtainable from public sources.

This is not a production Chevron deployment and must not imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive details, internal routes, pricing, or operational secrets. Chevron-specific wording is demo framing; the underlying system should remain reusable as a generic energy SCM dashboard.

## Core Value

An operator can open a focused SCM demo variant and quickly understand public-data risks to energy supply chains across suppliers, routes, sanctions/trade controls, and energy materials without exposing or fabricating private Chevron operational data.

## Requirements

### Validated

- [x] Existing SPA shell supports variant-specific dashboard experiences through Vite/Preact configuration and panel registration.
- [x] Existing panel architecture supports dense operational panels through class-based `Panel` subclasses.
- [x] Existing map layer system supports energy, trade route, chokepoint, sanctions, weather, infrastructure, and materials overlays.
- [x] Existing supply-chain domain includes chokepoints, shipping rates, shipping stress, critical minerals, route explorer lanes, route impact, country products, sector dependency, country cost shock, bypass options, pipelines, storage facilities, fuel shortages, and energy disruption handlers.
- [x] Existing sanctions and trade domains provide a starting point for public sanctions pressure, entity lookup, trade restrictions, tariffs, trade barriers, and Comtrade-style trade flows.
- [x] Existing energy variant provides a close baseline for the SCM demo panel and layer mix.
- [x] Existing codebase map documents current architecture, conventions, testing, integrations, and concerns under `.planning/codebase/`.

### Active

- [ ] Create a public-data `chevron-scm` or `scm` variant that reuses existing WorldMonitor panels, services, APIs, map layers, and seed pipelines.
- [ ] Cover four demo workspaces: supplier risk, port/route disruption, sanctions/export-control exposure, and energy materials risk.
- [ ] Make demo/open-source data status explicit in product framing and empty states.
- [ ] Reuse existing supply-chain, route explorer, sanctions, trade policy, maritime/chokepoint, energy disruption, critical minerals, pipeline, storage, fuel shortage, commodity, and energy market capabilities before adding new domains.
- [ ] Keep the implementation reusable as a generic energy SCM dashboard rather than hardcoding private Chevron assumptions.
- [ ] Produce requirements and a roadmap that make Phase 1 executable through `$gsd-plan-phase 1`.

### Out of Scope

- Proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive details, internal routes, pricing, or operational secrets — demo uses open-source data only.
- Production enterprise RBAC, audit logging, legal hold, compliance evidence retention, and corporate deployment hardening — future production scope, not demo v1.
- Private SCM ingestion pipelines — future production scope after auth, cache, telemetry, and data-governance boundaries are designed.
- Claiming operational truth about Chevron-specific suppliers, lanes, assets, or compliance posture — the demo must use public-data framing and source provenance.
- Building a separate dashboard framework — use the existing WorldMonitor variant, panel, service, map, API, and seed patterns.

## Context

The repository is a mature TypeScript/Vite/Preact OSINT dashboard with Vercel Edge APIs, server-side RPC handlers, generated proto clients/servers, Redis-backed cache/seed patterns, a Tauri desktop shell, and many domain panels. The SCM demo should build on existing supply-chain and energy capabilities rather than starting from scratch.

Relevant existing planning artifacts:

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/TESTING.md`
- `.planning/codebase/INTEGRATIONS.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/chevron-scm-variant-plan.md`

Relevant implementation surfaces include:

- `src/config/variants/energy.ts`
- `src/config/panels.ts`
- `src/config/map-layer-definitions.ts`
- `src/components/SupplyChainPanel.ts`
- `src/components/RouteExplorer/`
- `src/components/SanctionsPressurePanel.ts`
- `src/components/TradePolicyPanel.ts`
- `src/components/EnergyDisruptionsPanel.ts`
- `src/components/EnergyRiskOverviewPanel.ts`
- `src/services/supply-chain/index.ts`
- `src/services/sanctions-pressure.ts`
- `server/worldmonitor/supply-chain/v1/`
- `server/worldmonitor/sanctions/v1/`
- `server/worldmonitor/trade/v1/`
- `server/worldmonitor/maritime/v1/`
- `proto/worldmonitor/supply_chain/v1/`
- `proto/worldmonitor/sanctions/v1/`
- `proto/worldmonitor/trade/v1/`

The desired first milestone is a public-data SCM demo variant that brings together existing capabilities into a coherent operator-facing experience.

## Constraints

- **Data boundary**: Use only public/open-source data already available in the repo or obtainable from public sources — this is a demo, not a production Chevron deployment.
- **Brand/framing**: Chevron-specific wording is demo framing only — implementation should remain reusable as a generic energy SCM dashboard.
- **Architecture**: Prefer the existing variant/panel/service/API/map-layer system — avoid a parallel dashboard framework.
- **Security**: Do not send proprietary-style SCM data through public bootstrap, public docs, analytics, Sentry, screenshots, or public cache tiers.
- **Scope**: Treat private data ingestion, enterprise RBAC, audit logging, and production compliance hardening as future production phases.
- **Verification**: New variant work should include typecheck, boundary linting, variant configuration tests, and focused UI/data tests where feasible.
- **Generated contracts**: Any new RPC surface must follow the proto -> generated client/server -> handler -> gateway/cache/test flow.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use open-source/public data only for the demo | Avoids proprietary Chevron data handling and keeps the demo safe and reusable | Pending |
| Build a focused SCM variant instead of forking the dashboard | Existing variant system already scopes panels, layers, and tests | Pending |
| Reuse existing supply-chain, energy, sanctions, trade, maritime, and route explorer capabilities first | Lowest-risk path to a coherent demo | Pending |
| Keep Chevron wording as demo framing | Prevents implying access to internal Chevron data | Pending |
| Defer production RBAC, audit logging, and private ingestion | These are important but not required for demo v1 | Pending |

---
*Last updated: 2026-04-28 after initialization*
