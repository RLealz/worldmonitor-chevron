# Phase 6 Research - Remove User-Facing Auth And Pro Gating

## RESEARCH COMPLETE

## Objective

Plan how to make the Chevron SCM demo behave as a standalone public-data demo product with no visible login, signup, account, Pro, subscription, pricing, upsell, locked-feature, or blocked-feature UX.

## Inputs Read

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `src/components/AuthHeaderWidget.ts`
- `src/app/panel-layout.ts`
- `src/app/event-handlers.ts`
- `src/components/Panel.ts`
- `src/components/UnifiedSettings.ts`
- `src/components/DeckGLMap.ts`
- `src/components/GlobeMap.ts`
- `src/App.ts`
- `src/services/panel-gating.ts`
- `src/config/variants/scm.ts`
- `tests/scm-variant-config.test.mjs`

## Current Gating Surfaces

### Header And Account UX

- `src/app/event-handlers.ts` always calls `setupAuthWidget()`, creating an `AuthLauncher` and `AuthHeaderWidget`.
- `src/components/AuthHeaderWidget.ts` renders `Sign In`, `Create account`, Clerk user button, and settings shortcut depending on auth state.
- `e2e/auth-ui.spec.ts` explicitly asserts sign-in UI exists for the default product.

### Pro Navigation And Marketing Links

- `src/app/panel-layout.ts` renders `Pro` links in the mobile menu and footer.
- Checkout and billing overlay initialization currently runs in `PanelLayoutManager` constructor even for variants where the user should not see purchasing flows.
- `public/pro/` and Pro-site bundles are separate public marketing assets. Phase 6 should not need to delete them globally unless the Chevron deployment serves them.

### Panel And Feature Locks

- `src/app/panel-layout.ts` defines `WEB_PREMIUM_PANELS` and calls `updatePanelGating()` reactively from auth and entitlement state.
- `src/components/Panel.ts` renders generic locked states with "Upgrade to Pro", `premium.signInToUnlock`, `premium.upgradeDesc`, and gated CTAs.
- `src/app/panel-layout.ts` creates Pro and MCP widget add-panel blocks with `widget-pro-badge`, then hides them for non-Pro users.
- `src/app/event-handlers.ts` hides export and playback controls behind `state.user?.role === 'pro'`.
- `src/App.ts` enforces free-tier panel/source limits by trimming panels and disabling sources.

### Map Layer Locks

- `src/components/DeckGLMap.ts` marks locked layers with `layer-toggle-locked`, lock glyphs, disabled inputs, and `layer-pro-badge`.
- `src/components/GlobeMap.ts` uses runtime API-key presence to lock layers and show `PRO` badges.
- The SCM map defaults already avoid many high-noise layers, but Phase 6 should ensure any visible SCM layer toggle is not presented as Pro-only.

### Panel-Specific Pro Copy

- `src/components/CountryDeepDivePanel.ts` renders multiple `Upgrade to PRO` locked states for bypass corridors, product imports, national debt, sanctions, comtrade, tariff trends, and cost shock modeling.
- `src/components/LatestBriefPanel.ts`, `ChatAnalystPanel.ts`, `DailyMarketBriefPanel.ts`, and `ResilienceWidget.ts` contain user-facing sign-in/Pro copy. Some are not SCM defaults but may be reachable through settings, search, saved layout, or cross-variant persisted panel state.
- `src/components/UnifiedSettings.ts` gates API key management behind sign-in/API Starter UI.

### Server-Side Protections To Keep

- `api/_api-key.js`, `server/gateway.ts`, `server/_shared/entitlement-check.ts`, `server/_shared/premium-check.ts`, and auth-bearing operational endpoints protect APIs, Redis, upstream credentials, internal routes, and premium/user-bound services.
- Phase 6 must not remove API keys, Redis credentials, internal bearer checks, CORS/API protection, route rate limits, or backend-only authorization checks.

## Planning Implications

- Implement a variant-scoped product access policy, likely keyed off `SITE_VARIANT === 'scm'`, so changes are isolated to the Chevron SCM demo and do not accidentally remove monetization/auth UX from the main WorldMonitor product.
- Prefer bypassing or suppressing user-facing gates in the layout and panel rendering layers rather than weakening server checks.
- Saved layouts and cross-variant persisted panel state matter: SCM should not resurrect Pro-locked panels or CTAs from another variant's saved configuration.
- If a server endpoint remains user-bound or Pro-gated, the SCM UI should omit that feature or render public-data unavailable copy, not a login/upgrade prompt.
- Tests should scan SCM source and runtime shell for forbidden UX copy while allowing backend-only auth, operational secrets, and out-of-scope safety language.

## Validation Architecture

Validation should combine static guardrails with a browser smoke path:

- Static guardrail: add or extend a node:test file to assert SCM-facing source does not render login, signup, account menu, Pro, pricing, subscription, upgrade, locked, or unlock copy in the dashboard shell, panel gates, map toggles, and SCM-reachable panels.
- Variant regression: extend `tests/scm-variant-config.test.mjs` or add a focused Phase 6 test to assert SCM defaults exclude premium-only/user-bound panels unless they have a public, ungated SCM mode.
- Behavioral unit tests: cover a pure helper for the SCM access policy so account/gating suppression is deterministic.
- Browser smoke: run the SCM variant and assert no visible sign-in/sign-up/account/Pro/upgrade/locked controls while core SCM panels and public-data disclaimers still render.
- Existing safety guardrails: continue to run SCM public artifact safety checks so removing Pro/account copy does not introduce private Chevron data implications.

## Out Of Scope For Phase 6

- Removing backend API authentication, CORS protection, Redis credentials, upstream public-data credentials, route rate limits, or internal bearer-secret checks.
- Adding proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.
- Building enterprise RBAC, audit logging, private SCM ingestion, or production billing migration.
- Globally deleting the main WorldMonitor Pro site unless a deployment-specific routing decision requires it.

