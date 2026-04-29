---
phase: 5
slug: demo-hardening-and-safety-review
status: complete
created: 2026-04-29
requirements:
  - VER-04
---

# Phase 5 - Demo Hardening and Safety Review Research

## Objective

Plan the final public-data SCM demo hardening pass. The phase should prove the runnable demo and public artifacts do not contain proprietary-looking Chevron supplier, route, shipment, inventory, pricing, contract, facility-sensitive, or legal-compliance payloads, then document public-source limitations and future production boundaries.

## Phase Boundary

Phase 5 delivers guardrails, review artifacts, demo documentation, and final verification evidence. It does not add new SCM domains, private data ingestion, enterprise RBAC, audit retention, production sanctions workflow, or proprietary deployment hardening.

## Existing Seams

- `tests/scm-variant-config.test.mjs` already scans SCM config and touched UI copy for private-data wording.
- `tests/scm-route-material-context.test.mjs`, `tests/supplier-risk-signals.test.mjs`, and `tests/compliance-exposure.test.mjs` already guard the major SCM model layers.
- `tests/bootstrap.test.mjs`, `tests/edge-functions.test.mjs`, `tests/route-cache-tier.test.mjs`, `tests/panel-config-guardrails.test.mjs`, and `tests/variant-layer-guardrail.test.mjs` provide patterns for artifact and config checks.
- `api/bootstrap.js`, `docs/api/worldmonitor.openapi.yaml`, `public/openapi.yaml`, `docs/`, `blog-site/`, `src/config/`, `src/components/`, `src/services/`, and `.planning/` are the main surfaces to review for private-looking SCM data.
- Phase 4 build smoke already emits non-blocking Vite dynamic/static import and chunk-size warnings; Phase 5 should record them, not treat known warnings as failure.
- `.planning/codebase/CONCERNS.md` lists review areas: bootstrap/cache, generated OpenAPI, analytics/Sentry, screenshots/public docs, error messages, API routes, cache policy, and future production boundaries.

## Recommended Shape

Add a focused public-data safety guardrail first, then write a demo limitation document, then close with final verification.

The guardrail should:

- Scan SCM-specific source, config, docs, public artifacts, bootstrap keys, generated OpenAPI, and planning docs for banned proprietary-looking field names and phrases.
- Allow explicit out-of-scope warnings that mention prohibited concepts, but reject positive claims that the app has or uses internal Chevron operational data.
- Check that public demo data fixtures use postures such as `synthetic_archetype`, `public_signal_summary`, or `public_demo_corridor`.
- Check that generated/public artifacts do not expose private-looking example fields such as supplier rosters, shipment IDs, vessel nominations, contract pricing, inventory levels, facility-sensitive coordinates, internal routes, restricted-party case files, or legal compliance conclusions.
- Keep the scanner lightweight and deterministic, with repo-relative allowlist entries for legitimate out-of-scope language.

The documentation should:

- Explain that the SCM demo uses only public/open-source data and synthetic/public archetypes.
- Summarize public sources by domain: supply chain/chokepoints, sanctions/trade, supplier archetypes, route/material context, energy disruptions/materials, markets, pipelines/storage/fuel shortages.
- Explain freshness, confidence, degraded states, and fallback copy.
- State that market indicators are context, not direct operational SCM evidence.
- Explicitly defer private ingestion, enterprise RBAC, audit logging, compliance evidence retention, legal determinations, data residency, and production deployment hardening.

The final verification should:

- Run focused SCM guardrail tests, all SCM model/config tests, typecheck, boundary lint, and SCM build smoke.
- Run a browser or Playwright smoke for `VITE_VARIANT=scm` if feasible in the local environment.
- Record known warnings and residual risks in Phase 5 verification docs.
- Mark VER-04 complete only after the artifact scan and final verification evidence exists.

## Data Posture

Acceptable:

- Public sources, public country/product/material/chokepoint labels, synthetic archetypes, public demo corridors, source notes, confidence, freshness, degraded-state copy, and out-of-scope warnings.
- Documentation that says proprietary Chevron supplier rosters, routes, shipments, inventory, pricing, contracts, facility-sensitive data, legal determinations, enterprise RBAC, and audit retention are not included.

Not acceptable:

- Any fixture, public artifact, generated OpenAPI example, screenshot, bootstrap/cache key, analytics label, or docs page that appears to expose real Chevron private SCM data.
- Any UI copy that says the demo knows Chevron internal routes, supplier rosters, contracts, shipments, inventory, or facility-sensitive operations.
- Any final legal compliance conclusion such as cleared, prohibited, violation, compliant, or sanctioned party determination.

## Validation Architecture

Phase 5 needs validation across code and artifacts because the risk is not one component bug; it is public leakage or misleading demo framing.

- Static guardrail tests must scan source/config/docs/public/generated/planning surfaces for private-data-shaped fields and unsafe claims.
- Existing SCM model tests must remain in the verification suite so Phase 5 does not regress supplier, compliance, route, or material guardrails.
- Bootstrap/OpenAPI/doc safety checks must be automated where practical.
- Typecheck and boundary lint must run because final hardening can touch tests, docs, config, and build scripts.
- SCM build smoke must run after public artifact generation.
- A browser/E2E smoke should confirm the SCM variant loads and exposes demo framing without a blank dashboard.

## Risks

- A scanner that bans every private-data phrase can block legitimate out-of-scope docs. Mitigation: scan with context and allow explicit negative/out-of-scope references.
- Public/generated artifacts can change during build. Mitigation: generate `public/openapi.yaml` before artifact scanning.
- Browser smoke can be flaky in local desktop environments. Mitigation: run it if feasible and document any environment blocker honestly.
- The demo can be safe without being production-ready. Mitigation: final docs must separate demo readiness from production private-SCM readiness.

## Plan Implication

Phase 5 should be split into:

1. Add broad public-artifact and private-data guardrails.
2. Add demo limitations/source documentation and presentation-safe copy checks.
3. Run final verification, record evidence, and close the milestone.
