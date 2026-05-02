# Chevron SCM Demo Safety Notes

Chevron SCM Demo Dashboard is a public-data supply chain operational intelligence demo built on the existing dashboard architecture. The Chevron framing used in planning and demos is contextual only: the implementation is reusable as a generic energy SCM dashboard and does not imply access to Chevron-private systems.

## Public Data Posture

The Chevron SCM demo uses only open-source or public-facing signals already available through dashboard surfaces, generated public API specs, public market context, and synthetic/demo fixtures. Fixture records must use one of these approved postures:

- `synthetic_archetype`
- `public_signal_summary`
- `public_demo_corridor`

## Source Categories

The demo can combine public signals from supplier-risk archetypes, sanctions and export-control screening context, trade-policy feeds, public maritime and chokepoint layers, public energy disruption feeds, public critical minerals context, public storage and pipeline layers, fuel shortage context, and commodity or energy market indicators.

## Confidence And Freshness

Panels should distinguish an upstream failure, a stale public reading, and an empty public result. Missing data must not be backfilled with guessed private SCM state. Market prices are context signals; they are not operational proof of inventory, procurement decisions, shipment timing, or supplier performance.

## Out Of Scope

The demo must not ingest, model, display, or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventories, facility-sensitive details, internal routes, customer routes, contract pricing, restricted-party case files, or final compliance determinations.

The demo must not state that Chevron uses, owns, operates, relies on, or routes through a specific supplier, port, vessel, corridor, facility, or material flow unless that claim is independently public and deliberately sourced in a future production-quality workflow.

## Future Production Work

A production deployment would need real customer data governance, enterprise RBAC, audit logging, source provenance controls, legal/compliance review, private connector design, retention policies, and hardened operational security. Those concerns remain outside this public-data demo.

## Guardrail

Run the safety scanner before publishing SCM demo changes:

```bash
npm run build:openapi
node scripts/scm-public-artifact-safety.mjs
```
