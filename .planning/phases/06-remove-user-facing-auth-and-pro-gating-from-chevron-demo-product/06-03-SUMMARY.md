# Wave 2 Summary - Add SCM No-Gating Guardrails And Browser Smoke

## Completed

- Added `tests/scm-demo-no-auth-gating.test.mjs` to lock SCM policy, shell guards, layout gates, settings behavior, map locks, and SCM-safe copy.
- Added `e2e/scm-no-auth-gating.spec.ts` to check the visible SCM browser experience for auth, account, Pro, pricing, subscription, upgrade, checkout, billing, locked, and unlock regressions.
- Extended the browser check to catch panel and panel-toggle Pro badge classes after the smoke test found a late-mounted Regional Intelligence badge.
- Re-ran SCM public artifact safety tests to confirm no proprietary Chevron supplier, route, shipment, inventory, contract, pricing, or facility-sensitive language was introduced.

## Verification

- `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs tests/panel-config-guardrails.test.mjs`
- `npx tsx --test tests/scm-public-artifact-safety.test.mjs`
- Local Playwright smoke against `http://127.0.0.1:4173/` with `VITE_VARIANT=scm`

## Result

The static and browser guardrails pass and cover both source-level regressions and the actual SCM dashboard/settings experience.
