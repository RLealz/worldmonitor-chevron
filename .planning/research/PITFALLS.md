# Chevron SCM Demo Pitfalls

This note captures the common mistakes and repo-specific risks when turning WorldMonitor into an open-source-data-only Chevron SCM demo. The main failure mode is not the UI itself, but accidentally implying proprietary Chevron operational truth or leaking sensitive-looking data through public surfaces.

## Phase Map

- Phase 1: public-data variant shell
- Phase 2: SCM domain model and data boundary
- Phase 3: supplier risk workspace
- Phase 4: route, port, and materials deepening
- Phase 5: compliance and enterprise readiness

## Pitfalls

| Pitfall | Warning signs | Prevention strategy | Phase |
| --- | --- | --- | --- |
| Implied Chevron proprietary data | Copy says “Chevron suppliers,” “Chevron lanes,” or “internal truth” without source support | Keep framing explicit: public/open-source demo only, reusable generic energy SCM model, and always label assumptions as demo framing | 1, 3 |
| Public bootstrap or cache leakage | Supplier names, route IDs, facility coordinates, or analyst notes appear in `api/bootstrap.js`, shared Redis keys, screenshots, docs, or query strings | Use a strict public/private boundary, `no-store` for sensitive paths, variant-scoped cache keys, and bootstrap allowlists with redaction tests | 2 |
| Missing provenance and confidence | Risk cards or map labels show conclusions without source, timestamp, list/version, or confidence | Make provenance first-class in types and UI: source class, timestamp, confidence, and “inferred vs observed” status on every key claim | 2, 3, 4 |
| Mixing public OSINT with private assumptions | Public trade, AIS, sanctions, or route data is presented as if it proves proprietary Chevron procurement or route behavior | Keep private SCM data separate from public OSINT in storage, handlers, cache keys, and wording; mark inferences as hypotheses only | 2, 3, 4 |
| Overstated route or materials mapping | UI suggests exact Chevron qualification, inventory, or product availability from public Comtrade/route data alone | Treat route/material panels as risk signals, not procurement evidence; require confidence thresholds and fallback copy when mapping is weak | 4 |
| Telemetry, docs, or error leakage | Sentry logs, analytics, markdown docs, or error messages contain supplier names, URLs, or sensitive route text | Redact at the edge and in UI code, minimize response payloads, and block sensitive fields from docs/screenshot/export paths | 2, 5 |
| Test gaps around variant and boundaries | New variant loads, but there is no proof of cache separation, auth gating, bootstrap scope, or empty-state behavior | Add variant smoke tests, gateway/cache tests, redaction tests, and focused E2E coverage before adding richer SCM workspaces | 1, 2, 4 |
| Stale or simulated data presented as live | Demo fallback data is visually indistinguishable from fresh public data | Surface freshness, degraded states, and source availability clearly; separate simulated/demo values from live OSINT values in UI copy | 1, 3 |

## Repo-Specific Watchouts

- `api/bootstrap.js` is a high-risk leakage point because it hydrates client-visible data early.
- `server/gateway.ts` must keep cache, auth, and entitlement decisions aligned for any SCM endpoint.
- `docs/data-sources.mdx` and `SECURITY.md` both reinforce the public-OSINT posture; the demo must not drift into implying access to restricted Chevron data.
- `src/components/SupplyChainPanel.ts` and related route/map panels are the right reuse targets, but they need provenance-aware copy and tests.

