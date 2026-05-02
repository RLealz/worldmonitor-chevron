# Requirements: Chevron SCM Demo Dashboard

**Defined:** 2026-04-28  
**Core Value:** An operator can open a focused SCM demo variant and quickly understand public-data risks to energy supply chains across suppliers, routes, sanctions/trade controls, and energy materials without exposing or fabricating private Chevron operational data.

## v1 Requirements

### Variant

- [x] **VAR-01**: User can run a focused SCM demo variant via `VITE_VARIANT` and the app resolves it as a supported variant.
- [x] **VAR-02**: User sees an SCM-focused default panel order using existing public-data panels for supply chain, route disruption, sanctions/trade, energy disruptions, materials, pipelines, storage, fuel shortages, and commodities.
- [x] **VAR-03**: User sees SCM-focused default map layers for waterways, trade routes, AIS/tanker context where available, commodity ports, pipelines, storage, fuel shortages, minerals, sanctions, weather/natural hazards, fires, outages, and energy infrastructure.
- [x] **VAR-04**: User can distinguish the SCM demo variant from the existing full, energy, commodity, finance, tech, and happy variants without losing access to existing variant navigation patterns.

### Framing

- [x] **FRM-01**: User sees clear demo framing that the SCM dashboard uses public/open-source data only.
- [x] **FRM-02**: User is not shown copy that implies access to proprietary Chevron suppliers, contracts, shipments, inventory, internal routes, pricing, facility-sensitive details, or operational secrets.
- [x] **FRM-03**: User sees empty/degraded states that distinguish missing public data, stale data, unavailable upstreams, and demo-only assumptions.
- [x] **FRM-04**: User-facing SCM labels remain reusable for a generic energy SCM dashboard, with Chevron wording limited to demo framing.

### Supplier Risk

- [x] **SUP-01**: User can view a public-data supplier risk summary derived from country/product exposure, route/chokepoint exposure, sanctions pressure, trade restrictions, materials relevance, and data freshness.
- [x] **SUP-02**: User can see source, timestamp, confidence, and reason fields for supplier-risk claims.
- [x] **SUP-03**: User can understand when supplier risk is inferred from public signals rather than observed from proprietary supplier data.
- [x] **SUP-04**: User can use demo/synthetic supplier archetypes without any real Chevron supplier roster.

### Routes

- [x] **RTE-01**: User can evaluate port and route disruption using existing Route Explorer, chokepoint, route impact, bypass, maritime, and map-layer capabilities.
- [x] **RTE-02**: User can view public/demo route presets or corridor groupings relevant to energy SCM without implying Chevron internal routes.
- [x] **RTE-03**: User can move from a route/chokepoint disruption signal to relevant country, product, and material impact context.
- [x] **RTE-04**: User can see clear freshness/degraded-state indicators for route, port, chokepoint, AIS, and upstream availability data.

### Compliance

- [x] **CMP-01**: User can view sanctions and export-control exposure using public sanctions pressure, entity lookup, trade restrictions, tariffs, barriers, and trade-flow context.
- [x] **CMP-02**: User can see source/list/version/date provenance for sanctions and trade-control claims where available.
- [x] **CMP-03**: User is not shown compliance conclusions as final legal determinations; the UI frames them as public-data screening signals.
- [x] **CMP-04**: User can connect sanctions/trade exposure to supplier, route, country, and material context.

### Materials

- [x] **MAT-01**: User can view energy materials risk using critical minerals, commodities, pipelines, storage facilities, fuel shortages, energy disruptions, and energy-market panels.
- [x] **MAT-02**: User can see material-to-country/product/route signals where mappings are defensible from public data.
- [x] **MAT-03**: User sees fallback copy when material-to-HS/product mapping confidence is low or absent.
- [x] **MAT-04**: User can distinguish energy market signals from operational SCM evidence.

### Verification

- [x] **VER-01**: Developer can run typecheck successfully after the SCM variant work.
- [x] **VER-02**: Developer can run boundary/import lint checks for touched source layers.
- [x] **VER-03**: Tests or guardrails prove the SCM variant panel list and map layer defaults are registered correctly.
- [x] **VER-04**: Tests or review checks prove no proprietary-looking Chevron SCM data is added to public bootstrap, public docs, analytics, screenshots, or generated OpenAPI as part of the demo.
- [x] **VER-05**: At least one browser or E2E smoke path proves the SCM variant loads without blanking the dashboard.

