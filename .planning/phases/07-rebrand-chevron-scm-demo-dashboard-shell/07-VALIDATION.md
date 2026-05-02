---
phase: 7
slug: rebrand-chevron-scm-demo-dashboard-shell
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-01
---

# Phase 7 - Validation Strategy

> Per-phase validation contract for rebranding the Chevron SCM demo shell.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | node:test, Playwright, TypeScript |
| Config file | `package.json`, `playwright.config.ts`, `tsconfig.json` |
| Quick run command | `npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-demo-no-auth-gating.test.mjs` |
| Full suite command | `npm run typecheck && npm run lint:boundaries && npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-demo-no-auth-gating.test.mjs tests/scm-public-artifact-safety.test.mjs tests/scm-variant-config.test.mjs` |
| Estimated runtime | ~120 seconds without browser smoke |

## Sampling Rate

- After every task commit: run the quick node:test command.
- After every plan wave: run the full suite command.
- Before `$gsd-verify-work`: run the full suite plus SCM branding browser smoke.
- Max feedback latency: 120 seconds for non-browser checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | P7-01 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs` | No | pending |
| 7-01-02 | 01 | 1 | P7-02 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs` | No | pending |
| 7-01-03 | 01 | 1 | P7-04 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-demo-no-auth-gating.test.mjs` | No | pending |
| 7-02-01 | 02 | 1 | P7-03 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs` | No | pending |
| 7-02-02 | 02 | 1 | P7-04 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs` | No | pending |
| 7-02-03 | 02 | 1 | P7-05 | unit/static | `npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-public-artifact-safety.test.mjs` | No | pending |
| 7-03-01 | 03 | 2 | P7-08 | unit/e2e | `npx tsx --test tests/scm-demo-branding.test.mjs && npx cross-env VITE_VARIANT=scm playwright test e2e/scm-demo-branding.spec.ts` | No | pending |
| 7-03-02 | 03 | 2 | P7-06 | unit/static | `npx tsx --test tests/scm-public-artifact-safety.test.mjs` | Yes | pending |
| 7-03-03 | 03 | 2 | P7-07 | build/unit | `npm run typecheck && npx tsx --test tests/scm-demo-branding.test.mjs tests/scm-variant-config.test.mjs` | No | pending |

## Wave 0 Requirements

- [ ] `tests/scm-demo-branding.test.mjs` - static and helper-level assertions for SCM branding, assets, and promo removal.
- [ ] `e2e/scm-demo-branding.spec.ts` - browser smoke for title, visible header brand, logo rendering, and old promo absence.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Brand tone and endorsement boundary | P7-01, P7-06 | Automated tests can catch known bad strings, but a human should verify tone | Open the SCM variant and inspect header, mobile menu, footer, settings, docs/demo references, and degraded states for public-data-only framing and no endorsement/private-data implication. |
| Logo quality | P7-02 | Tests can prove render presence, but not brand approval or visual quality | Inspect desktop and mobile widths to confirm both logos are legible, not distorted, and do not crowd controls. |

## Validation Sign-Off

- [ ] All tasks have automated verify commands or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing references.
- [ ] No watch-mode flags.
- [ ] Feedback latency under 120 seconds for non-browser checks.
- [ ] `nyquist_compliant: true` set in frontmatter.
