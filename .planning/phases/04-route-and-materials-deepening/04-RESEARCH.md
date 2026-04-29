---
phase: 4
slug: route-and-materials-deepening
status: complete
created: 2026-04-29
requirements:
  - RTE-01
  - RTE-02
  - RTE-03
  - RTE-04
  - MAT-01
  - MAT-02
  - MAT-03
  - MAT-04
---

# Phase 4 - Route and Materials Deepening Research

## Objective

Plan the SCM route, port, disruption, material, and energy workflow deepening for the public-data-only demo. The phase should let an operator evaluate demo energy SCM corridors, chokepoints, route disruptions, and material exposure using existing WorldMonitor capabilities without implying access to internal Chevron routes, shipments, suppliers, inventories, or facility-sensitive operations.

## Phase Boundary

Phase 4 delivers public/demo route presets, route-to-country/product/material context, route freshness and degraded-state copy, and energy materials context that reuses existing supply-chain, Route Explorer, chokepoint, route impact, bypass, maritime, critical minerals, commodity, pipeline, storage, fuel shortage, and disruption surfaces.

Phase 4 does not deliver private route ingestion, customer-specific shipment tracking, internal port pairings, procurement inventory, private supplier routing, production route optimization, scenario persistence, enterprise RBAC, audit logging, or legal/compliance determinations.

## Existing Seams

- `src/components/RouteExplorer/RouteExplorer.ts` already provides the main modal workflow with origin/destination countries, HS2/product selection, cargo inference, current-route, alternatives, land-route, and country-impact tabs.
- `src/components/RouteExplorer/RouteExplorer.utils.ts` already provides country options, HS2 labels, and cargo inference. HS2 `26` and `27` are directly useful for energy minerals and fuels; machinery/electrical HS2 categories support equipment context.
- `src/components/RouteExplorer/tabs/CurrentRouteTab.ts` already renders modeled route duration, distance, mode, chokepoints, and no-route/degraded states.
- `src/components/RouteExplorer/tabs/CountryImpactTab.ts` already renders route impact, sector/product exposure, and missing-data states.
- `src/services/supply-chain/index.ts` already exposes public supply-chain calls for chokepoint status, critical minerals, shipping stress, country chokepoint index, route explorer lane, route impact, bypass options, country products, sector exposure, and cost shock signals.
- `src/utils/supplier-route-risk.ts` already maps country-pair routes to chokepoint risk and alternative supplier context using public/deterministic route definitions.
- `src/components/SupplyChainPanel.ts` already groups shipping rates, chokepoints, critical minerals, shipping stress, country chokepoint, multi-sector exposure, bypass, route impact, country products, and cost shock workflows.
- Existing energy panels provide material-adjacent public signals: `EnergyDisruptionsPanel`, `EnergyRiskOverviewPanel`, `EnergyComplexPanel`, `PipelineStatusPanel`, `StorageFacilityMapPanel`, `FuelShortagePanel`, `FuelPricesPanel`, and commodity/market panels.
- The SCM variant already defaults relevant map layers including waterways, trade routes, commodity ports, pipelines, storage facilities, fuel shortages, minerals, sanctions, weather/hazards, outages, and energy infrastructure.
- `tests/supplier-route-risk.test.mjs`, `tests/scm-variant-config.test.mjs`, route explorer tests, and supply-chain tests provide useful patterns for deterministic route and UI guardrails.

## Recommended Shape

Build a small route/material context layer before changing UI. The layer should be pure, deterministic, and tested so Route Explorer, Supply Chain, supplier risk, and energy panels can share the same public-data framing.

The model should:

