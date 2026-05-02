# Roadmap: Chevron SCM Demo Dashboard

**Created:** 2026-04-28  
**Granularity:** Coarse  
**Project:** Open-source-data-only Chevron SCM demo dashboard

## Overview

The roadmap built a safe public-data SCM demo in seven completed phases. Phase 6 removed user-facing account and product-gating UX so the fork behaves as a standalone Chevron SCM demo product while preserving backend-only protections and public-data safety framing. Phase 7 finished the visible product-shell rebrand so the SCM demo presents as a Chevron-focused demo experience instead of a WorldMonitor fork.

## Progress

- [x] Phase 1 - Public SCM Variant Shell completed on 2026-04-28.
- [x] Phase 2 - Supplier Risk Signals completed on 2026-04-28.
- [x] Phase 3 - Sanctions and Trade Exposure completed on 2026-04-28.
- [x] Phase 4 - Route and Materials Deepening completed on 2026-04-29.
- [x] Phase 5 - Demo Hardening and Safety Review completed on 2026-04-29.
- [x] Phase 6 - Remove user-facing auth and Pro gating from Chevron demo product completed on 2026-04-30.
- [x] Phase 7 - Rebrand Chevron SCM demo dashboard shell completed on 2026-05-01.
- [x] Phase 8 - Add Chevron-branded demo view navigation completed on 2026-05-01.

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Public SCM Variant Shell | Create a runnable SCM demo variant using existing panels, map layers, and public-data framing | VAR-01, VAR-02, VAR-03, VAR-04, FRM-01, FRM-02, FRM-03, FRM-04, VER-01, VER-02, VER-03, VER-05 | 5 |
| 2 | Supplier Risk Signals | Add public-data supplier-risk demo cards/archetypes with evidence and confidence | SUP-01, SUP-02, SUP-03, SUP-04 | 4 |
| 3 | Sanctions and Trade Exposure | Make sanctions/export-control exposure evidence-first and connected to SCM context | CMP-01, CMP-02, CMP-03, CMP-04 | 4 |
| 4 | Route and Materials Deepening | Improve route, port, disruption, material, and energy SCM workflows with public-data constraints | RTE-01, RTE-02, RTE-03, RTE-04, MAT-01, MAT-02, MAT-03, MAT-04 | 5 |
| 5 | Demo Hardening and Safety Review | Verify no proprietary-looking data leakage and harden the demo for presentation | VER-04 | 5 |
| 6 | Remove user-facing auth and Pro gating from Chevron demo product | Make the Chevron SCM demo usable without a user account and without visible Pro, subscription, pricing, account, or locked-feature UX | P6-01, P6-02, P6-03, P6-04, P6-05, P6-06, P6-07 | 7 |
| 7 | Rebrand Chevron SCM demo dashboard shell | Rebrand the SCM demo shell as a standalone Chevron SCM Demo Dashboard while preserving public-data-only and demo-safety framing | P7-01, P7-02, P7-03, P7-04, P7-05, P7-06, P7-07, P7-08 | 8 |
| 8 | Add Chevron-branded demo view navigation | Restore relevant demo views inside the Chevron product shell as Chevron-branded demo views rather than WorldMonitor variants | P8-01, P8-02, P8-03, P8-04, P8-05, P8-06, P8-07, P8-08 | 6 |

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

**Completed:** 2026-04-28

**Delivered:**

- Public supplier-risk model, synthetic archetypes, and evidence-first scoring.
- SCM `supplier-risk` panel registered by default and refreshed from public chokepoint scores.
- Tests for stable, sanctions-hit, route-disrupted, stale-data, and low-confidence scenarios.

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

**Completed:** 2026-04-28

**Delivered:**

- Public compliance exposure model with evidence, provenance, confidence, and demo-safe entity lookup support.
- SCM sanctions and trade panels enriched with public screening context tied to supplier archetype, country, product, material, and trade-flow signals.
- Guardrails for legal-finality wording, private-data-shaped SCM language, SCM panel registration, and provenance preservation.

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

**Completed:** 2026-04-29

**Delivered:**

- Public/demo route and material context model with route presets, material mapping confidence, source/freshness fields, degraded-state copy, and market-vs-operational framing.
- SCM-only Route Explorer public demo corridor presets that apply country, HS2, and cargo state without implying internal Chevron routes.
- Supply Chain route/material summaries connected to public chokepoint scores, countries, products, materials, and fallback copy.
- Energy overview wording that distinguishes market context from public operational SCM signals.
- Guardrails and verification for route presets, material fallback behavior, SCM registration, typecheck, boundary lint, and SCM build smoke.

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

**Completed:** 2026-04-29

**Delivered:**

- Public artifact safety scanner and node:test guardrails covering SCM source, docs, planning artifacts, public bootstrap, generated OpenAPI, and public OpenAPI output.
- SCM demo safety documentation and README framing for public-data-only limits, source categories, degraded states, out-of-scope private data, and future production work.
- Final verification across SCM regression tests, typecheck, boundary lint, generated artifacts, SCM production build, and browser smoke.

## Requirement Coverage

All 29 v1 requirements in `.planning/REQUIREMENTS.md` are mapped to exactly one phase.

### Phase 6: Remove user-facing auth and Pro gating from Chevron demo product

**Goal:** Make this WorldMonitor-Chevron fork behave as a standalone Chevron SCM demo product with no user-facing login, signup, Pro, subscription, pricing, account, or locked-feature UX.
**Requirements**: P6-01, P6-02, P6-03, P6-04, P6-05, P6-06, P6-07
**Depends on:** Phase 5
**Plans:** 3 plans

**Planning constraints:**

