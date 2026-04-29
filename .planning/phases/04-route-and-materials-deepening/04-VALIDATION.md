---
phase: 4
slug: route-and-materials-deepening
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-29
---

# Phase 4 - Validation Strategy

> Per-phase validation contract for route and materials deepening work.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | `node:test`, TypeScript `tsc`, repo boundary lint, Vite SCM build smoke |
| Config file | `package.json`, `tsconfig.json`, `vite.config.ts` |
| Quick run command | `npx tsx --test tests/scm-route-material-context.test.mjs` |
| Full suite command | `npm run typecheck && npm run lint:boundaries && npx tsx --test tests/scm-route-material-context.test.mjs && npx tsx --test tests/supplier-route-risk.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs && npx tsx --test tests/compliance-exposure.test.mjs` |
| SCM build smoke | `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build` |
| Estimated runtime | 60-420 seconds depending on local install state |

## Sampling Rate

- After the route/material model task: run `npx tsx --test tests/scm-route-material-context.test.mjs`.
- After Route Explorer and Supply Chain wiring: run `npx tsx --test tests/scm-route-material-context.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs`.
- After every wave: run `npm run typecheck && npm run lint:boundaries`.
- Before `$gsd-verify-work`: run the full suite command and the SCM build smoke.
- Max feedback latency target: 420 seconds for focused checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | RTE-02, MAT-02, MAT-03 | type/static | `npx tsx --test tests/scm-route-material-context.test.mjs` | yes after task | pending |
| 4-01-02 | 01 | 1 | RTE-01, RTE-02, RTE-03 | unit | `npx tsx --test tests/scm-route-material-context.test.mjs` | yes after task | pending |
| 4-01-03 | 01 | 1 | MAT-01, MAT-02, MAT-03, MAT-04 | unit/static | `npx tsx --test tests/scm-route-material-context.test.mjs` | yes after task | pending |
| 4-02-01 | 02 | 2 | RTE-01, RTE-02, RTE-04 | integration/static | `npx tsx --test tests/scm-route-material-context.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 4-02-02 | 02 | 2 | RTE-03, MAT-02, MAT-03 | integration/static | `npx tsx --test tests/scm-route-material-context.test.mjs` | yes | pending |
| 4-02-03 | 02 | 2 | MAT-01, MAT-04 | integration/static | `npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 4-03-01 | 03 | 3 | RTE-02, MAT-03, MAT-04 | static guardrail | `npx tsx --test tests/scm-route-material-context.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 4-03-02 | 03 | 3 | RTE-01, RTE-04, MAT-01 | build/typecheck | `npm run typecheck && npm run lint:boundaries` | yes | pending |
| 4-03-03 | 03 | 3 | RTE-01, RTE-02, RTE-03, RTE-04, MAT-01, MAT-02, MAT-03, MAT-04 | full verification | full suite + SCM build smoke | yes | pending |

## Required Scenarios

| Scenario | Required signal |
|----------|-----------------|
| Demo corridor preset | Preset has origin/destination, HS2/product, cargo, source note, freshness, confidence, and explicit public/demo posture |
| Route disruption context | Chokepoint or route stress connects to country, product, and material context without private route claims |
| Low-confidence material mapping | Material mapping emits fallback copy instead of precise HS/product claims |
| Missing route upstream | Route Explorer/Supply Chain degraded state says public upstream unavailable or no modeled public route, not absence of operational risk |
| Energy market distinction | Commodity/energy market signals are labeled as market context, not operational SCM evidence |
| Private-data guardrail | Route/material fixtures and UI copy do not include proprietary-looking supplier, shipment, route, inventory, pricing, contract, or facility-sensitive fields |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Route Explorer preset ergonomics | RTE-01, RTE-02 | Static tests cannot prove the preset flow is easy to scan | Start SCM variant, open Route Explorer, apply each demo preset, and confirm origin/destination/HS/cargo state changes are clear and demo-framed |
| Materials context readability | MAT-01, MAT-04 | String checks cannot prove market vs SCM evidence hierarchy is visually obvious | Review SCM route/material sections and confirm market indicators are visually secondary to operational public signals |

## Validation Sign-Off

- [x] All phase requirements have automated verification or documented manual review.
- [x] Sampling continuity: no three consecutive tasks without automated verification.
- [x] Wave 0 covers required scenario references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 420s.
- [x] `nyquist_compliant: true` set in frontmatter.

Approval: approved for planning 2026-04-29.
