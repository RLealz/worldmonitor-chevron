# Wave 2 Summary - Demo Source And Limitation Documentation

## Completed

- Added `docs/scm-demo-safety.md` with public-data posture, approved fixture postures, source categories, confidence/freshness expectations, out-of-scope private data, and production-only future work.
- Added a README note for running the `scm` variant and linked the safety notes from the project quick-start area.
- Extended the SCM public artifact safety tests so the safety notes and README framing remain present.

## Verification

- `npx tsx --test tests/scm-public-artifact-safety.test.mjs tests/scm-variant-config.test.mjs`
- `npm run typecheck`
- `npm run lint:boundaries`

## Result

The SCM demo now has executable safety checks plus human-readable documentation for public-data-only limits and production exclusions.
