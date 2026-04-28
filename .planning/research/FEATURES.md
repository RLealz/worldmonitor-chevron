# Chevron SCM Demo Feature Research

Scope: public/open-source-data-only Chevron SCM demo for supplier risk, port/route disruption, sanctions/export controls, and energy materials.
Non-goal: do not imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, internal routes, facility-sensitive data, or compliance secrets.

## Executive Take

The demo should feel like an operational SCM workspace, not a generic energy news page.
The minimum viable shape is already present in the repo:

- `src/components/SupplyChainPanel.ts` for chokepoints, shipping stress, minerals, and scenario-style disruption reasoning.
- `src/components/RouteExplorer/` for lane triage, bypass corridors, land alternatives, and product-specific impact analysis.
- `src/components/SanctionsPressurePanel.ts` and `src/components/TradePolicyPanel.ts` for sanctions, restrictions, tariffs, barriers, and trade-flow context.
- `src/config/variants/energy.ts` and `src/config/panels.ts` for the variant shell and energy-focused panel/layer defaults.

## Table Stakes

These are the baseline features expected for a credible public-data SCM demo.

| Feature | Tier | Why it is table stakes | Existing surface | Complexity | Dependencies |
| --- | --- | --- | --- | --- | --- |
| Supplier risk summary | Table stake | Users need a first-pass risk view by country, commodity, chokepoint, sanctions pressure, and fresh/public evidence. | `SupplyChainPanel`, `RouteExplorer`, `SanctionsPressurePanel`, `TradePolicyPanel` | Medium | Public country/product data, chokepoint exposure, sanctions/trade feeds, evidence text, confidence labels |
| Port and route disruption | Table stake | Route interruption is the core SCM use case; without it, the demo is just a materials dashboard. | `RouteExplorer/`, `SupplyChainPanel`, energy map layers in `src/config/panels.ts` | Medium | `get-route-explorer-lane`, `get-route-impact`, corridor datasets, country-port clusters, AIS/waterways/trade routes |
| Sanctions and export-control exposure | Table stake | Compliance-adjacent users need list pressure, program context, and source/version provenance. | `SanctionsPressurePanel`, `TradePolicyPanel`, `src/config/panels.ts` | Medium | OFAC/sanctions list data, WTO/Treasury/Comtrade-style sources, source date/version fields |
| Energy materials risk | Table stake | Energy SCM needs commodities/materials, not only routes; minerals, pipelines, storage, and fuel shortages are already in the repo. | `SupplyChainPanel`, energy variant map layers, `energy` panel set | Low-Medium | Minerals, pipelines, storage, fuel shortage, energy disruption, commodity layers |
| Public-data disclaimer and empty states | Table stake | The demo must state that it is open-source-data-only and not Chevron internal truth. | `energy.ts`, panel empty states | Low | Copy updates only; no new data source required |

## Differentiators

These features make the demo feel like a real SCM workbench instead of a bundled set of panels.

