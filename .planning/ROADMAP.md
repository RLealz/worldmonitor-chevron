# Roadmap: Chevron SCM Demo Dashboard

**Created:** 2026-04-28  
**Granularity:** Coarse  
**Project:** Open-source-data-only Chevron SCM demo dashboard

## Overview

The roadmap builds a safe public-data SCM demo in five phases. Phase 1 creates the focused variant shell and proves the existing dashboard can load as an SCM workspace. Later phases deepen supplier risk, compliance, route/material workflows, and final demo guardrails without introducing proprietary Chevron data.

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Public SCM Variant Shell | Create a runnable SCM demo variant using existing panels, map layers, and public-data framing | VAR-01, VAR-02, VAR-03, VAR-04, FRM-01, FRM-02, FRM-03, FRM-04, VER-01, VER-02, VER-03, VER-05 | 5 |
| 2 | Supplier Risk Signals | Add public-data supplier-risk demo cards/archetypes with evidence and confidence | SUP-01, SUP-02, SUP-03, SUP-04 | 4 |
| 3 | Sanctions and Trade Exposure | Make sanctions/export-control exposure evidence-first and connected to SCM context | CMP-01, CMP-02, CMP-03, CMP-04 | 4 |
| 4 | Route and Materials Deepening | Improve route, port, disruption, material, and energy SCM workflows with public-data constraints | RTE-01, RTE-02, RTE-03, RTE-04, MAT-01, MAT-02, MAT-03, MAT-04 | 5 |
| 5 | Demo Hardening and Safety Review | Verify no proprietary-looking data leakage and harden the demo for presentation | VER-04 | 5 |

## Phase 1: Public SCM Variant Shell

**Goal:** Create a runnable SCM demo variant using existing panels, map layers, and public-data framing.

**Requirements:** VAR-01, VAR-02, VAR-03, VAR-04, FRM-01, FRM-02, FRM-03, FRM-04, VER-01, VER-02, VER-03, VER-05

**Success criteria:**

1. `VITE_VARIANT=chevron-scm` or `VITE_VARIANT=scm` resolves as a supported variant without falling back to `full`.
2. The variant default panel order emphasizes existing supply-chain, Route Explorer, sanctions/trade, energy disruption, materials, pipelines/storage/fuel shortage, commodity, and energy market surfaces.
3. The variant default map layers emphasize SCM-relevant public layers and avoid unrelated geopolitical clutter.
4. User-facing framing clearly says the demo uses public/open-source data only and does not expose proprietary Chevron data.
5. Typecheck, boundary/import checks, variant guardrails, and a browser/E2E smoke path validate the shell.

**Implementation notes:**

- Start from `src/config/variants/energy.ts` and `ENERGY_PANELS` in `src/config/panels.ts`.
- Update `src/config/variant.ts`, `src/config/variant-meta.ts`, `vite.config.ts`, and any variant navigation in `src/app/panel-layout.ts` as needed.
- Prefer labels like "Energy SCM Demo" or "SCM Demo" over copy that implies real Chevron operational access.

## Phase 2: Supplier Risk Signals

**Goal:** Add public-data supplier-risk demo cards/archetypes with evidence and confidence.

**Requirements:** SUP-01, SUP-02, SUP-03, SUP-04

**Success criteria:**

1. User can view supplier-risk demo cards based on public country/product, route, chokepoint, sanctions, trade, and material signals.
2. Each risk claim shows source, timestamp, confidence, and reason.
3. The UI clearly marks supplier records as demo/synthetic archetypes or public-signal summaries, not real Chevron suppliers.
4. Tests cover at least stable, sanctions-hit, route-disrupted, stale-data, and low-confidence scenarios.

**Implementation notes:**

- Prefer a thin panel/card layer over new RPCs until public signal composition proves useful.
- Consider reusing `src/utils/supplier-route-risk.ts` and existing `src/services/supply-chain/index.ts` methods.

## Phase 3: Sanctions and Trade Exposure

**Goal:** Make sanctions/export-control exposure evidence-first and connected to SCM context.

**Requirements:** CMP-01, CMP-02, CMP-03, CMP-04

**Success criteria:**

1. User can view sanctions pressure and trade-control signals from public sources.
2. Sanctions/trade claims show source/list/date/version provenance where available.
3. The UI frames results as public screening signals, not final legal determinations.
4. Sanctions/trade exposure can be related to supplier, country, route, and material context.

**Implementation notes:**

- Reuse `SanctionsPressurePanel`, `TradePolicyPanel`, `server/worldmonitor/sanctions/v1/`, and `server/worldmonitor/trade/v1/`.
- Avoid legal/compliance finality language.

## Phase 4: Route and Materials Deepening

**Goal:** Improve route, port, disruption, material, and energy SCM workflows with public-data constraints.

**Requirements:** RTE-01, RTE-02, RTE-03, RTE-04, MAT-01, MAT-02, MAT-03, MAT-04

**Success criteria:**

1. User can evaluate route and port disruption using Route Explorer, chokepoints, route impact, bypass, maritime, and map-layer capabilities.
2. User can use public/demo route presets without implying internal Chevron routes.
3. User can connect route/chokepoint disruption to country, product, and material context.
4. User can view energy materials signals from critical minerals, commodities, pipelines, storage, fuel shortages, and disruptions.
5. Low-confidence material-to-product mappings show fallback copy rather than false precision.

**Implementation notes:**

- Reuse `src/components/RouteExplorer/`, `SupplyChainPanel`, energy map layers, and existing supply-chain RPCs.
- Keep route presets static/demo unless backed by public evidence.

## Phase 5: Demo Hardening and Safety Review

**Goal:** Verify no proprietary-looking data leakage and harden the demo for presentation.

**Requirements:** VER-04

**Success criteria:**

1. Review confirms no proprietary-looking Chevron supplier, route, shipment, inventory, pricing, contract, or facility-sensitive data is added.
2. Review confirms public bootstrap, public docs, generated OpenAPI, analytics, screenshots, and error messages do not carry private-looking SCM payloads.
3. Tests or guardrails cover variant registration, map layers, public-data framing, empty/degraded states, and cache/bootstrap safety.
4. Demo documentation explains public sources, limitations, source freshness, and what is out of scope.
5. The roadmap explicitly leaves private ingestion, enterprise RBAC, audit logging, and production compliance hardening for future production phases.

**Implementation notes:**

- Use `.planning/codebase/CONCERNS.md` as the review checklist.
- Add docs only after checking they do not imply internal Chevron access.

## Requirement Coverage

All 29 v1 requirements in `.planning/REQUIREMENTS.md` are mapped to exactly one phase.

---
*Roadmap created: 2026-04-28*
