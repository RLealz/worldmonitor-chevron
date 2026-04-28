# Codebase Conventions

Focus for future planning: adapt the existing OSINT dashboard patterns into an SCM / Chevron SCM dashboard without breaking the current dependency, runtime, and data-safety contracts.

## Architecture Direction

- The intended dependency direction is `types -> config -> services -> components -> app -> App.ts`.
- `src/types/` should stay free of imports from internal application layers.
- `src/config/` may import from `src/types/`, but avoid service/component imports unless explicitly documented with a local boundary exception.
- `src/services/` is the business/data layer and should not depend on UI components.
- `src/components/` render and manage panel-local interaction state; shared data shaping belongs in `src/services/` or `src/utils/`.
- `src/app/data-loader.ts` orchestrates service calls, panel updates, map updates, freshness tracking, and guarded async loading.
- Use `npm run lint:boundaries` when touching imports across `src/` layers.

## TypeScript And UI Style

- Browser SPA code is strict TypeScript under `src/`; see `tsconfig.json` for `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedIndexedAccess`.
- Path alias `@/*` maps to `src/*`; current components and services commonly use imports like `@/services/...`.
- UI is mostly class-based TypeScript, not Preact components, even though Preact is a dependency.
- DOM construction uses direct DOM APIs plus helpers from `src/utils/dom-utils.ts`, especially `h()`, `replaceChildren()`, and `safeHtml()`.
- User-visible strings should use `t()` from `src/services/i18n.ts` where existing panels already do so.
- When rendering HTML strings, escape untrusted values with `escapeHtml()` from `src/utils/sanitize.ts`.
- Inline HTML is common in panels, but untrusted upstream fields must be escaped before interpolation.
- Keep panel UI dense, operational, and scan-friendly; this matters for SCM workflows where repeated monitoring beats marketing-style layout.

## Panel Subclass Patterns

- Shared panel base class lives at `src/components/Panel.ts`.
- New panels normally `extends Panel`, call `super({ id, title, ... })`, and expose panel-specific update methods such as `updateData()`, `setData()`, or domain-named methods.
- Panel IDs are stable integration keys; they appear in `src/config/panels.ts`, `src/app/data-loader.ts`, layout/state persistence, tests, and sometimes map interactions.
- `Panel` provides `showLoading()`, `showError()`, `showRetrying()`, `showConfigError()`, `setContent()`, `setCount()`, `setSeverity()`, `showLocked()`, and lifecycle cleanup via `destroy()`.
- Use `this.signal` or your own `AbortController` when a panel starts async work directly.
- If a panel registers observers, intervals, global listeners, or subscriptions, release them in `destroy()` or an equivalent panel-local cleanup path.
- `SupplyChainPanel` in `src/components/SupplyChainPanel.ts` is the closest existing SCM starting point: tabs, chokepoints, freight indices, critical minerals, shipping stress, scenario triggers, and premium-gated bypass options.
- For Chevron SCM adaptation, prefer extending/reusing supply-chain, energy, commodity, route, and chokepoint panels over creating parallel UI concepts.

## Service Patterns

- Client data services live in `src/services/` and should return typed domain objects rather than DOM-ready strings.
- Service clients generated from proto live under `src/generated/client/worldmonitor/...` and are used by wrappers in `src/services/`.
- RPC base URL is centralized through `src/services/rpc-client.ts` and runtime URL helpers in `src/services/runtime.ts`.
- Existing service fetches use `AbortSignal.timeout(...)` heavily; SCM data sources should also bound every network call.
- Client-side resilience commonly uses `createCircuitBreaker()` from `src/utils/circuit-breaker.ts` via `@/utils`.
- Persistent or stale-fallback client caches appear in services such as `src/services/cached-risk-scores.ts`, `src/services/cached-theater-posture.ts`, and `src/services/persistent-cache.ts`.
- `src/app/data-loader.ts` records freshness and errors through `src/services/data-freshness.ts`; new SCM feeds should participate so stale data is visible.
- Avoid `fetch.bind(globalThis)`; project guidance bans it. Use `(...args) => globalThis.fetch(...args)` when a fetch implementation must be passed.

## Error And Caching Conventions

- Server-side shared Redis helpers live in `server/_shared/redis.ts`.
- `cachedFetchJson()` coalesces concurrent misses and caches negative results with a sentinel to avoid request storms.
- `cachedFetchJsonWithMeta()` returns `{ data, source }` and should be used when handlers need cache/source metadata or upstream usage telemetry.
- Cache keys must include request-varying params; this is especially important for SCM dimensions such as supplier, asset, route, product, region, time window, and scenario.
- Server-side handlers should avoid caching upstream-unavailable responses as healthy data. `server/gateway.ts` detects `"upstreamUnavailable":true` and forces `no-store`.
- Cache tiers are centralized in `server/gateway.ts` under `RPC_CACHE_TIER`; generated GET routes are tested for explicit tier coverage by `tests/route-cache-tier.test.mjs`.
- Use the existing tier vocabulary: `fast`, `medium`, `slow`, `slow-browser`, `static`, `daily`, `no-store`, and `live`.
- Live SCM telemetry, such as vessel or route status, should use short TTLs only when freshness is operationally meaningful; reference `/api/maritime/v1/get-vessel-snapshot` as the current `live` precedent.