| Feature | Tier | Why it differentiates | Existing surface | Complexity | Dependencies |
| --- | --- | --- | --- | --- | --- |
| Cross-panel drill path | Differentiator | Let a user move from supplier risk to route disruption to sanctions to materials without changing context. | `RouteExplorer`, `SupplyChainPanel`, `TradePolicyPanel` | Medium | Shared URL state, shared selection state, consistent IDs/country/product models |
| Route watchlists and presets | Differentiator | Pre-seeded Chevron-style corridors make the demo instantly useful and reduce setup friction. | `RouteExplorer`, `src/config/variants/energy.ts` | Medium | Static watchlist config, country-port clusters, lane presets, map highlighting |
| Alternative corridors with honest labels | Differentiator | Bypass routes are more valuable when the UI distinguishes active, proposed, and unavailable options clearly. | `RouteExplorer/tabs/AlternativesTab.ts`, `LandTab.ts`, `RouteCard.ts` | Medium | Bypass corridor dataset, status labels, map overlay hooks |
| Evidence-first risk cards | Differentiator | Every alert should show source, time, confidence, and reason so users can judge validity. | `SupplyChainPanel`, `SanctionsPressurePanel`, `TradePolicyPanel` | Low-Medium | Normalized evidence model, provenance text, freshness metadata |
| Material-to-HS mapping | Differentiator | Mapping energy materials to HS2/HS4 makes the demo actionable for trade and logistics review. | `RouteExplorer/Hs2Picker.ts`, `RouteExplorer/tabs/CountryImpactTab.ts`, `SupplyChainPanel` | Medium-High | HS taxonomy, defensible mappings, fallback behavior when confidence is low |
| Scenario/what-if disruption overlay | Differentiator | Simulated closures and projected risk make the UI feel operational, not only descriptive. | `SupplyChainPanel` scenario engine, route map highlights | Medium | Scenario templates, disruption scoring, state reset logic |
| Energy variant curation | Differentiator | A focused `energy`/`scm` variant is faster than asking users to assemble the workflow manually. | `src/config/variants/energy.ts`, `src/config/panels.ts` | Low | Variant registry, panel ordering, layer defaults |

## Anti-Features

These should not be in the public-data demo.

| Anti-feature | Why it is wrong for this demo | Replace with |
| --- | --- | --- |
| Proprietary Chevron supplier rosters | Violates the open-data constraint and implies internal access. | Demo supplier archetypes, public country/product risk, synthetic examples |
| Internal routes, shipment schedules, inventory levels, or facility secrets | High sensitivity and not verifiable from public sources. | Public chokepoints, AIS, waterways, port status, storage/pipeline maps |
| Fake certainty or unqualified risk scores | Misleads users and overclaims what public data can prove. | Source/date/confidence/reason fields on every risk card |
| Enterprise RBAC, audit retention, or production compliance workflows in v1 | Important later, but not required for the demo and adds scope noise. | Simple public demo framing plus future private-boundary planning |
| New dashboard framework or parallel UI shell | Rebuilds what the repo already has and increases integration risk. | Reuse the existing variant/panel/service/map architecture |
| Uncited sanctions or trade claims | Compliance use cases need provenance, list versioning, and source dates. | OFAC/WTO/Treasury/Comtrade references in the panel footer and cards |
| Broad proprietary data ingestion pipelines | Breaks the public-data-only constraint and complicates boundary design. | Static demo config plus public-source ingestion only |

## Complexity And Dependency Notes

- Supplier risk is the highest coordination cost because it depends on a composite of route exposure, sanctions pressure, and materials relevance rather than a single feed.
- Route disruption is the cleanest technical fit because `RouteExplorer` already has current route, alternatives, land, and impact tabs with map callbacks and URL state.
- Sanctions/export controls should stay evidence-centric; `SanctionsPressurePanel` and `TradePolicyPanel` are already close to the right framing, but they need provenance discipline more than new UI chrome.
- Energy materials are the lowest-risk expansion because `SupplyChainPanel` already exposes minerals, chokepoints, shipping stress, and scenario hooks.
- The strongest demo version is a curated `energy` variant that emphasizes `SupplyChainPanel`, `RouteExplorer`, `SanctionsPressurePanel`, `TradePolicyPanel`, `EnergyDisruptionsPanel`, and the energy map layers (`pipelines`, `waterways`, `tradeRoutes`, `ais`, `commodityPorts`, `sanctions`, `weather`, `minerals`, `outages`).
- If anything new is added, it should be a thin config or data adapter on top of the existing panels, not a new end-user workflow surface.

## Recommended Priority Order

1. Public-data supplier risk cards with evidence fields.
2. Route disruption triage with alternatives and impact tabs.
3. Sanctions/export-control exposure with source/version provenance.
4. Energy materials and chokepoint correlation in the energy variant.
5. Scenario-style what-if overlays only after the above are stable.

