# Project State: Chevron SCM Demo Dashboard

**Initialized:** 2026-04-28  
**Status:** Ready for Phase 1 planning  
**Current phase:** Phase 1 - Public SCM Variant Shell

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-28)

**Core value:** An operator can open a focused SCM demo variant and quickly understand public-data risks to energy supply chains across suppliers, routes, sanctions/trade controls, and energy materials without exposing or fabricating private Chevron operational data.

## Current Focus

Create a runnable public-data SCM demo variant using existing WorldMonitor panels, services, APIs, map layers, and copy patterns. Phase 1 should prove the dashboard can load as a focused SCM workspace before adding deeper supplier-risk or compliance workflows.

## Key Decisions

- Use only public/open-source data for the demo.
- Treat Chevron-specific wording as demo/framing only.
- Build a focused `scm` or `chevron-scm` variant instead of forking the dashboard.
- Reuse existing supply-chain, Route Explorer, sanctions, trade, maritime/chokepoint, energy disruption, critical minerals, pipeline, storage, fuel shortage, commodity, and energy-market surfaces first.
- Defer proprietary data ingestion, enterprise RBAC, audit logging, legal evidence retention, and production hardening.

## Planning Artifacts

- `.planning/PROJECT.md`
- `.planning/config.json`
- `.planning/codebase/`
- `.planning/research/`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/chevron-scm-variant-plan.md`

## Next Step

Run `$gsd-plan-phase 1` to create executable Phase 1 plans.

---
*State initialized: 2026-04-28*
