# Chevron SCM Dashboard Variant Plan

**Created:** 2026-04-28  
**Status:** Feasible, ready for roadmap initialization  
**Scope:** Adapt the existing WorldMonitor dashboard into a Chevron-oriented SCM operational intelligence variant.

## Feasibility Decision

The dashboard can contemplate all requested variants:

| Variant | Feasibility | Existing foundation | Main gap |
| --- | --- | --- | --- |
| Supplier risk | Feasible with new SCM data boundary | `src/utils/supplier-route-risk.ts`, `src/components/CountryDeepDivePanel.ts`, `src/services/supply-chain/index.ts`, country/product/sector dependency RPCs | No private supplier roster, supplier qualification model, fine-grained RBAC, or audit trail yet |
| Port/route disruption | Strong fit | `src/components/RouteExplorer/`, `src/config/ports.ts`, `src/config/trade-routes.ts`, `server/worldmonitor/supply-chain/v1/get-route-explorer-lane.ts`, `server/worldmonitor/supply-chain/v1/get-route-impact.ts`, `server/worldmonitor/maritime/v1/*`, shipping v2 route intelligence | Needs Chevron lanes, critical ports, asset groups, route watchlists, and operator workflow |
| Sanctions/export controls | Feasible | `src/components/SanctionsPressurePanel.ts`, `src/components/TradePolicyPanel.ts`, `server/worldmonitor/sanctions/v1/*`, `server/worldmonitor/trade/v1/*`, generated sanctions/trade clients | Needs entity matching, list-version evidence, review/audit status, export-control-specific sources, and no public cache leakage |
| Energy materials | Strong fit | `src/config/variants/energy.ts`, `src/components/EnergyComplexPanel.ts`, `src/components/EnergyDisruptionsPanel.ts`, `src/components/EnergyRiskOverviewPanel.ts`, `server/worldmonitor/supply-chain/v1/get-critical-minerals.ts`, pipelines/storage/fuel shortage handlers | Needs Chevron-specific material taxonomy, business-unit relevance, inventory/procurement linkage, and source confidence |

Conclusion: build this as a new `chevron-scm` or `scm` variant, not as a fork of the full dashboard. Reuse existing energy, supply-chain, maritime, sanctions, and trade domains first; add private SCM ingestion only behind a separate authorization and cache boundary.

## Formal GSD Planning Status

The `$gsd-plan-phase` workflow cannot run to completion yet because this repository has a codebase map but no initialized GSD project roadmap:

- Present: `.planning/codebase/*.md`
- Missing: `.planning/ROADMAP.md`
- Missing: `.planning/STATE.md`
- Missing: `.planning/REQUIREMENTS.md`
- Missing: phase directories under `.planning/phases/`

Best next formal GSD option:

1. Run `$gsd-new-project` to create requirements, roadmap, and project state for the Chevron SCM adaptation.
2. Then run `$gsd-discuss-phase 1` to capture decisions such as data sensitivity, Chevron-specific workflows, and first users.
3. Then run `$gsd-plan-phase 1` to generate executable phase plans.

This brief is the interim planning artifact until those GSD roadmap files exist.

## Recommended Product Shape

Create a focused operational dashboard with four top-level workspaces:

1. Supplier Risk
   - Supplier exposure by country, commodity, product family, facility, chokepoint, sanctions pressure, and disruption history.
   - Risk cards should always show source, timestamp, confidence, and reason.
   - Private supplier records must not be shipped through public bootstrap keys.

2. Port and Route Disruption
   - Critical Chevron lanes, ports, waterways, tankers, chokepoints, bypass options, transit history, and live maritime warnings.
   - Start from `RouteExplorer` and `SupplyChainPanel`; avoid inventing a separate route UI.
   - Add watchlists for Chevron-critical corridors and facilities.

3. Sanctions and Export Controls
   - Entity lookup, country/program pressure, trade restrictions, and compliance evidence.
   - Every flag needs source/list/version/date evidence and an analyst review state.
   - Default to no public CDN caching for Chevron-specific compliance queries.

4. Energy Materials
   - Critical minerals, chemicals, pipes/steel, refining inputs, LNG/oil/gas logistics, storage/pipeline incidents, and commodity price sensitivity.
   - Start from the `energy` variant and supply-chain critical minerals RPCs.
   - Add Chevron material taxonomy and mapping to HS codes only where defensible.

## Implementation Waves

### Wave 1: Variant Shell and Public-Data Prototype

Goal: create a working `chevron-scm` variant using existing public OSINT data only.

Tasks:

