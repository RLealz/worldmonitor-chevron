# Wave 1 Summary - Ungate SCM Panels, Layers, And Settings UX

## Completed

- Made `hasPremiumAccess()` return true for the SCM demo presentation layer so panel and layer UI gates render as available without weakening server-side checks.
- Skipped free-tier trimming and source-limit checks for SCM so the demo remains usable without a user account.
- Removed SCM settings surfaces for notifications/account state, API keys, billing, subscriptions, upgrade sections, locked panel toggles, and Pro badges.
- Rendered SCM map layer toggles without Pro locks and omitted Pro/MCP add-panel blocks from the SCM dashboard.
- Routed late-mounted Deduction and Regional Intelligence panels through `shouldCreatePanel()` so non-default premium panels cannot bypass SCM variant defaults.

## Verification

- `npx tsx --test tests/scm-demo-no-auth-gating.test.mjs tests/scm-variant-config.test.mjs tests/panel-config-guardrails.test.mjs`
- `npm run typecheck`
- `npm run lint:boundaries`

## Result

SCM default panels, map layers, settings, export/playback controls, and panel creation paths no longer expose user-facing locked-feature, upgrade, or Pro states.