- Live in `src/types/scm-route-materials.ts`, `src/config/scm-route-presets.ts`, and `src/utils/scm-route-material-context.ts`.
- Define public/demo route preset records with origin/destination ISO codes, HS2/product category, cargo type, route rationale, public source notes, confidence, freshness label, and explicit demo posture.
- Include only generic energy SCM corridor examples such as fuels/feedstocks, battery or critical-mineral inputs, industrial equipment, and chemicals. Avoid naming internal Chevron lanes, facilities, suppliers, shipment IDs, contracts, volumes, inventory, pricing, or proprietary ports.
- Map energy materials to defensible HS2/product/country context with confidence levels and fallback copy when the mapping is weak or absent.
- Compose existing chokepoint, route impact, supplier-route, critical-mineral, pipeline, storage, fuel-shortage, and disruption signals into summaries without creating a new production risk engine.
- Preserve source/freshness/degraded-state language for route, port, chokepoint, AIS, and upstream availability.

The UI should:

- Add demo route preset entry points to Route Explorer or Supply Chain in the SCM variant only.
- Label presets as public/demo corridors and never as Chevron internal routes.
- Let a user apply a preset to Route Explorer country, HS2, and cargo state, then continue using existing route lane, route impact, bypass, and country-impact tabs.
- Surface material context beside route/chokepoint disruption where it helps connect country, product, and material implications.
- Show fallback copy when material-to-HS/product mapping confidence is low, for example "Public sources do not support a precise product mapping for this material in the demo."
- Keep energy market indicators distinct from operational SCM evidence.

## Data Posture

Acceptable demo records:

- Public country codes and country names.
- Public or generic route corridors derived from public geography, chokepoints, and HS2/product categories.
- Public chokepoint names, disruption levels, and route stress signals already represented by WorldMonitor services.
- Public HS2 categories, sector/product groupings, and critical-mineral or energy material labels.
- Source notes, freshness labels, confidence values, and degraded-state explanations.
- Synthetic supplier archetype links and public signal summaries from earlier phases.

Not acceptable:

- Real Chevron supplier rosters, customer-specific routes, internal port pairs, shipment identifiers, vessel nominations, inventory, contract terms, freight rates tied to private operations, pricing, facility-sensitive details, production plans, or private compliance decisions.
- UI wording that says a route is used by Chevron, approved by Chevron, optimized for Chevron, or known from Chevron operations.
- Private route bootstrap data, proprietary material demand assumptions, or generated docs/OpenAPI examples that look like internal SCM data.

## Validation Architecture

Phase 4 needs automated validation because route presets and material mappings can easily imply false operational precision.

- Unit tests must prove route presets are public/demo framed, contain required country/product/cargo/freshness/source fields, and do not contain private-data-shaped fields.
- Unit tests must prove material-to-HS/product mappings expose confidence and fallback copy for low-confidence or missing mappings.
- Integration/static tests must prove SCM route and material surfaces remain registered in the variant, relevant route/material panels stay present, and map layers cover route/port/material signals.
- Tests must cover connecting route/chokepoint disruption to country, product, and material context.
- Tests must assert energy market copy is distinguished from operational SCM evidence.
- Typecheck and boundary lint must run because implementation touches types, config, utils, components, app data loading, and tests.
- SCM build smoke must run before phase closure to catch route explorer and panel bundling issues.

## Risks

- Demo route presets can sound like internal Chevron routes. Mitigation: centralize preset copy and add banned-word/static guardrail tests.
- Material mappings can imply false precision. Mitigation: use confidence levels, source notes, and fallback copy; avoid pretending public HS2 mappings prove private material demand.
- Route Explorer may have gated or unavailable route-impact data in some runtimes. Mitigation: keep degraded-state/fallback copy visible and reuse existing no-data states.
- Adding a new material panel could duplicate existing energy and critical-minerals panels. Mitigation: first add context to existing Route Explorer/Supply Chain surfaces and only add a new panel if reuse fails.
- Map/panel clutter can make the SCM variant harder to scan. Mitigation: keep controls compact, prioritize route presets and material context where the operator already works.

## Plan Implication

Phase 4 should be split into:

1. Build and test the public route/material context model and demo preset fixtures.
2. Wire demo route presets and material context into Route Explorer, Supply Chain, and relevant SCM energy surfaces.
3. Add guardrails, focused route/material verification, SCM build smoke, and phase closure evidence.