## Phase 6 Requirements

### Demo De-Gating

- [x] **P6-01**: User can open and use the SCM demo without seeing login, signup, account, profile, user database, or user menu UX.
- [x] **P6-02**: User is not shown Pro, subscription, pricing, checkout, billing, upsell, upgrade, locked-feature, or unlock-feature UX in the SCM demo shell.
- [x] **P6-03**: User can use SCM default panels, map layers, settings, and demo workflows without a user account or visible product gating.
- [x] **P6-04**: Technical/server-side auth, API keys, Redis credentials, upstream public-data credentials, CORS/API protection, rate limits, and backend-only authorization guardrails remain intact.
- [x] **P6-05**: Public/open-source-data-only disclaimers and Chevron demo safety language remain visible where they currently protect the demo.
- [x] **P6-06**: User-facing copy still avoids implying proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.
- [x] **P6-07**: Removing product-gating surfaces does not break data loading, public API seeding, SCM variant registration, map defaults, or operational panels.

### Phase 7: Chevron SCM Demo Rebrand

- [x] **P7-01**: SCM-visible dashboard naming presents the product as `Chevron SCM Demo Dashboard` or approved equivalent, not as WorldMonitor-oriented product branding.
- [x] **P7-02**: SCM header/shell renders both the approved demo logo and the Chevron logo using accessible image text and stable responsive sizing.
- [x] **P7-03**: SCM browser-visible metadata, page title, application name, loading/skeleton states, and favicon/brand references use Chevron SCM demo framing.
- [x] **P7-04**: SCM settings shell, mobile menu, footer, and shell navigation remove visible WorldMonitor promotional surfaces, GitHub star badges/promotional links, author credit, and personal attribution.
- [x] **P7-05**: SCM docs/demo references that are presented as part of the demo experience use Chevron SCM demo framing while preserving technical/API docs where WorldMonitor names are implementation identifiers.
- [x] **P7-06**: Public/open-source-data-only disclaimers and Chevron demo safety language remain visible where relevant after the rebrand.
- [x] **P7-07**: Non-SCM variants keep their existing branding, links, title behavior, and author/GitHub surfaces unless a shared component must become variant-aware.
- [x] **P7-08**: Automated tests or browser smoke checks prove SCM-visible old naming, promo, attribution, GitHub star, and author surfaces are absent and both logos render.

### Phase 8: Chevron-Branded Demo View Navigation

- [x] **P8-01**: Chevron demo users can navigate between selected demo views from inside the standalone Chevron product shell.
- [x] **P8-02**: The demo view navigation uses Chevron demo labels and copy, not the old WorldMonitor variant-switching experience.
- [x] **P8-03**: Selected views cover SCM, Energy, Materials/Commodities, Trade/Sanctions, Routes/Maritime, and Finance/Markets where existing variants, panels, services, APIs, map layers, and layout state support them.
- [x] **P8-04**: Chevron demo views do not show WorldMonitor branding, GitHub stars, author credit, personal attribution, WorldMonitor promo links, or Pro/upgrade/account UX.
- [x] **P8-05**: Non-Chevron/non-SCM variants keep their existing branding, links, title behavior, account/promo behavior, and variant navigation unless a shared component must become variant-aware.
- [x] **P8-06**: Public/open-source-data-only disclaimers and Chevron demo safety language remain visible where relevant in every Chevron demo view.
- [x] **P8-07**: User-facing copy avoids implying Chevron endorsement or access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.
- [x] **P8-08**: Static and/or Playwright smoke tests prove Chevron demo users can access selected views and that each visible shell remains Chevron-branded without WorldMonitor/GitHub/author/product-promo surfaces.

## v2 Requirements

### Workflow

- **WRK-01**: User can drill from a supplier-risk card to route, sanctions, and materials panels while preserving context.
- **WRK-02**: User can save or toggle public/demo corridor watchlists.
- **WRK-03**: User can run scenario-style what-if disruption overlays once the base demo is stable.

