---
phase: 1
slug: public-scm-variant-shell
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-28
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test`, TypeScript `tsc`, repo lint scripts, Playwright optional smoke |
| **Config file** | `package.json`, `tsconfig.json`, `playwright.config.ts` |
| **Quick run command** | `npm run test:data -- tests/scm-variant-config.test.mjs` |
| **Full suite command** | `npm run typecheck && npm run lint:boundaries && npm run test:data -- tests/scm-variant-config.test.mjs` |
| **Estimated runtime** | ~60-180 seconds depending on install state |

## Sampling Rate

- **After every task commit:** Run `npm run test:data -- tests/scm-variant-config.test.mjs` once the test exists.
- **After every plan wave:** Run `npm run typecheck && npm run lint:boundaries && npm run test:data -- tests/scm-variant-config.test.mjs`.
- **Before `$gsd-verify-work`:** Full suite must be green; browser/E2E smoke must be run or explicitly documented as unavailable.
- **Max feedback latency:** 180 seconds for static checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | VAR-01 | static + typecheck | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes after task | pending |
| 1-01-02 | 01 | 1 | VAR-04, FRM-01, FRM-02, FRM-04 | static + typecheck | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes after task | pending |
| 1-02-01 | 02 | 1 | VAR-02, VAR-03 | static | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes after task | pending |
| 1-02-02 | 02 | 1 | FRM-03 | static + review | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes after task | pending |
| 1-02-03 | 02 | 1 | FRM-03 | static + review | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes after task | pending |
| 1-03-01 | 03 | 2 | VER-03 | automated | `npm run test:data -- tests/scm-variant-config.test.mjs` | yes | pending |
| 1-03-02 | 03 | 2 | VER-01, VER-02 | automated | `npm run typecheck && npm run lint:boundaries` | yes | pending |
| 1-03-03 | 03 | 2 | VER-05 | automated or manual | `cross-env VITE_VARIANT=scm playwright test e2e/runtime-fetch.spec.ts` | optional | pending |

## Wave 0 Requirements

Existing infrastructure covers the phase requirements. The focused SCM variant test is created as part of Plan 03 and becomes the quick command afterward.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual quality of SCM variant shell | VER-05 | Existing automated smoke may not prove the panel mix looks coherent | Start dev server with `VITE_VARIANT=scm`, open the app, confirm no blank shell and SCM panels/layers are visible |
| Public-data copy tone | FRM-01, FRM-02, FRM-04 | Static tests can catch strings but not tone | Review visible labels/banner/metadata and confirm wording says demo/public data without implying Chevron internal access |
| Empty/degraded-state semantics | FRM-03 | Static tests can assert strings exist, but the operator meaning needs review | Trigger or inspect empty/degraded SCM states and confirm they distinguish missing public data, stale data, upstream unavailable data, and demo-only assumptions |

## Validation Sign-Off

- [x] All tasks have automated verify or documented manual smoke.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 180s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-04-28
