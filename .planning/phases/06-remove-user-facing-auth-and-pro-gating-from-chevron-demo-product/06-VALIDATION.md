---
phase: 6
slug: remove-user-facing-auth-and-pro-gating-from-chevron-demo-product
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-30
---

# Phase 6 - Validation Strategy

> Per-phase validation contract for removing user-facing auth and Pro gating from the Chevron SCM demo.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | node:test, Playwright, TypeScript |
| Config file | `package.json`, `playwright.config.ts`, `tsconfig.json` |
| Quick run command | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs` |
| Full suite command | `npm run typecheck && npm run lint:boundaries && npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs tests/scm-public-artifact-safety.test.mjs` |
| Estimated runtime | ~90 seconds without browser smoke |

## Sampling Rate

- After every task commit: run the quick node:test command.
- After every plan wave: run the full suite command.
- Before `$gsd-verify-work`: run the full suite plus SCM browser smoke.
- Max feedback latency: 120 seconds for non-browser checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | P6-01 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs` | No | pending |
| 6-01-02 | 01 | 1 | P6-02 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs` | No | pending |
| 6-01-03 | 01 | 1 | P6-05 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-public-artifact-safety.test.mjs` | No | pending |
| 6-02-01 | 02 | 1 | P6-03 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs` | No | pending |
| 6-02-02 | 02 | 1 | P6-04 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs` | No | pending |
| 6-02-03 | 02 | 1 | P6-07 | unit/static | `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs` | No | pending |
| 6-03-01 | 03 | 2 | P6-06 | unit/static | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` | Yes | pending |
| 6-03-02 | 03 | 2 | P6-01 | e2e | `npx cross-env VITE_VARIANT=scm playwright test e2e/scm-no-auth-gating.spec.ts` | No | pending |
| 6-03-03 | 03 | 2 | P6-04 | build/type | `npm run typecheck && npm run lint:boundaries` | Yes | pending |

## Wave 0 Requirements

- [ ] `tests/scm-demo-no-auth-gating.test.mjs` - static and helper-level assertions for SCM auth/Pro UX removal.
- [ ] `e2e/scm-no-auth-gating.spec.ts` - browser smoke for visible SCM demo shell.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Presentation copy review | P6-05, P6-06 | Static tests catch known phrases, but a human should verify tone and demo safety | Open SCM variant and inspect header, mobile menu, footer, settings, map toggles, default panels, and degraded states for auth/Pro/private-data implications. |

## Validation Sign-Off

- [ ] All tasks have automated verify commands or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing references.
- [ ] No watch-mode flags.
- [ ] Feedback latency under 120 seconds for non-browser checks.
- [ ] `nyquist_compliant: true` set in frontmatter.

