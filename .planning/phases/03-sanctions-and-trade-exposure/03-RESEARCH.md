---
phase: 3
slug: sanctions-and-trade-exposure
status: complete
created: 2026-04-28
requirements:
  - CMP-01
  - CMP-02
  - CMP-03
  - CMP-04
---

# Phase 3 - Sanctions and Trade Exposure Research

## Objective

Plan an evidence-first sanctions/export-control and trade-control exposure layer for the SCM demo. The phase should help an operator see public screening signals that may affect supplier, country, route, and material context without presenting final legal conclusions or implying access to private Chevron compliance systems.

## Phase Boundary

Phase 3 delivers public-data screening context for sanctions pressure, public trade restrictions, barriers, tariffs, and trade-flow signals in the SCM variant. It connects those public signals to existing supplier archetypes and energy SCM context. It does not deliver production sanctions screening, restricted-party matching, legal advice, audit retention, enterprise RBAC, private supplier ingestion, or proprietary shipment/contract evidence.

## Existing Seams

- `src/components/SanctionsPressurePanel.ts` already renders OFAC-derived sanctions pressure by country, recent designations, programs, source, update time, and dataset date.
- `src/services/sanctions-pressure.ts` maps generated sanctions RPC responses into typed browser data and keeps a latest result cache.
- `server/worldmonitor/sanctions/v1/` contains public sanctions handlers for sanctions pressure and entity lookup; Phase 3 should either expose entity lookup as optional public screening evidence or explicitly defer UI lookup while keeping model/test coverage.
- `src/components/TradePolicyPanel.ts` already renders restrictions, tariffs, trade flows, barriers, customs revenue, and Comtrade strategic flows, with upstream-unavailable states.
- `src/services/trade/index.ts` exposes trade restrictions, tariffs, flows, barriers, revenue, and Comtrade calls.
- `server/worldmonitor/trade/v1/` contains public trade handlers and shared mapping helpers.
- `src/utils/supplier-risk-signals.ts` already accepts sanctions/trade country sets and adds screening evidence to supplier-risk summaries.
- `src/config/supplier-risk-archetypes.ts` already provides synthetic/public supplier archetypes that can be used as SCM context for compliance exposure.
- `tests/scm-variant-config.test.mjs` and `tests/supplier-risk-signals.test.mjs` already provide demo-safety and SCM registration guardrails.

## Recommended Shape

Use a small deterministic compliance exposure model that composes existing public sanctions and trade outputs, then enrich existing panels with SCM-specific context.

The model should:

- Live in `src/types/` and `src/utils/` so it can be tested without UI dependencies.
- Accept public sanctions pressure, trade restrictions/barriers/flows, and supplier archetypes as inputs.
- Accept optional public sanctions entity lookup results as evidence for demo search inputs, without treating them as private supplier screening.
- Produce public screening summaries by country/material/product/supplier archetype.
- Preserve provenance for every claim: source or source list, dataset date or fetched time, version/date where available, confidence, and reason.
- Use wording such as "public screening signal", "exposure context", and "requires analyst/legal review" rather than "compliant", "blocked", "cleared", or "violation".
- Treat missing source dates and unavailable upstreams as low-confidence public coverage gaps, not as negative evidence.

The UI should:

- Reuse `SanctionsPressurePanel` and `TradePolicyPanel` rather than replacing them.
- Add SCM-only context banners or compact sections when `SITE_VARIANT === 'scm'`.
- Show sanctions/trade context that links public country/product/material/supplier archetypes without naming real suppliers.
- Surface source/list/date/version provenance where available, with graceful "not provided by public source" fallback copy.
- Keep legal finality out of headings, badges, empty states, and tooltips.

## Data Posture

Acceptable demo records:

- Public country codes and country names from sanctions pressure and trade feeds.
- Public source names such as OFAC, WTO, USTR/Treasury where already represented by services, and UN Comtrade where available.
- Synthetic supplier archetype labels and public HS/material dimensions from Phase 2.
- Public signal timestamps, dataset dates, observation periods, source URLs, and upstream-unavailable indicators.

Not acceptable:

- Real private supplier rosters, customer-specific restricted-party results, private due-diligence notes, contract terms, shipments, internal routes, inventory, pricing, site-sensitive details, or compliance case records.
- UI language that says an entity or transaction is legally cleared, legally prohibited, or finally export-controlled.
- New private ingestion paths, private audit retention, or production screening workflow claims.

## Validation Architecture

Phase 3 needs automated validation because compliance-adjacent copy can drift into legal finality and provenance can disappear during UI wiring.

- Unit tests must cover sanctions-hit, trade-restricted, combined exposure, stale/missing provenance, and low-coverage scenarios.
- Tests must assert every exposure claim has source, timestamp/date or explicit fallback, confidence, and reason.
- Tests must assert outputs are framed as public screening signals, not legal determinations.
- Static guardrails must scan new compliance exposure files, sanctions/trade panels, SCM config, and related tests for banned legal-finality and private-data phrases.
- SCM variant tests must assert sanctions/trade panels remain registered and labeled as public screening/trade-control surfaces.
- Typecheck and boundary lint must run because implementation crosses types, utils, config, components, and app data loading.

## Risks

- Compliance wording can accidentally sound like legal advice. Mitigation: centralize labels/reasons in the model and add tests for banned finality phrases.
- Provenance fields differ across sanctions and trade sources. Mitigation: normalize provenance with explicit fallbacks and confidence penalties.
- Adding a separate compliance panel could duplicate existing sanctions/trade panels. Mitigation: first enhance existing panels with SCM context; add a new panel only if relation context cannot fit.
- Trade Policy is partially gated or unavailable in some runtimes. Mitigation: show source availability and upstream-unavailable states without implying absence of risk.

## Plan Implication

Phase 3 should be split into:

1. Build a public compliance exposure model with provenance and no legal-finality language.
2. Add SCM context to existing sanctions and trade panels and wire public exposure summaries from the data loader.
3. Add guardrails and verification for provenance, public-data posture, legal-finality wording, and SCM registration.
