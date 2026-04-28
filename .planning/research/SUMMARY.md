# Chevron SCM Demo Research Summary

**Synthesized:** 2026-04-28  
**Project:** Open-source-data-only Chevron SCM demo dashboard built on WorldMonitor  
**Source files:** `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`

## Key Finding

The demo should be built as a focused `scm` or `chevron-scm` variant over the existing WorldMonitor stack. The repo already has the right foundations: energy variant configuration, supply-chain RPCs, Route Explorer, sanctions/trade services, maritime/chokepoint data, critical minerals, pipelines, storage, fuel shortages, and energy disruption panels.

The most important product constraint is data posture: this is a public/open-source-data demo. It must not imply access to proprietary Chevron suppliers, contracts, shipments, inventory, internal routes, pricing, facility-sensitive details, or operational secrets.

## Stack Direction

Use the existing stack:

- TypeScript + Vite + Preact SPA.
- Existing variant system in `src/config/variants/*`, `src/config/panels.ts`, and `src/config/variant.ts`.
- Existing class-based `Panel` component system.
- Existing client service wrappers under `src/services/*`.
- Existing Edge/API + server handler + proto-generated client/server flow.
- Existing Redis/bootstrap pattern for public first-paint OSINT data.
- Existing tests around variant config, route/cache policy, Edge boundaries, supply-chain handlers, and E2E variants.

Do not introduce a new frontend framework, new dashboard shell, or new data stack for v1.

## Table Stakes

For the demo to feel credible, v1 should include:

- A curated SCM variant shell with focused panel order and map layers.
- Supplier risk summary using public country/product, chokepoint, route, sanctions, trade, and materials signals.
- Port and route disruption workflow using Route Explorer, chokepoints, waterways, route impact, alternatives, and map overlays.
- Sanctions/export-control exposure using existing sanctions and trade policy surfaces with source/date/list provenance.
- Energy materials risk using critical minerals, pipelines, storage, fuel shortages, energy disruptions, commodity/energy market panels, and energy map layers.
- Explicit public-data/demo framing and empty states.
- Provenance fields on risk claims: source, timestamp, confidence, and reason.

## Differentiators

Differentiators to consider after the shell is stable:

- Cross-panel drill paths from supplier risk to route disruption, sanctions, and materials context.
- Pre-seeded public/demo route watchlists and corridor presets.
- Evidence-first risk cards with reason codes and confidence labels.
- Material-to-HS mapping where confidence is defensible.
- Scenario/what-if overlays based on existing supply-chain scenario hooks.

## Anti-Features

Exclude from the demo:

- Proprietary Chevron supplier rosters.
- Internal routes, shipment schedules, inventory levels, contracts, pricing, or facility secrets.
- Fake certainty or risk scores that lack public evidence.
- Production enterprise RBAC, audit retention, legal hold, or corporate compliance workflows.
- Public bootstrap or public docs that contain private-looking SCM data.
- Any claim that public data proves actual Chevron procurement, supplier qualification, or operational routing.

## Architecture Guidance

Build order should be:

1. Variant shell and panel/layer curation.
2. Public-data demo framing, empty states, and provenance conventions.
3. Supplier risk demo workspace or cards from existing public signals.
4. Route/port/material deepening using Route Explorer and supply-chain services.
5. Compliance/export-control evidence hardening as a later phase.

Keep boundaries clear:

- `src/config/panels.ts` owns variant panel order and map layers.
- `src/app/panel-layout.ts` instantiates panels and variant navigation.
- `src/app/data-loader.ts` orchestrates fetches and panel updates.
- `src/services/supply-chain/index.ts` remains the public supply-chain service wrapper.
- `server/worldmonitor/supply-chain/v1/handler.ts` and proto files remain the RPC contract path.
- Bootstrap should only carry public OSINT data that materially improves first paint.

## Watchouts

The highest risks are:

- Copy implying proprietary Chevron operational truth.
- Public bootstrap/cache/doc/screenshot leakage of private-looking SCM data.
- Risk cards without source, timestamp, confidence, or list/version provenance.
- Presenting public trade/AIS/sanctions data as proof of Chevron-specific procurement or routing.
- Variant work that loads panels but lacks tests for layer mix, empty states, and route/cache boundaries.

## Roadmap Implication

Phase 1 should be executable and low risk: create the public-data SCM variant shell using existing panels, map layers, copy, and tests. New data modeling should wait until the shell proves the existing public surfaces can support the demo workflow.

