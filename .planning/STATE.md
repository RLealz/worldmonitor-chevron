---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: Phase 8 - Add Chevron-branded demo view navigation
status: complete
last_updated: "2026-05-01T21:45:00.000Z"
progress:
  total_phases: 8
  completed_phases: 8
  total_plans: 24
  completed_plans: 24
---

# Project State: Chevron SCM Demo Dashboard

**Initialized:** 2026-04-28  
**Status:** Phase 8 complete
**Current phase:** Phase 8 - Add Chevron-branded demo view navigation

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-28)

**Core value:** An operator can open a focused SCM demo variant and quickly understand public-data risks to energy supply chains across suppliers, routes, sanctions/trade controls, and energy materials without exposing or fabricating private Chevron operational data.

## Current Focus

Phase 8 is complete. Chevron demo operators can switch between SCM, Energy, Materials/Commodities, Trade/Sanctions, Routes/Maritime, and Finance/Markets views from inside the Chevron-branded shell without seeing the old WorldMonitor variant switcher or promotional/account surfaces.

## Completed Phases

- Phase 1 - Public SCM Variant Shell completed on 2026-04-28.
- Phase 2 - Supplier Risk Signals completed on 2026-04-28.
- Phase 3 - Sanctions and Trade Exposure completed on 2026-04-28.
- Phase 4 - Route and Materials Deepening completed on 2026-04-29.
- Phase 5 - Demo Hardening and Safety Review completed on 2026-04-29.
- Phase 6 - Remove user-facing auth and Pro gating from Chevron demo product completed on 2026-04-30.
- Phase 7 - Rebrand Chevron SCM demo dashboard shell completed on 2026-05-01.
- Phase 8 - Add Chevron-branded demo view navigation completed on 2026-05-01.

## Accumulated Context

### Roadmap Evolution

- Phase 6 added: Remove user-facing auth and Pro gating from Chevron demo product
- Phase 6 planned with 3 executable plans covering shell/account UX, panel/layer/settings de-gating, and regression/browser verification.
- Phase 6 executed with SCM-only access policy, shell/account suppression, panel/layer/settings de-gating, and browser/static regression guardrails.
- Phase 7 added: Rebrand Chevron SCM demo dashboard shell
- Phase 7 planned with 3 executable plans covering variant-scoped branding/logos, metadata/settings/docs rebrand, and regression/browser smoke guardrails.
- Phase 7 executed with SCM-only branding config, local logo assets, SCM-aware shell/metadata/settings/docs updates, and static plus Playwright regression guardrails.
- Phase 8 added: Add Chevron-branded demo view navigation
- Phase 8 planned with 3 executable plans covering demo-view model/presets, shell navigation wiring, and static/browser guardrails.
- Phase 8 executed with a dedicated Chevron demo view model, in-shell desktop/mobile view navigation, SCM map-layer allowlisting, promo/author surface suppression, and static plus Playwright smoke guardrails.

## Key Decisions

- Use only public/open-source data for the demo.
- Treat Chevron-specific wording as demo/framing only.
- Build a focused `scm` or `chevron-scm` variant instead of forking the dashboard.
- Reuse existing supply-chain, Route Explorer, sanctions, trade, maritime/chokepoint, energy disruption, critical minerals, pipeline, storage, fuel shortage, commodity, and energy-market surfaces first.
- Supplier-risk records are synthetic archetypes or public-signal summaries, with every claim carrying source, timestamp, confidence, and reason.
- Sanctions/trade exposure is framed as public screening context with source/list/date provenance and no final legal determinations.
- Route and materials context is framed through public demo corridors, confidence-scored material mappings, source/freshness labels, degraded-state copy, and clear market-vs-operational signal separation.
- Defer proprietary data ingestion, enterprise RBAC, audit logging, legal evidence retention, and production hardening.

## Planning Artifacts

- `.planning/PROJECT.md`
- `.planning/config.json`
- `.planning/codebase/`
- `.planning/research/`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/chevron-scm-variant-plan.md`
- `.planning/phases/02-supplier-risk-signals/`
- `.planning/phases/03-sanctions-and-trade-exposure/`
- `.planning/phases/04-route-and-materials-deepening/`
- `.planning/phases/05-demo-hardening-and-safety-review/`
- `.planning/phases/06-remove-user-facing-auth-and-pro-gating-from-chevron-demo-product/`
- `.planning/phases/07-rebrand-chevron-scm-demo-dashboard-shell/`
- `.planning/phases/08-add-chevron-branded-demo-view-navigation/`

## Next Step

Phase 8 is verified. Next roadmap work should start with a new phase definition.

---
*State initialized: 2026-04-28*