### Production Readiness

- **PRD-01**: System supports private SCM ingestion behind explicit auth, cache, telemetry, and data-governance boundaries.
- **PRD-02**: System supports enterprise RBAC for roles such as viewer, analyst, procurement, compliance, incident lead, and admin.
- **PRD-03**: System supports audit logging and evidence retention for sanctions/export-control workflows.
- **PRD-04**: System supports private deployment hardening across Vercel, Railway/seeders, Convex, Redis, Sentry, analytics, and desktop sidecar if needed.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real Chevron supplier rosters | Demo uses public/open-source data only |
| Internal Chevron routes, shipments, inventory, contracts, pricing, or facility-sensitive data | Operationally sensitive and outside demo scope |
| Production legal compliance determinations | Demo can surface public screening signals, not legal advice or final compliance decisions |
| Enterprise RBAC and audit retention in v1 | Important future production work, but not required for the public-data demo |
| New dashboard framework | Existing WorldMonitor variant/panel architecture is sufficient |
| Hand-editing generated client/server files | Generated code must come from proto flow |
| Public cache/bootstrap of proprietary-looking SCM data | Violates demo data posture and future safety boundary |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VAR-01 | Phase 1 | Complete |
| VAR-02 | Phase 1 | Complete |
| VAR-03 | Phase 1 | Complete |
| VAR-04 | Phase 1 | Complete |
| FRM-01 | Phase 1 | Complete |
| FRM-02 | Phase 1 | Complete |
| FRM-03 | Phase 1 | Complete |
| FRM-04 | Phase 1 | Complete |
| VER-01 | Phase 1 | Complete |
| VER-02 | Phase 1 | Complete |
| VER-03 | Phase 1 | Complete |
| VER-05 | Phase 1 | Complete |
| SUP-01 | Phase 2 | Complete |
| SUP-02 | Phase 2 | Complete |
| SUP-03 | Phase 2 | Complete |
| SUP-04 | Phase 2 | Complete |
| CMP-01 | Phase 3 | Complete |
| CMP-02 | Phase 3 | Complete |
| CMP-03 | Phase 3 | Complete |
| CMP-04 | Phase 3 | Complete |
| RTE-01 | Phase 4 | Complete |
| RTE-02 | Phase 4 | Complete |
| RTE-03 | Phase 4 | Complete |
| RTE-04 | Phase 4 | Complete |
| MAT-01 | Phase 4 | Complete |
| MAT-02 | Phase 4 | Complete |
| MAT-03 | Phase 4 | Complete |
| MAT-04 | Phase 4 | Complete |
| VER-04 | Phase 5 | Complete |
| P6-01 | Phase 6 | Complete |
| P6-02 | Phase 6 | Complete |
| P6-03 | Phase 6 | Complete |
| P6-04 | Phase 6 | Complete |
| P6-05 | Phase 6 | Complete |
| P6-06 | Phase 6 | Complete |
| P6-07 | Phase 6 | Complete |
| P7-01 | Phase 7 | Complete |
| P7-02 | Phase 7 | Complete |
| P7-03 | Phase 7 | Complete |
| P7-04 | Phase 7 | Complete |
| P7-05 | Phase 7 | Complete |
| P7-06 | Phase 7 | Complete |
| P7-07 | Phase 7 | Complete |
| P7-08 | Phase 7 | Complete |
| P8-01 | Phase 8 | Complete |
| P8-02 | Phase 8 | Complete |
| P8-03 | Phase 8 | Complete |
| P8-04 | Phase 8 | Complete |
| P8-05 | Phase 8 | Complete |
| P8-06 | Phase 8 | Complete |
| P8-07 | Phase 8 | Complete |
| P8-08 | Phase 8 | Complete |

**Coverage:**
- v1 requirements: 29 total
- Phase 6 requirements: 7 total
- Phase 7 requirements: 8 total
- Phase 8 requirements: 8 total
- Mapped to phases: 52
- Unmapped: 0

---
*Requirements defined: 2026-04-28*  
*Last updated: 2026-05-01 for Phase 8 execution*