- Add a new variant config parallel to `src/config/variants/energy.ts`.
- Register SCM-focused panel order in `src/config/panels.ts`.
- Enable SCM map layers: `pipelines`, `storageFacilities`, `fuelShortages`, `waterways`, `tradeRoutes`, `ais`, `commodityPorts`, `commodityHubs`, `minerals`, `sanctions`, `weather`, `natural`, `fires`, and `outages`.
- Reuse existing panels: `SupplyChainPanel`, `RouteExplorer`, `SanctionsPressurePanel`, `TradePolicyPanel`, `EnergyDisruptionsPanel`, `EnergyRiskOverviewPanel`, `PipelineStatusPanel`, `StorageFacilityMapPanel`, `FuelShortagePanel`, and `HormuzPanel`.
- Add empty-state copy that clearly says public OSINT prototype, not Chevron internal truth.

Verification:

- `npm run typecheck`
- `npm run lint:boundaries`
- Add or update variant tests so `VITE_VARIANT=chevron-scm` loads the intended panel/layer mix.

### Wave 2: SCM Domain Model and Data Boundary

Goal: define where Chevron/private SCM data can live without leaking into public surfaces.

Tasks:

- Define TypeScript types for supplier, facility, material, route lane, compliance flag, and risk evidence.
- Decide storage boundary: static config for demo/reference data, Redis/Convex or another private store for private SCM data.
- Add server-side authorization policy before any private endpoint.
- Add redaction rules for analytics, Sentry, logs, query strings, and error messages.
- Define cache defaults: public OSINT data can use existing cache tiers; Chevron-specific supplier/route/compliance data should default to private/no-store.

Verification:

- Add gateway tests for auth required, role denied, no public cache, no bootstrap leakage, and sanitized errors.
- Add tests to prove private SCM payloads are absent from `api/bootstrap.js` unless explicitly authorized and scoped.

### Wave 3: Supplier Risk Workspace

Goal: add the first new Chevron-specific workspace once the data boundary is ready.

Tasks:

- Create `SupplierRiskPanel` or extend an existing SCM panel if reuse stays clean.
- Compute risk from country risk, chokepoint exposure, route disruption, sanctions pressure, material criticality, and data freshness.
- Include explainability: reason codes, source evidence, confidence, and last refreshed timestamp.
- Support supplier watchlists and empty/demo states.

Verification:

- Unit tests for scoring fixtures: stable supplier, sanctions-hit supplier, port-disrupted supplier, stale-data supplier.
- Rendering tests for escaping supplier names and source text.
- E2E variant smoke test for supplier risk empty, demo, and populated states.

### Wave 4: Route, Port, and Materials Deepening

Goal: make the dashboard operationally useful for Chevron route and energy materials monitoring.

Tasks:

- Add Chevron-critical route presets to `RouteExplorer`.
- Add port/facility watchlists and a route impact summary.
- Add material taxonomy mapping to HS2/HS4 where confidence is high.
- Add operator workflows: acknowledge alert, mark under review, export evidence, open route alternative.

Verification:

- Tests for route preset serialization and URL state.
- Tests for material-to-HS mapping confidence and fallback behavior.
- Playwright coverage for route disruption triage flow.

### Wave 5: Compliance and Enterprise Readiness

Goal: harden the product for sensitive SCM use.

Tasks:

- Add audit log design for sanctions/export-control checks and supplier risk review.
- Add role model: viewer, analyst, compliance, procurement, incident lead, admin.
- Split public docs/API descriptions from private Chevron SCM API docs.
- Review desktop sidecar parity if Chevron users need the Tauri build.
- Document known limitations for SCM risk scores.

Verification:

- Security review of auth, cache, telemetry, CORS, and SSRF boundaries.
- Tests for role-based access and export-control evidence retention.
- Manual deployment checklist covering Vercel, Railway/seeders, Convex, Redis, and desktop sidecar if used.

## Key Risks

- The existing product is public OSINT oriented; private Chevron data changes the threat model.
- Supplier data, route plans, facility coordinates, contract details, and shipment schedules are operationally sensitive.
- Existing premium gating is not the same as enterprise RBAC.
- Public bootstrap hydration is useful for speed but dangerous for private SCM data.
- Sanctions/export-control findings need evidence, auditability, and list/version provenance.
- Energy material mappings can mislead users if HS codes, supplier qualification, or business-unit relevance are overclaimed.

## Best Options

Recommended path:

1. Start with a public-data `chevron-scm` prototype variant.
2. Build a private SCM data boundary before ingesting supplier rosters or proprietary route/material data.
3. Add supplier risk after auth/cache/telemetry boundaries are explicit.
4. Treat sanctions/export controls as evidence workflows, not just map overlays.

Fallback path if private data governance is not ready:

1. Keep the dashboard OSINT-only.
2. Build generic `scm` variant labels rather than Chevron-specific labels.
3. Use demo supplier records only.
4. Do not ingest or display real supplier, contract, route, or facility-sensitive data.

## Next Formal Step

Run `$gsd-new-project` with this goal:

> Adapt WorldMonitor into a Chevron SCM operational intelligence dashboard covering supplier risk, port/route disruption, sanctions/export controls, and energy materials, beginning with a public-data variant and adding a private SCM data boundary before proprietary data ingestion.