## API Helper Conventions

- Legacy `api/*.js` Vercel Edge Functions must be self-contained JavaScript and may only import same-directory helpers such as `api/_cors.js`.
- Edge functions must not import `../src/` or `../server/`; `tests/edge-functions.test.mjs` enforces this for routed JS files.
- Generated/RPC-style routes use `api/<domain>/v1/[rpc].ts` wrappers that delegate to server routes generated from proto.
- Domain gateway behavior is centralized in `server/gateway.ts`: CORS, API key validation, entitlement checks, rate limits, POST-to-GET compatibility, cache headers, ETag, usage telemetry, and error boundary.
- CORS helpers include `api/_cors.js` for legacy functions and `server/cors.ts` for server/gateway paths.
- Server fetch helpers such as `server/_shared/fetch-json.ts` include JSON `Accept`, `User-Agent`, timeouts, and optional provider telemetry.
- Server-side external fetches should include a `User-Agent`; this is called out in the repository guidance and implemented via `CHROME_UA`.
- Rate limit policy coverage is checked by `npm run lint:rate-limit-policies`; premium-fetch parity by `npm run lint:premium-fetch`.

## Env And Config Rules

- Vite variant selection uses `VITE_VARIANT`; scripts include `npm run dev:tech`, `dev:finance`, `dev:commodity`, and related build variants.
- Current variants are wired in `src/config/panels.ts`, `src/config/variant.ts`, `src/config/variant-meta.ts`, and `src/config/variants/`.
- Panel registry and default map layers live in `src/config/panels.ts`.
- Runtime feature gating and secret presence checks are in `src/services/runtime-config.ts`; desktop/web runtime differences are in `src/services/runtime.ts`.
- Client-exposed env values must use Vite-safe `VITE_` names; server secrets should remain in server/API runtime env.
- Redis keys may be prefixed by deployment environment in `server/_shared/redis.ts`; raw seed-script keys require explicit raw access helpers.
- Desktop sidecar mode uses `LOCAL_API_MODE=tauri-sidecar` branches in shared cache helpers and has its own local API server under `src-tauri/sidecar/`.

## Proto And Domain Contracts

- Proto definitions live under `proto/worldmonitor/`.
- Generated TypeScript clients and servers live under `src/generated/` and should not be edited manually.
- `make generate` refreshes generated stubs and OpenAPI docs.
- GET fields need `(sebuf.http.query)` annotations; repeated string query fields require handler parsing support.
- Adding SCM RPCs should follow the existing flow: proto message, RPC HTTP config, generated code, server handler, domain `[rpc].ts`, cache tier entry, tests.
- Existing supply-chain RPCs are under `proto/worldmonitor/supply_chain/`, `server/worldmonitor/supply-chain/`, `api/supply-chain/v1/[rpc].ts`, and `src/generated/.../supply_chain/...`.

## SCM / Chevron Adaptation Guardrails

- Treat Chevron SCM as an operational intelligence variant, not a one-off fork of the UI.
- Prefer adding a new variant/config layer over hardcoding Chevron labels into generic panels.
- Reuse existing domains before inventing new ones: `supply-chain`, `market`, `economic`, `trade`, `maritime`, `infrastructure`, `climate`, `sanctions`, and `intelligence`.
- Preserve existing WorldMonitor behavior for `full`, `tech`, `finance`, `commodity`, `energy`, and `happy` variants unless a planned migration explicitly changes them.
- Add Chevron-specific data behind config, feature flags, or variant defaults so generic OSINT users do not see private customer assumptions.
- Do not expose proprietary supplier, contract, shipment, customer, or internal route data in public cacheable endpoints.
- For customer/private SCM data, use auth-gated endpoints, `no-store` or `slow-browser` cache behavior, and avoid CDN public caching.
- Distinguish public external risk signals from private Chevron operational data in types, handlers, and cache keys.
- Route and chokepoint models should carry provenance, timestamp, and confidence; avoid presenting model output as ground truth.
- If adapting maps, register new layers in `MapLayers`, default layer configs, data freshness mapping, and E2E map harness tests.
- If adapting panels, register in `src/config/panels.ts`, instantiate through panel layout patterns, wire data loading in `src/app/data-loader.ts`, and add i18n strings.
- If adding SCM scenarios, follow the existing scenario trigger/status pattern used by `src/components/SupplyChainPanel.ts` and `src/services/scenario.ts`.
- Keep source-specific throttling rules, such as staggered Yahoo Finance requests, intact when adding commodity or logistics data.
- New dependencies require explicit request per repository guidance; prefer existing fetch, parsing, Redis, generated RPC, and UI utilities.
