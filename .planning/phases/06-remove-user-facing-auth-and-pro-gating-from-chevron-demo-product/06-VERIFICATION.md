# Phase 6 Verification - Remove User-Facing Auth And Pro Gating

## Commands

- `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs tests/panel-config-guardrails.test.mjs`
- `npm run typecheck`
- `npm run lint:boundaries`
- `npx tsx --test tests/scm-public-artifact-safety.test.mjs`
- Local Playwright smoke against `http://127.0.0.1:4173/` with `VITE_VARIANT=scm`

## Results

- SCM no-gating/static guardrails passed: 16 tests across SCM access UX, variant config, and panel-config guardrails.
- TypeScript typecheck passed.
- Boundary lint passed with no architectural boundary violations.
- SCM public artifact safety passed: 7 tests confirming public/demo posture and no private-looking SCM payloads.
- Browser smoke passed after opening the SCM dashboard, waiting for async panels, opening settings, and checking visible text plus auth/account/locked/Pro selectors.

## Notes

- Backend-only auth, API keys, Redis credentials, upstream public-data credentials, CORS/API protection, rate limits, and server authorization paths were intentionally left in place.
- The checked-in Playwright config uses POSIX-style environment assignment in its `webServer.command`, so the local Windows verification used a manually started SCM Vite server and an equivalent Playwright script. The E2E spec itself is committed for CI/Linux-style execution.
- Public/open-source-data-only disclaimers and Chevron demo safety language remain covered by `tests/scm-variant-config.test.mjs` and `tests/scm-public-artifact-safety.test.mjs`.

## Remaining Risks

- Some non-default premium panels still contain Pro copy for non-SCM variants. SCM protects the demo by limiting reachable panels to SCM defaults and suppressing SCM-visible gates.
- If deployment later serves `/pro` or account routes alongside this fork, routing policy may need a separate deployment-layer redirect or exclusion. This phase removed the SCM product experience surfaces.
