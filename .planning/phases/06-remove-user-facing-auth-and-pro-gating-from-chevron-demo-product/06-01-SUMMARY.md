# Wave 1 Summary - Suppress Account And Commerce UX In The SCM Shell

## Completed

- Added `src/config/demo-access-policy.ts` to centralize SCM-only presentation policy for account UX, commerce UX, and dashboard de-gating.
- Suppressed the SCM auth launcher and header account widget while keeping auth infrastructure available for non-SCM variants and backend protections.
- Removed SCM-facing commerce shell surfaces by skipping Pro banners, checkout return banners, checkout overlay registration, payment failure banners, billing watchers, and Pro links in navigation/footer.
- Kept public-data and Chevron demo safety framing untouched.

## Verification

- `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs tests/panel-config-guardrails.test.mjs`
- `npm run typecheck`

## Result

SCM shell startup no longer mounts visible login, signup, account, profile, Pro, checkout, billing, or subscription UX, while non-SCM code paths retain the existing account and commerce behavior.
