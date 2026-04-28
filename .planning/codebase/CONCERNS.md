# Concerns Map

Focus: technical debt, fragile areas, operational risk, and SCM/Chevron adaptation risk for WorldMonitor.

## High-Level Risk Shape

- The repository spans browser SPA, Vercel Edge APIs, Convex, Redis seed pipelines, Railway relay loops, generated proto clients, docs, a Tauri desktop shell, and `consumer-prices-core`; planning must treat changes as cross-runtime unless proven otherwise.
- Core boundaries are documented in `AGENTS.md` and `ARCHITECTURE.md`, especially the dependency direction `types -> config -> services -> components -> app -> App.ts` and the Edge constraint that `api/*.js` cannot import from `src/` or `server/`.
- The codebase already contains many guardrail tests, but the breadth means route, cache, entitlement, and generated-code parity can drift when a new SCM data product is added quickly.
- `git status --short` showed only untracked `.omx/` during this mapping pass; do not rely on that as clean-state proof because other agents may be writing `.planning/codebase/*`.

## Technical Debt And Fragile Areas

- `server/gateway.ts` is a central policy hub for CORS, API keys, bearer/session resolution, entitlement checks, cache tiers, usage telemetry, route matching, and response headers. Any SCM endpoint added here risks policy omissions if route tier, premium gating, and cache behavior are not updated together.
- Premium gating has two sources: `src/shared/premium-paths.ts` lists many premium RPC paths, while `server/_shared/entitlement-check.ts` currently maps only stock-analysis endpoints into `ENDPOINT_ENTITLEMENTS`. This split is fragile for enterprise role-based access and should be rationalized before Chevron-specific RBAC.
- `api/_api-key.js` trusts same-origin browser origins and Vercel preview patterns while requiring keys for desktop and unknown origins. This is acceptable for public-data SaaS, but SCM integrations with proprietary supplier data should not inherit broad browser-origin trust.
- `middleware.ts` has route-specific bot and public-path bypasses. Future internal SCM routes must not be added to `PUBLIC_API_PATHS` unless they carry independent auth and have tests proving that auth still runs.
- Panel rendering uses class-based components and frequent `innerHTML`/`setContent()` updates; examples include `src/components/AirlineIntelPanel.ts`, `src/components/CountryDeepDivePanel.ts`, and `src/components/ChatAnalystPanel.ts`. Sanitization helpers exist, but every new supplier/source field must be escaped at render boundaries.
- `src/components/CountryDeepDivePanel.ts` is very large and combines country facts, route exposure, cost shock, supplier alternatives, map highlighting, and API calls. It is a high-risk place to add SCM behavior without first isolating product/supplier logic.
- `src/services/analysis-framework-store.ts` stores prompt append text and frameworks. Any custom Chevron analytical framework must be prompt-injection reviewed if it incorporates source-provided supplier, route, or incident text.
- `scripts/_seed-utils.mjs` has strong atomic publish conventions, payload limits, seed envelopes, locks, and meta keys, but it also loads `.env.local` from multiple parent locations. That is convenient for dev and risky for enterprise secret hygiene if run in mixed workspaces.
- `api/bootstrap.js` has a large hand-maintained key map. New client-visible SCM data sources must be added here, to source-specific seed meta in `api/health.js`, and to consumer-side `getHydratedData()` expectations in one change.

## Security And Privacy

- `SECURITY.md` states the product is public OSINT oriented and does not use restricted data. A Chevron adaptation will invert that assumption if supplier rosters, contract terms, shipment schedules, inventory, site vulnerabilities, or operational routes are ingested.
- `convex/schema.ts` stores user preferences, notification channels, webhooks, push subscriptions, registrations, alert rules, billing, and broadcast metadata. Enterprise deployment needs a data classification pass for PII, notification endpoints, webhook secrets, retention, and access logs.
- `server/_shared/user-api-key.ts` caches user API key validation for 60 seconds and negative results for 60 seconds. This is short enough for SaaS revocation but still a revocation window for sensitive supplier APIs.
- `server/_shared/entitlement-check.ts` fails closed when entitlements cannot be verified. Good for protection, but SCM operators need planned outage behavior so production dashboards do not silently lose critical access during Convex/Redis incidents.
- `api/mcp-proxy.js`, `api/rss-proxy.js`, `api/notification-channels.ts`, and `consumer-prices-core/src/adapters/search.ts` contain SSRF-related defenses. Any supplier URL ingestion or webhook registration must reuse allowlists and private-IP blocking rather than accepting arbitrary URLs.
- `api/chat-analyst.ts`, `api/internal/brief-why-matters.ts`, and LLM helpers under `server/_shared/` process untrusted text. Supplier names, incident reports, emails, and free-text notes should be treated as prompt-injection inputs, not factual instructions.
- `api/_json-response.js` sanitizes JSON values for API responses, but the SCM threat model also needs response minimization so restricted fields are never sent to unauthorized clients in the first place.
- Sentry and analytics are initialized in `src/main.ts` and usage telemetry is assembled in `server/gateway.ts`; Chevron deployments need explicit redaction rules for supplier names, route IDs, facility coordinates, user IDs, and query strings.

