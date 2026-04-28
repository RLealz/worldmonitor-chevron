---
phase: 2
slug: supplier-risk-signals
status: complete
created: 2026-04-28
requirements:
  - SUP-01
  - SUP-02
  - SUP-03
  - SUP-04
---

# Phase 2 - Supplier Risk Signals Research

## Objective

Plan a public-data-only supplier-risk demo layer for the SCM variant. The phase should help an operator compare supplier archetypes using public country/product, route/chokepoint, sanctions/trade, materials, and freshness signals without adding or implying any customer-private supplier data.

## Phase Boundary

Phase 2 delivers a visible supplier-risk summary in the SCM variant plus deterministic scoring and tests. It does not ingest customer supplier master data, add private SCM endpoints, or claim that public data proves actual procurement behavior.

## Existing Seams

- `src/utils/supplier-route-risk.ts` already computes route/chokepoint risk for exporter/importer pairs and returns risk level, route ids, transit chokepoints, max disruption score, and recommendation.
- `tests/supplier-route-risk.test.mjs` already covers critical, at-risk, safe, unknown, and alternative-supplier scenarios.
- `src/services/supply-chain/index.ts` wraps existing public supply-chain RPCs and has client-side fallbacks for chokepoints, minerals, shipping, route explorer, route impact, and country products.
- `src/components/SupplyChainPanel.ts` already contains SCM-specific public-data banners, no-data copy, stale-data copy, and scenario framing.
- `src/config/panels.ts` already registers the `scm` variant and includes supply chain, trade policy, sanctions pressure, energy/materials, route/chokepoint, and commodity surfaces.
- `tests/scm-variant-config.test.mjs` already guards SCM variant registration, public-data framing, default panels/layers, empty/degraded copy, and banned private-data phrases.

## Recommended Shape

Use a thin deterministic model plus a compact panel/card surface.

The supplier-risk model should live outside UI code so it is easy to test:

- Define supplier archetypes as demo/public records, not real suppliers.
- Compose public evidence items with `source`, `timestamp`, `confidence`, and `reason`.
- Score supplier archetypes from existing route risk plus sanctions/trade/material/freshness inputs.
- Return an explicit `dataPosture` or equivalent field such as `synthetic_archetype` / `public_signal_summary`.
- Keep all labels generic energy SCM; any Chevron wording remains presentation framing outside data fixtures.

The UI should be dense and operational:

- Add a small `SupplierRiskPanel` or a supplier-risk section in the existing supply-chain surface.
- Prefer a separate panel if the SCM dashboard needs supplier risk visible without opening tabs.
- Cards should show risk level, archetype label, country/product/material context, evidence count, confidence, freshness, and top reasons.
- Empty/stale/unavailable states should say public data is missing or stale, not that private supplier data is missing.

## Data Posture

Acceptable demo records:

- Synthetic archetype names such as "Gulf feedstock archetype" or "North American equipment archetype".
- Public country ISO codes, HS2/HS4 product categories, material labels, route ids, and chokepoint ids.
- Public source names such as "WorldMonitor public chokepoint model", "UN Comtrade derived product exposure", "public sanctions pressure signal", and "critical minerals public producer data".

Not acceptable:

- Customer-private supplier names or IDs.
- Customer-private commercial, logistics, inventory, routing, site-sensitive, or price records.
- Copy implying the app knows Chevron procurement relationships.
- Compliance conclusions stated as final legal determinations.

## Validation Architecture

Phase 2 needs automated validation because the risk surface can easily drift into false precision.

- Unit tests must cover stable, sanctions-hit, route-disrupted, stale-data, and low-confidence scenarios.
- Tests must assert every claim/evidence item includes source, timestamp, confidence, and reason.
- Tests must assert demo supplier records are marked synthetic/public-signal and do not include private-data-looking fields.
- Static guardrails must scan the new supplier-risk model, fixtures, panel, and SCM config for banned proprietary phrases.
- Typecheck and boundary lint must run because the work crosses config, utility/service, component, and app registration boundaries.

## Risks

- Over-scoring public signals could make the demo look like a production supplier-risk engine. Mitigation: use transparent reason strings, confidence fields, and demo/synthetic posture labels.
- Adding a new panel without data-loader wiring could leave it invisible or static forever. Mitigation: register the panel in SCM defaults and wire static public demo archetypes first, then keep live feed integration optional.
- Pulling sanctions/trade data deeply into Phase 2 could overlap Phase 3. Mitigation: use bounded sanctions/trade signal placeholders or public pressure inputs with provenance, and leave richer compliance UX to Phase 3.
- Static tests can overfit source text. Mitigation: test stable identifiers, required fields, and banned phrases rather than exact layout markup.

## Plan Implication

Phase 2 should be split into:

1. Build the supplier-risk domain model and public demo archetype fixtures.
2. Add the SCM supplier-risk panel/cards and register them in the SCM variant.
3. Add guardrail tests and run typecheck, boundary lint, focused unit tests, and an SCM build smoke.