1. Apply across the Chevron demo product experience, not only one panel.
2. Remove or suppress visible login/sign up prompts, account menus, user profile UI, user DB language, subscription/pricing copy, Pro announcements, upsell banners, locked-feature notices, and blocked-feature states.
3. Keep technical/server-side auth and secrets required for the product to work, including API keys, Redis credentials, upstream public-data credentials, CORS/API protection, and backend-only authorization guardrails.
4. Keep the dashboard usable without a user account.
5. Preserve public/open-source-data-only disclaimers and Chevron demo safety language.
6. Do not introduce or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.
7. Prefer deleting or hiding only product-gating/user-account surfaces; do not break data loading, public API seeding, or operational panels.

Plans:
- [x] 06-01 - Suppress Account And Commerce UX In The SCM Shell
- [x] 06-02 - Ungate SCM Panels, Layers, And Settings UX
- [x] 06-03 - Add SCM No-Gating Guardrails And Browser Smoke

**Completed:** 2026-04-30

**Delivered:**

- SCM-only demo access policy that suppresses user-account and commerce UX without changing backend/server protections.
- Standalone SCM dashboard shell with no visible login, signup, account, profile, Pro, pricing, subscription, checkout, billing, upgrade, locked-feature, or unlock-feature surfaces.
- SCM panel, map, settings, add-panel, export/playback, and free-tier paths usable without a user account.
- Static and browser guardrails covering SCM no-gating behavior while preserving public-data-only and Chevron demo safety framing.

### Phase 7: Rebrand Chevron SCM demo dashboard shell

**Goal:** Rebrand the SCM/Chevron demo product shell as a standalone Chevron SCM Demo Dashboard by updating visible naming, browser-visible metadata, loading states, settings/menu surfaces, footer/mobile shell references, and docs/demo references while removing WorldMonitor/GitHub/author promotional surfaces from the SCM demo UI.
**Requirements**: P7-01, P7-02, P7-03, P7-04, P7-05, P7-06, P7-07, P7-08
**Depends on:** Phase 6
**Plans:** 3 plans

**Planning constraints:**

- Keep Chevron-specific wording demo/framing-only and avoid implying Chevron endorsement beyond approved demo context.
- Preserve public/open-source-data-only disclaimers and the existing Chevron demo safety language.
- Do not introduce or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.
- Keep non-SCM variants' existing branding unless a shared component must be made variant-aware.
- Prefer variant-scoped branding helpers/config over scattered hardcoded checks.
- Add the approved demo logo and the Chevron logo to the SCM demo header/shell where appropriate.

**Success criteria:**

1. SCM-visible dashboard naming no longer presents WorldMonitor-oriented product naming.
2. Header/shell renders the approved demo logo and Chevron logo in the SCM demo experience.
3. SCM page title, metadata, loading states, settings shell, footer/mobile menu, and docs/demo references use Chevron SCM demo framing.
4. Visible GitHub stars, promotional GitHub links/badges, author credit, and personal attribution surfaces are removed from the SCM demo UI.
5. Public/open-source-data-only disclaimers and demo safety language remain visible where relevant.
6. Copy does not imply Chevron endorsement or private/proprietary SCM data access.
7. Non-SCM variants keep their existing branding behavior.
8. Tests or browser smoke checks prove old promo/attribution/name surfaces are absent and both logos render.

Plans:
- [x] 07-01 - Add Variant-Scoped Chevron SCM Brand System
- [x] 07-02 - Rebrand Metadata Settings Loading And Demo Docs
- [x] 07-03 - Add Branding Regression And Browser Smoke Guardrails

### Phase 8: Add Chevron-branded demo view navigation

**Goal:** Restore access to the dashboard's useful demo views from within the Chevron product shell, presenting them as Chevron-branded demo views rather than WorldMonitor variants.
**Requirements**: P8-01, P8-02, P8-03, P8-04, P8-05, P8-06, P8-07, P8-08
**Depends on:** Phase 7
**Plans:** 3 plans

**Planning constraints:**

- Add a Chevron-branded view switcher/navigation in the standalone Chevron SCM demo shell.
- Include relevant views such as SCM, Energy, Materials/Commodities, Trade/Sanctions, Routes/Maritime, and Finance/Markets if supported by existing variants/panels.
- Do not show WorldMonitor branding, GitHub stars, author credit, personal attribution, Pro/upgrade/account UX, or WorldMonitor promo links in Chevron demo views.
- Keep non-Chevron/non-SCM variants' existing branding behavior.
- Prefer reusing existing variants, panels, services, APIs, map layers, and layout state before creating new variants.
- If existing variants are reused, wrap their navigation labels and shell branding in Chevron demo copy.
- Preserve public/open-source-data-only disclaimers and Chevron demo safety language.
- Do not imply Chevron endorsement beyond demo framing.
- Do not introduce or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.

**Success criteria:**

1. A Chevron demo operator can navigate among selected demo views from inside the Chevron product shell.
2. Selected demo views remain visibly Chevron-branded and do not expose the old WorldMonitor variant-switching experience.
3. WorldMonitor branding, GitHub stars, author credit, personal attribution, Pro/upgrade/account UX, and WorldMonitor promo links are absent from Chevron demo views.
4. Non-Chevron/non-SCM variants keep their existing branding behavior.
5. Public/open-source-data-only disclaimers and Chevron demo safety language remain visible where relevant.
6. Static and/or Playwright smoke tests prove Chevron demo users can access the selected views and that the shell remains Chevron-branded.

Plans:
- [ ] 08-01 - Define Chevron Demo View Model And Presets
- [ ] 08-02 - Wire Chevron Demo View Navigation Into The Shell
- [ ] 08-03 - Add Chevron Demo View Guardrails And Browser Smoke

---
*Roadmap created: 2026-04-28*
