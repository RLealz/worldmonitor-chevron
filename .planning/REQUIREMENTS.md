# Requirements: Chevron SCM Demo Dashboard

**Defined:** 2026-04-28  
**Core Value:** An operator can open a focused SCM demo variant and quickly understand public-data risks to energy supply chains across suppliers, routes, sanctions/trade controls, and energy materials without exposing or fabricating private Chevron operational data.

## v1 Requirements

### Variant

- [ ] **VAR-01**: User can run a focused SCM demo variant via `VITE_VARIANT` and the app resolves it as a supported variant.
- [ ] **VAR-02**: User sees an SCM-focused default panel order using existing public-data panels for supply chain, route disruption, sanctions/trade, energy disruptions, materials, pipelines, storage, fuel shortages, and commodities.
- [ ] **VAR-03**: User sees SCM-focused default map layers for waterways, trade routes, AIS/tanker context where available, commodity ports, pipelines, storage, fuel shortages, minerals, sanctions, weather/natural hazards, fires, outages, and energy infrastructure.
- [ ] **VAR-04**: User can distinguish the SCM demo variant from the existing full, energy, commodity, finance, tech, and happy variants without losing access to existing variant navigation patterns.

### Framing

- [ ] **FRM-01**: User sees clear demo framing that the SCM dashboard uses public/open-source data only.
- [ ] **FRM-02**: User is not shown copy that implies access to proprietary Chevron suppliers, contracts, shipments, inventory, internal routes, pricing, facility-sensitive details, or operational secrets.
- [ ] **FRM-03**: User sees empty/degraded states that distinguish missing public data, stale data, unavailable upstreams, and demo-only assumptions.
- [ ] **FRM-04**: User-facing SCM labels remain reusable for a generic energy SCM dashboard, with Chevron wording limited to demo framing.

### Supplier Risk

- [ ] **SUP-01**: User can view a public-data supplier risk summary derived from country/product exposure, route/chokepoint exposure, sanctions pressure, trade restrictions, materials relevance, and data freshness.
- [ ] **SUP-02**: User can see source, timestamp, confidence, and reason fields for supplier-risk claims.
- [ ] **SUP-03**: User can understand when supplier risk is inferred from public signals rather than observed from proprietary supplier data.
- [ ] **SUP-04**: User can use demo/synthetic supplier archetypes without any real Chevron supplier roster.

### Routes

- [ ] **RTE-01**: User can evaluate port and route disruption using existing Route Explorer, chokepoint, route impact, bypass, maritime, and map-layer capabilities.
- [ ] **RTE-02**: User can view public/demo route presets or corridor groupings relevant to energy SCM without implying Chevron internal routes.
- [ ] **RTE-03**: User can move from a route/chokepoint disruption signal to relevant country, product, and material impact context.
- [ ] **RTE-04**: User can see clear freshness/degraded-state indicators for route, port, chokepoint, AIS, and upstream availability data.

### Compliance

- [ ] **CMP-01**: User can view sanctions and export-control exposure using public sanctions pressure, entity lookup, trade restrictions, tariffs, barriers, and trade-flow context.
- [ ] **CMP-02**: User can see source/list/version/date provenance for sanctions and trade-control claims where available.
- [ ] **CMP-03**: User is not shown compliance conclusions as final legal determinations; the UI frames them as public-data screening signals.
- [ ] **CMP-04**: User can connect sanctions/trade exposure to supplier, route, country, and material context.

### Materials

- [ ] **MAT-01**: User can view energy materials risk using critical minerals, commodities, pipelines, storage facilities, fuel shortages, energy disruptions, and energy-market panels.
- [ ] **MAT-02**: User can see material-to-country/product/route signals where mappings are defensible from public data.
- [ ] **MAT-03**: User sees fallback copy when material-to-HS/product mapping confidence is low or absent.
- [ ] **MAT-04**: User can distinguish energy market signals from operational SCM evidence.

### Verification

- [ ] **VER-01**: Developer can run typecheck successfully after the SCM variant work.
- [ ] **VER-02**: Developer can run boundary/import lint checks for touched source layers.
- [ ] **VER-03**: Tests or guardrails prove the SCM variant panel list and map layer defaults are registered correctly.
- [ ] **VER-04**: Tests or review checks prove no proprietary-looking Chevron SCM data is added to public bootstrap, public docs, analytics, screenshots, or generated OpenAPI as part of the demo.
- [ ] **VER-05**: At least one browser or E2E smoke path proves the SCM variant loads without blanking the dashboard.

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
| CMP-01 | Phase 3 | Pending |
| CMP-02 | Phase 3 | Pending |
| CMP-03 | Phase 3 | Pending |
| CMP-04 | Phase 3 | Pending |
| RTE-01 | Phase 4 | Pending |
| RTE-02 | Phase 4 | Pending |
| RTE-03 | Phase 4 | Pending |
| RTE-04 | Phase 4 | Pending |
| MAT-01 | Phase 4 | Pending |
| MAT-02 | Phase 4 | Pending |
| MAT-03 | Phase 4 | Pending |
| MAT-04 | Phase 4 | Pending |
| VER-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0

---
*Requirements defined: 2026-04-28*  
*Last updated: 2026-04-28 after initial definition*
