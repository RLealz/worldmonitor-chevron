---
phase: 5
slug: demo-hardening-and-safety-review
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-29
---

# Phase 5 - Validation Strategy

> Per-phase validation contract for final SCM demo hardening and safety review.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | `node:test`, TypeScript `tsc`, repo boundary lint, Vite SCM build smoke, optional Playwright/browser smoke |
| Config file | `package.json`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts` if used |
| Quick run command | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` |
| Full suite command | `npx tsx --test tests/scm-public-artifact-safety.test.mjs tests/scm-variant-config.test.mjs tests/supplier-risk-signals.test.mjs tests/compliance-exposure.test.mjs tests/scm-route-material-context.test.mjs && npm run typecheck && npm run lint:boundaries` |
| SCM build smoke | `$env:VITE_VARIANT='scm'; npm run build:openapi; npm run build:agent-skills; npx tsc; npx vite build` |
| Estimated runtime | 120-600 seconds depending on browser smoke and local install state |

## Sampling Rate

- After artifact guardrail test creation: run `npx tsx --test tests/scm-public-artifact-safety.test.mjs`.
- After documentation changes: rerun artifact guardrail plus SCM config guardrails.
- Before closure: run the full suite command, SCM build smoke, and browser/E2E smoke if feasible.
- Max feedback latency target: 600 seconds for the final verification batch.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | VER-04 | static inventory | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` | yes after task | pending |
| 5-01-02 | 01 | 1 | VER-04 | static guardrail | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` | yes after task | pending |
| 5-01-03 | 01 | 1 | VER-04 | artifact guardrail | `npm run build:openapi && npx tsx --test tests/scm-public-artifact-safety.test.mjs` | yes | pending |
| 5-02-01 | 02 | 2 | VER-04 | documentation review | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` | yes | pending |
| 5-02-02 | 02 | 2 | VER-04 | copy/static review | `npx tsx --test tests/scm-variant-config.test.mjs tests/scm-public-artifact-safety.test.mjs` | yes | pending |
| 5-02-03 | 02 | 2 | VER-04 | docs/build check | `npm run typecheck && npm run lint:boundaries` | yes | pending |
| 5-03-01 | 03 | 3 | VER-04 | full automated verification | full suite command | yes | pending |
| 5-03-02 | 03 | 3 | VER-04 | build/browser smoke | SCM build smoke plus browser/E2E smoke if feasible | yes | pending |
| 5-03-03 | 03 | 3 | VER-04 | closure docs | manual traceability review | yes | pending |

## Required Scenarios

| Scenario | Required signal |
|----------|-----------------|
| Private fixture scan | Public artifacts contain no positive private Chevron supplier/route/shipment/inventory/pricing/contract/facility-sensitive payloads |
| Bootstrap/cache safety | Bootstrap keys and seed/public payload references do not expose proprietary-looking SCM data |
| OpenAPI/generated safety | Generated/public API artifacts do not publish private-looking SCM schemas or examples |
| Documentation safety | Demo docs explain public data, source limitations, freshness, fallback behavior, and out-of-scope production features |
| Compliance wording | Public screening surfaces avoid legal-finality conclusions |
| Demo load smoke | SCM variant loads without blanking and shows public/demo framing |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Presentation tone | VER-04 | Static tests cannot catch every implication in headings and docs | Review SCM-facing docs and first-screen labels for demo-safe, public-data-only framing |
| Browser visual sanity | VER-04 | Automated smoke may not evaluate layout polish | Start SCM variant and confirm route/material/supplier/compliance surfaces are visible, not overlapping, and not presenting production claims |

## Validation Sign-Off

- [x] VER-04 has automated and manual review coverage.
- [x] Sampling continuity: no three consecutive tasks without automated verification.
- [x] Wave 0 covers artifact, docs, bootstrap/cache, OpenAPI, and browser smoke scenarios.
- [x] No watch-mode flags.
- [x] Feedback latency target < 600s.
- [x] `nyquist_compliant: true` set in frontmatter.

Approval: approved for planning 2026-04-29.