## Data Quality And Source Reliability

- `docs/data-sources.mdx` documents many public-source assumptions and degraded/demo modes, including simulated aviation delays when keys are absent. SCM users may interpret demo or fallback data as operational truth unless provenance is surfaced clearly.
- OREF, Telegram, GPSJAM, advisories, sanctions, AIS, OpenSky, Yahoo, Comtrade, and public news feeds all have different latency, licensing, and reliability profiles. SCM scoring must expose source timestamp, confidence, and source class.
- `docs/methodology/known-limitations.md` shows resilience scoring has intentional construct limitations and pinned current behavior. New SCM scores should get equivalent limitation docs before business users rely on them.
- `src/services/data-freshness.ts` has user-facing degraded messages for several domains. SCM-specific data freshness should be first-class and should distinguish stale, absent, unauthorized, and redacted.
- `scripts/_seed-utils.mjs` enforces a 5MB per-key payload limit. Supplier catalogs, route histories, or shipment-level event streams may exceed this shape and need pagination or partitioned keys.
- `api/health.js` depends on `seed-meta:<key>` freshness. Any new seed path that bypasses `atomicPublish()` or omits seed meta will look healthy only by accident.
- `consumer-prices-core/` has its own database migrations, acquisition adapters, retailer YAML, and API routes. It is not just a subfolder; it is a separate data pipeline with its own scraping, rate-limit, and data-validation risks.

## Performance And Scalability

- `api/bootstrap.js` hydrates many Redis keys in batches and splits fast/slow tiers. Adding large SCM payloads to bootstrap can degrade first paint for every dashboard user unless scoped by variant, role, or lazy panel fetch.
- `server/gateway.ts` applies CDN and browser cache tiers per RPC path. Proprietary SCM data should default to `no-store` or user-scoped private caching, not public `s-maxage` tiers.
- `src/App.ts`, `src/app/data-loader.ts`, and `src/app/refresh-scheduler.ts` coordinate startup, polling, panel hydration, and viewport-conditioned refresh. New critical SCM panels should define polling intervals and failure backoff deliberately.
- `src/workers/ml.worker.ts`, `src/workers/analysis.worker.ts`, and client-side vector storage can be expensive on low-power desktops. Do not push proprietary document analysis into browser workers without a memory and privacy review.
- `src/components/DeckGLMap.ts` and `src/components/GlobeMap.ts` render dense geospatial layers. Facility, vessel, and route overlays can become performance hotspots if raw SCM points are plotted without aggregation or level-of-detail.
- Yahoo Finance staggering is a known convention in `AGENTS.md`; analogous rate gates will be needed for supplier, sanctions, maritime, or commodity providers with contractual quotas.

## Testing Gaps And Verification Risks

- The repo has broad tests under `tests/`, `e2e/`, Convex tests, sidecar tests, route-cache tests, proto checks, and visual regression scripts, but new SCM behavior spans too many runtimes for unit tests alone.
- `tests/edge-functions.test.mjs`, pre-push esbuild checks, and `tsconfig.api.json` protect Edge import boundaries. Any new `api/*.js` endpoint should get an import-boundary test if it uses shared helpers.
- `tests/route-cache-tier.test.mjs` and premium-path tests should be extended when adding SCM RPCs so every generated route has cache and auth policy coverage.
- `tests/bootstrap-key-hydration-coverage` style coverage is important for any client-visible seed key. Missing bootstrap registration causes slow or blank panel startup rather than obvious compile failure.
- `tests/resilience-*` demonstrates a good model for methodology guardrails. SCM risk scores need anchor fixtures for known route/supplier scenarios and tests for missing, stale, conflicting, or low-confidence source data.
- Playwright E2E runs by variant (`full`, `tech`, `finance`) but no Chevron/SCM variant exists yet. A dedicated variant or feature flag will need E2E coverage for authorization, redaction, and empty-state behavior.

## Deployment And Operations

