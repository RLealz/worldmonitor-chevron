---
phase: 3
slug: sanctions-and-trade-exposure
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-28
---

# Phase 3 - Validation Strategy

> Per-phase validation contract for sanctions and trade exposure work.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | `node:test`, TypeScript `tsc`, repo boundary lint |
| Config file | `package.json`, `tsconfig.json` |
| Quick run command | `npx tsx --test tests/compliance-exposure.test.mjs` |
| Full suite command | `npm run typecheck && npm run lint:boundaries && npx tsx --test tests/compliance-exposure.test.mjs && npx tsx --test tests/supplier-risk-signals.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs` |
| Estimated runtime | 60-300 seconds depending on local install state |

## Sampling Rate

- After the compliance exposure model task: run `npx tsx --test tests/compliance-exposure.test.mjs`.
- After the sanctions/trade panel wiring task: run `npx tsx --test tests/compliance-exposure.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs`.
- After every wave: run `npm run typecheck && npm run lint:boundaries`.
- Before `$gsd-verify-work`: run the full suite command and an SCM build smoke when available.
- Max feedback latency target: 300 seconds for focused checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | CMP-01, CMP-02, CMP-03 | unit | `npx tsx --test tests/compliance-exposure.test.mjs` | yes after task | pending |
| 3-01-02 | 01 | 1 | CMP-01, CMP-02, CMP-04 | unit | `npx tsx --test tests/compliance-exposure.test.mjs` | yes after task | pending |
| 3-01-03 | 01 | 1 | CMP-03 | unit/static | `npx tsx --test tests/compliance-exposure.test.mjs` | yes after task | pending |
| 3-02-01 | 02 | 2 | CMP-01, CMP-02, CMP-03 | static + typecheck | `npx tsx --test tests/compliance-exposure.test.mjs` | yes | pending |
| 3-02-02 | 02 | 2 | CMP-01, CMP-02, CMP-04 | integration/static | `npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 3-02-03 | 02 | 2 | CMP-01, CMP-04 | integration/static | `npx tsx --test tests/compliance-exposure.test.mjs` | yes | pending |
| 3-03-01 | 03 | 3 | CMP-02, CMP-03 | automated | `npx tsx --test tests/compliance-exposure.test.mjs` | yes | pending |
| 3-03-02 | 03 | 3 | CMP-03 | static guardrail | `npx tsx --test tests/compliance-exposure.test.mjs && npx tsx --test tests/scm-variant-config.test.mjs` | yes | pending |
| 3-03-03 | 03 | 3 | CMP-01, CMP-02, CMP-03, CMP-04 | full verification | `npm run typecheck && npm run lint:boundaries` | yes | pending |

## Required Scenarios

| Scenario | Required signal |
|----------|-----------------|
| Sanctions-hit | Public sanctions country/program/list signal raises exposure with source/list/date evidence |
| Entity lookup | Demo-safe public entity lookup result is represented as optional screening evidence without real customer supplier matching |
| Trade-restricted | Public trade restriction/barrier/tariff signal raises exposure with source/date/reason evidence |
| Combined exposure | Sanctions and trade signals combine without claiming final legal status |
| Stale or missing provenance | Missing dates/source versions lower confidence and show fallback copy |
| Low coverage | No public match produces low/guarded context, not a clearance claim |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SCM sanctions/trade readability | CMP-01, CMP-04 | Static tests cannot prove the panels scan well together | Start SCM variant and confirm sanctions/trade context is visible, compact, and connected to supplier/country/material context |
| Compliance-adjacent tone | CMP-03 | String checks can miss subtle legal-finality tone | Review headings, notes, empty states, badges, and tooltips for public screening language and no final legal determinations |

## Validation Sign-Off

- [x] All phase requirements have automated verification or documented manual review.
- [x] Sampling continuity: no three consecutive tasks without automated verification.
- [x] Wave 0 covers required scenario references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 300s.
- [x] `nyquist_compliant: true` set in frontmatter.

Approval: approved for planning 2026-04-28.
