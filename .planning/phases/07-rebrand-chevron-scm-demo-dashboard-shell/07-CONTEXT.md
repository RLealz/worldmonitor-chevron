# Phase 7: Rebrand Chevron SCM Demo Dashboard Shell - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning
**Source:** User Phase 7 request plus roadmap constraints

<domain>
## Phase Boundary

Rebrand the SCM/Chevron demo product experience so it presents as a standalone Chevron SCM Demo Dashboard instead of a WorldMonitor fork. The work is presentation-scoped: header, dashboard shell, page title, metadata, loading states, footer, mobile menu, settings shell, demo/docs references, visible promotional links, and regression checks.

</domain>

<decisions>
## Implementation Decisions

### Product Name
- Use the agreed demo-facing name `Chevron SCM Demo Dashboard` unless an existing approved naming helper supplies a narrower label.
- Existing internal identifiers such as package names, API paths, storage keys, generated proto namespaces, and server implementation names may retain WorldMonitor naming when they are not visible product promotion.

### Brand Scope
- Apply the rebrand to the SCM/Chevron demo product experience only.
- Keep non-SCM variants' existing visible branding unless a shared component needs a variant-aware helper.
- Prefer a variant-scoped branding helper/config over scattered `SITE_VARIANT === 'scm'` checks.

### Logos
- Add both the approved demo logo and the Chevron logo to the SCM header/shell.
- Logos must have accessible names or hidden decorative treatment as appropriate, stable dimensions, and responsive behavior that does not crowd the header.
- If approved logo assets are not already present in the repo, execution should add the approved supplied assets under a predictable public asset path before wiring them.

### Promotional Surface Removal
- Remove visible GitHub stars, GitHub promotional links/badges, author name/credit, and personal attribution surfaces from the SCM demo UI.
- Do not globally remove these surfaces from non-SCM variants unless the shared component is made variant-aware.

### Safety Copy
- Preserve public/open-source-data-only disclaimers and Chevron demo safety language.
- Do not imply Chevron endorsement beyond demo context.
- Do not introduce or imply access to proprietary Chevron supplier rosters, contracts, shipments, inventory, facility-sensitive routes, pricing, or operational secrets.

### Verification
- Add static tests and browser smoke checks proving SCM-visible old naming, promo/attribution, GitHub stars, and author credit are absent.
- Browser smoke must also prove both logos render.

</decisions>

<specifics>
## Specific Ideas

- Current shell branding appears in `src/app/panel-layout.ts`: `MONITOR`, `World Monitor`, `WORLD MONITOR`, author credit link, GitHub link/stars, mobile menu, footer, and SCM variant label.
- Current metadata appears in `index.html`: title, meta title/description/author/application-name, Open Graph/Twitter tags, JSON-LD, canonical/alternate links, favicons, skeleton shell, and analytics domain list.
- Current settings surface appears in `src/components/UnifiedSettings.ts`; Phase 6 already suppresses auth/commerce tabs for SCM and Phase 7 should avoid reintroducing account/promo framing.
- Current SCM variant config appears in `src/config/variants/scm.ts`; this is a good home for demo product display copy or an input to a shared branding helper.
- Existing tests to extend or pattern-match include `tests/scm-demo-no-auth-gating.test.mjs`, `tests/scm-public-artifact-safety.test.mjs`, `tests/scm-variant-config.test.mjs`, and `e2e/scm-no-auth-gating.spec.ts`.

</specifics>

<deferred>
## Deferred Ideas

- Real Chevron production branding approvals, legal sign-off, and brand-governance workflows.
- Private Chevron data ingestion, internal supplier rosters, contracts, shipments, inventory, pricing, internal routes, or facility-sensitive operational views.
- Enterprise RBAC, audit logging, legal evidence retention, and production compliance hardening.
- Global WorldMonitor product rebrand outside the SCM demo.

</deferred>

---

*Phase: 07-rebrand-chevron-scm-demo-dashboard-shell*
*Context gathered: 2026-05-01*