- Deployment is multi-platform: Vercel (`vercel.json`), Railway relay/seed loops (`scripts/ais-relay.cjs`), Docker configs, Convex, Mintlify docs, and Tauri desktop (`src-tauri/`). SCM rollout needs an environment matrix, not a single deploy checklist.
- `.env.example` has many optional keys and shared secrets. Enterprise deployment should split public OSINT keys, SCM vendor credentials, notification secrets, LLM keys, and internal service tokens by least privilege.
- `RELAY_SHARED_SECRET`, `CONVEX_SERVER_SHARED_SECRET`, and user API keys appear across API, Convex, and relay paths. Secret rotation should be rehearsed because several comments mention prior rotation and webhook failure modes.
- `api/cache-purge.js`, `api/seed-contract-probe.ts`, and internal routes use shared-secret auth. These operational endpoints must be network-restricted or separately audited before being exposed in a corporate environment.
- The desktop sidecar and Tauri capabilities described in `SECURITY.md` add another trust boundary. If Chevron users run desktop builds, local token handling and sidecar API surface need corporate endpoint security review.
- `Makefile` notes Unix assumptions for proto generation despite this mapping running on Windows. Windows developer workflows may fail around `make generate`, plugin lookup, or shell path behavior.

## Generated Code And Proto Hazards

- Proto definitions under `proto/worldmonitor/**` generate `src/generated/client`, `src/generated/server`, and `docs/api`. Generated output has 68 tracked files in `src/generated` during this mapping pass.
- `Makefile` pins sebuf plugin version `v0.11.1`, while `AGENTS.md` project text mentions sebuf `v0.11.0`; resolve this documentation drift before changing proto tooling.
- GET fields need `(sebuf.http.query)` annotations and repeated strings need parsing in handlers. Missing annotations can produce routes that compile but do not receive request parameters correctly.
- `src/generated/` is marked "DO NOT EDIT" in `AGENTS.md`. All changes should originate in `proto/` plus handler code and then run `make generate`.
- Generated OpenAPI docs under `docs/api/` are part of the contract. SCM APIs containing proprietary fields should not be published to public docs without redaction or separate private docs.

## SCM / Chevron Adaptation Risks

- The current product publicly states it uses public sources and cannot ingest proprietary organizational data (`blog-site/src/content/blog/worldmonitor-vs-traditional-intelligence-tools.md`). Chevron adaptation changes product posture, licensing obligations, and threat model.
- Supplier data may include confidential contracts, identities, capacity, pricing, sanctions exposure, ESG findings, site locations, and operational dependencies. Store it outside public bootstrap keys and avoid browser-wide hydration.
- Role-based access is currently closer to free/pro/API/enterprise tiering than fine-grained RBAC. SCM users likely need roles such as viewer, analyst, procurement, compliance, incident commander, admin, and possibly region/business-unit scoping.
- Operational sensitivity is high for routes, chokepoints, tankers, pipeline/storage facilities, and port activity. Files to review include `server/worldmonitor/supply-chain/v1/*`, `src/components/CountryDeepDivePanel.ts`, `src/utils/supplier-route-risk.ts`, and `src/config/trade-routes.ts`.
- Source reliability must distinguish public OSINT, vendor feeds, internal ERP/procurement data, manual analyst entries, and model-inferred estimates. Mixing them in a single score without provenance would create compliance and decision-risk issues.
- Sanctions and trade compliance are visible domains (`server/worldmonitor/sanctions/v1/*`, `server/worldmonitor/trade/v1/*`, `api/mcp.ts`). Chevron use requires audit trails for why an entity was flagged and what list/version/source was used.
- Supplier alternatives generated from public trade flows or route overlap may be misleading for Chevron-specific qualification, contractual availability, product specs, local law, and HSE requirements.
- LLM-generated summaries and scenario outputs must be labeled as analytical aids, not compliance determinations or procurement recommendations. Cache keys must include framework, user scope, and source versions to prevent cross-user leakage.
- Proprietary supplier data should not flow into `public/`, `docs/`, `blog-site/`, OpenAPI public artifacts, screenshots, Sentry events, Vercel Analytics, or unscoped Redis keys.
- Corporate compliance likely requires SOC2-style controls, audit logging, retention/deletion policy, legal hold handling, export controls, sanctions-screening evidence, and data residency review; the public project docs explicitly say those enterprise features are not present today.

## Planning Recommendations

- Create a private SCM data boundary before adding features: storage, API routes, cache policy, entitlement/RBAC checks, audit log, redaction, and telemetry rules.
- Add a Chevron/SCM variant or feature flag rather than overloading `full`; this lets bootstrap, panels, sources, and tests stay scoped.
- Define source provenance and confidence types in `src/types/` before wiring UI panels so all downstream components can display quality and restrictions consistently.
- Extend gateway tests for any SCM route: auth required, role denied, no public CDN cache, no bootstrap leakage, no CORS overexposure, and sanitized errors.
- Keep public OSINT routes and proprietary SCM routes separate even if they share map or scoring utilities; shared helpers should accept already-authorized, already-redacted data.
