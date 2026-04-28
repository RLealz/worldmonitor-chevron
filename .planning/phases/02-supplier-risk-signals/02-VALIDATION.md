---
phase: 2
slug: supplier-risk-signals
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-28
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for supplier-risk signal work.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | `node:test`, TypeScript `tsc`, repo boundary lint |
| Config file | `package.json`, `tsconfig.json` |
| Quick run command | `npx tsx --test tests/supplier-risk-signals.test.mjs` |
| Full suite command | `npm run typecheck && npm run lint:boundaries && npx tsx --test tests/supplier-risk-signals.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs` |
| Estimated runtime | 60-240 seconds depending on local install state |

## Sampling Rate

- After the supplier-risk model/fixture task: run `npx tsx --test tests/supplier-risk-signals.test.mjs`.
- After the panel registration task: run `npx tsx --test tests/supplier-risk-signals.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs`.
- After every wave: run `npm run typecheck && npm run lint:boundaries`.
- Before `$gsd-verify-work`: run the full suite command and an SCM build or browser smoke when available.
- Max feedback latency target: 240 seconds for focused checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | SUP-01, SUP-02, SUP-03, SUP-04 | unit | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes after task | pending |
| 2-01-02 | 01 | 1 | SUP-01, SUP-02 | unit | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes after task | pending |
| 2-01-03 | 01 | 1 | SUP-03, SUP-04 | unit/static | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes after task | pending |
| 2-02-01 | 02 | 1 | SUP-01, SUP-03, SUP-04 | static + typecheck | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes | pending |
| 2-02-02 | 02 | 1 | SUP-02, SUP-03 | static + typecheck | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes | pending |
| 2-02-03 | 02 | 1 | SUP-01 | integration/static | `npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 2-03-01 | 03 | 2 | SUP-01, SUP-02 | automated | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes | pending |
| 2-03-02 | 03 | 2 | SUP-03, SUP-04 | static guardrail | `npx tsx --test tests/supplier-risk-signals.test.mjs` | yes | pending |
| 2-03-03 | 03 | 2 | SUP-01, SUP-02, SUP-03, SUP-04 | full verification | `npm run typecheck && npm run lint:boundaries` | yes | pending |

## Required Scenarios

| Scenario | Required signal |
|----------|-----------------|
| Stable | Low route disruption, no sanctions/trade flags, fresh data, high confidence |
| Sanctions-hit | Public sanctions/trade signal raises risk with source/timestamp/reason |
| Route-disrupted | High chokepoint disruption raises risk using `computeSupplierRouteRisk()` |
| Stale-data | Freshness penalty lowers confidence and shows stale public-data reason |
| Low-confidence | Missing/weak public inputs produce low confidence without false certainty |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Card readability in SCM dashboard | SUP-01, SUP-03 | Static tests cannot prove the panel scans well | Start SCM variant and confirm supplier cards are visible, dense, and clearly demo/synthetic |
| Public-data tone | SUP-03, SUP-04 | Tone can pass string checks while still sounding private | Review panel copy for public/open-source/demo wording and no proprietary Chevron implication |

## Validation Sign-Off

- [x] All phase requirements have automated verification or documented manual review.
- [x] Sampling continuity: no three consecutive tasks without automated verification.
- [x] Wave 0 covers required scenario references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 240s.
- [x] `nyquist_compliant: true` set in frontmatter.

Approval: approved for planning 2026-04-28.
