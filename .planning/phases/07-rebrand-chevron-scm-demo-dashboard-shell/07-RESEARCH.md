# Phase 7 Research - Rebrand Chevron SCM Demo Dashboard Shell

## RESEARCH COMPLETE

## Objective

Plan how to rebrand the SCM/Chevron demo dashboard shell as a standalone Chevron SCM Demo Dashboard while keeping the change variant-scoped, preserving public-data safety language, and avoiding any implication of proprietary Chevron operational access.

## Inputs Read

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/phases/07-rebrand-chevron-scm-demo-dashboard-shell/07-CONTEXT.md`
- `src/app/panel-layout.ts`
- `src/components/UnifiedSettings.ts`
- `src/config/variants/scm.ts`
- `src/config/demo-access-policy.ts`
- `src/App.ts`
- `src/styles/main.css`
- `index.html`
- `docs/scm-demo-safety.md`
- `docs/scm-api-data-index.md`
- `tests/scm-demo-no-auth-gating.test.mjs`
- `tests/scm-public-artifact-safety.test.mjs`
- `tests/scm-variant-config.test.mjs`
- `e2e/scm-no-auth-gating.spec.ts`

## Current Branding Surfaces

### Header And Shell

- `src/app/panel-layout.ts` renders the main header, variant switcher, SCM label, `MONITOR` logo text, mobile `World Monitor` logo text, author credit link, GitHub link, GitHub star count, mobile menu title, mobile author link, footer brand, and footer links.
- `PanelLayoutManager.fetchGitHubStars()` calls the GitHub API and writes the star count into `#githubStars`. For SCM this is a visible product-promo surface and should not run or render.
- SCM currently appears in the variant switcher as `SCM Demo`; Phase 7 should upgrade SCM-visible product naming while avoiding layout crowding.
- Footer and mobile menu still use WorldMonitor and author attribution in shared shell markup.

### Browser-Visible Metadata And Loading States

- `index.html` has static World Monitor title, meta title, description, author, application-name, Open Graph/Twitter tags, JSON-LD author/sameAs/offers, favicons, analytics domain list, and skeleton loading shell.
- The startup theme script already checks `localStorage.getItem('worldmonitor-variant')`; this is an internal storage key and not itself user-facing, but the resulting page metadata is user-visible.
- Static `index.html` cannot know the runtime `VITE_VARIANT` by itself unless the build injects variant-specific values or a runtime script patches metadata after loading. The plan should choose the repo's existing Vite/variant pattern and keep non-SCM metadata unchanged.

### Settings And Demo Docs

- `src/components/UnifiedSettings.ts` now suppresses account/API-key upsell surfaces for SCM after Phase 6, but settings still inherits generic shell labeling through button labels, modal labels, and visible tab names.
- `docs/scm-demo-safety.md` and `docs/scm-api-data-index.md` are SCM demo docs that should use Chevron SCM demo framing without implying private Chevron access.
- General API docs may legitimately reference WorldMonitor as API/header names or implementation identifiers. Phase 7 should avoid a broad docs search-replace that breaks technical docs.

### Existing Guardrails

- `tests/scm-demo-no-auth-gating.test.mjs` statically verifies SCM has no account or Pro gating surfaces.
- `e2e/scm-no-auth-gating.spec.ts` verifies the browser shell has no visible auth/Pro copy.
- `tests/scm-public-artifact-safety.test.mjs` checks public artifacts for private-data implications.
- Phase 7 should add a focused branding test instead of overloading auth-gating tests.

## Planning Implications

- Create a small `src/config/demo-branding.ts` or equivalent helper that exposes SCM brand labels, logo asset paths, alt text, metadata strings, and booleans for suppressing product-promo surfaces.
- Use that helper in `src/app/panel-layout.ts` for header, mobile menu, footer, SCM variant labels, and whether GitHub star fetching should run.
- Patch metadata through a controlled helper called during app startup, or inject variant-specific metadata at build time if existing config supports it. A runtime helper is likely lower risk because `index.html` is shared across variants.
- Keep source comments, storage keys, generated paths, proto namespaces, API docs, and code identifiers stable unless they are displayed as SCM product branding.
- Add CSS in `src/styles/main.css` for a compact dual-logo SCM header lockup. Use stable dimensions, no viewport-scaled fonts, and avoid pushing header controls off-screen.
- If approved logo files are missing, execution should add approved assets under `public/branding/` and make tests assert the paths exist. Avoid remote logo loads in the dashboard shell.

## Validation Architecture

Validation should combine static source tests, variant config tests, and browser smoke:

- Static source guardrail: add `tests/scm-demo-branding.test.mjs` to assert the SCM branding helper exists, exposes the approved product name, references both logo assets, and SCM shell source no longer renders WorldMonitor/GitHub/author promotional surfaces.
- Metadata guardrail: assert metadata helper or startup code updates title/application/description for SCM and does not remove non-SCM metadata behavior.
- Asset guardrail: assert both logo asset files exist under public assets and are referenced by the SCM branding helper.
- Browser smoke: add or extend an SCM Playwright spec to assert page title, visible header brand, absence of old promo/author/GitHub-star surfaces, and presence of both logo images.
- Existing safety guardrail: continue running `tests/scm-public-artifact-safety.test.mjs` so rebrand copy does not imply private Chevron data access.

## Out Of Scope For Phase 7

- Removing backend API authentication, CORS protection, Redis credentials, upstream public-data credentials, route rate limits, or internal bearer-secret checks.
- Renaming internal generated `worldmonitor` proto/server/client namespaces.
- Removing non-SCM WorldMonitor branding or promotional links from the main product variants.
- Claiming Chevron endorsement, official approval, or production deployment status.
- Adding private Chevron data, private supplier rosters, internal routes, shipments, inventory, contracts, pricing, or facility-sensitive details.
