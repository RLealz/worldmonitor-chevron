# Stack Map - Tech Focus

## Repository Shape

- Root app: `C:\Users\homeh\Documents\GitHub\osint-dashboard\worldmonitor-chevron`.
- Primary product: TypeScript browser SPA plus API/server handlers for a real-time OSINT dashboard.
- Frontend source lives under `src/`; app orchestration is in `src/app/`, panels in `src/components/`, service clients and domain logic in `src/services/`, configuration in `src/config/`.
- Public Vercel API entrypoints live in `api/`, with a mix of plain JS edge functions and TypeScript gateway catch-all functions.
- Server domain implementation lives in `server/worldmonitor/`, mirroring protobuf service domains.
- Shared static/config data lives in `shared/`, `data/`, `public/`, and domain-specific files under `src/config/`.
- Desktop wrapper lives in `src-tauri/` and bundles a Node sidecar from `src-tauri/sidecar/`.
- Deployment/runtime helpers live in `scripts/`, `docker/`, `deploy/`, root `Dockerfile*`, `docker-compose.yml`, `nixpacks.toml`, and `vercel.json`.

## Languages And Runtimes

- TypeScript is the main application language: `src/**/*.ts`, `server/**/*.ts`, `api/**/*.ts`, `middleware.ts`, `vite.config.ts`, and `playwright.config.ts`.
- JavaScript remains important for Vercel edge helpers and seed/relay scripts: `api/*.js`, `scripts/*.mjs`, `scripts/*.cjs`.
- Rust is present through Tauri under `src-tauri/` for desktop packaging and host integration.
- Protobuf defines API contracts under `proto/worldmonitor/**`.
- Node.js is the main local/build/runtime toolchain for web, scripts, seeds, tests, relay services, and the Tauri sidecar.
- Vercel Edge runtime is used by API routes such as `api/bootstrap.js`, `api/health.js`, and domain catch-alls like `api/supply-chain/v1/[rpc].ts`.
- Railway-style long-running Node services are implied by `scripts/ais-relay.cjs`, notification/seed scripts, `Dockerfile.relay`, and `nixpacks.toml`.

## Package Manager And Scripts

- Package manager is npm, anchored by `package-lock.json`.
- Root package is `world-monitor` with `"type": "module"` in `package.json`.
- Main local dev command: `npm run dev` for Vite on port 3000.
- Variant dev commands include `npm run dev:tech`, `npm run dev:finance`, `npm run dev:commodity`, and `npm run dev:happy`.
- Build command: `npm run build`, which runs blog generation, TypeScript, and Vite build.
- Variant builds include `npm run build:full`, `npm run build:tech`, `npm run build:finance`, `npm run build:commodity`, and `npm run build:happy`.
- Type checks: `npm run typecheck`, `npm run typecheck:api`, and `npm run typecheck:all`.
- Tests: `npm run test:data`, `npm run test:sidecar`, `npm run test:e2e`, and variant visual tests.
- Desktop commands include `npm run desktop:dev`, `npm run desktop:build:full`, `npm run desktop:build:tech`, and package/signing scripts.
- `postinstall` runs `cd blog-site && npm ci --prefer-offline`, so root installs also hydrate the blog subproject.

## Frontend Framework And UI Stack

- Framework: Preact (`preact`) with Vite (`vite`) rather than React/Next.
- The UI is class-oriented around panel components; many dashboard surfaces extend or compose panel behavior under `src/components/`.
- Map/geo stack includes `maplibre-gl`, `deck.gl`, `@deck.gl/*`, `pmtiles`, `@protomaps/basemaps`, `supercluster`, `topojson-client`, `h3-js`, and `globe.gl`.
- Charting/data utilities include `d3`, `papaparse`, `fast-xml-parser`, `yaml`, and domain-specific utility code in `src/utils/`.
- ML/browser inference stack includes `@xenova/transformers`, `onnxruntime-web`, and worker code in `src/workers/`.
- i18n uses `i18next` and `i18next-browser-languagedetector`; locale files are under `src/locales/`.
- PWA/offline behavior is configured in `vite.config.ts` via `vite-plugin-pwa`.
- Error/analytics dependencies include `@sentry/browser` and `@vercel/analytics`.

## Build Tooling

- Vite config lives in `vite.config.ts`; it defines HTML variant rewriting, PWA config, brotli precompression, dev proxying, and a sebuf API dev-server plugin.
- TypeScript config lives in `tsconfig.json`; API-specific type checking uses `tsconfig.api.json`.
- Biome is the linter/formatter configured by `biome.json` and used through `npm run lint`.
- Markdown linting is configured by `.markdownlint-cli2.jsonc` and `npm run lint:md`.
- Playwright is configured by `playwright.config.ts`; E2E specs live in `e2e/`.
- Vitest is present for Convex-oriented tests via `vitest.config.mts`.
- Node's built-in test runner plus `tsx` is used for many tests in `tests/`, `api/`, and `src-tauri/sidecar/`.
- `Makefile` controls protobuf generation and pins sebuf plugin versions for generated clients/servers/OpenAPI.
- `make generate` cleans and regenerates `src/generated/client`, `src/generated/server`, and `docs/api`.

## Env And Variant Configuration

- `.env.example` is the canonical environment reference; it lists API keys, Redis, relay, auth, billing, notification, and variant variables.
- Vite-exposed settings use `VITE_` names such as `VITE_VARIANT`, `VITE_WS_API_URL`, `VITE_WS_RELAY_URL`, `VITE_SENTRY_DSN`, `VITE_PMTILES_URL`, `VITE_PMTILES_URL_PUBLIC`, and `VITE_MAP_INTERACTION_MODE`.
- Runtime variants are configured under `src/config/variants/`.
- Variant metadata used during HTML rewriting is in `src/config/variant-meta`.
- Panel and layer definitions are in `src/config/`, including the likely control point for an SCM/Chevron-specific product variant.
- Existing variants are `full`, `tech`, `finance`, `commodity`, and `happy`; an SCM or Chevron dashboard should probably be added as a variant rather than a separate app first.
- `vite.config.ts` also performs hostname/runtime behavior for variants and desktop builds.

## Generated Code And API Contracts

- Protobuf definitions live under `proto/worldmonitor/**`.
- Generated browser/server stubs live under `src/generated/client` and `src/generated/server`.
- API domains are defined in protobuf service files such as `proto/worldmonitor/supply_chain/v1/service.proto`, `proto/worldmonitor/trade/v1/service.proto`, `proto/worldmonitor/economic/v1/service.proto`, and `proto/worldmonitor/maritime/v1/service.proto`.
- Domain handlers under `server/worldmonitor/<domain>/vN/handler.ts` implement generated service handler interfaces.
- Vercel catch-all route files such as `api/supply-chain/v1/[rpc].ts` expose generated handlers through the gateway/router.
- OpenAPI output is generated under `docs/api/` and copied to `public/openapi.yaml` by `npm run build:openapi`.
- Generated code should not be hand-edited; change protobuf definitions and run `make generate`.

## Server And API Surfaces

- Edge helper modules live in `api/_*.js`, including CORS, API key validation, rate limiting, relay calls, seed envelopes, Upstash JSON, OAuth token handling, and Sentry.
- Server gateway code lives in `server/gateway.ts`, `server/router.ts`, `server/cors.ts`, and `server/error-mapper.ts`.
- Domain logic is split by source area: `server/worldmonitor/supply-chain/v1`, `server/worldmonitor/economic/v1`, `server/worldmonitor/trade/v1`, `server/worldmonitor/maritime/v1`, and many others.
- API route aliases exist for some supply-chain endpoints: `api/supply-chain/v1/country-products.ts` and `api/supply-chain/v1/multi-sector-cost-shock.ts`.
- `api/bootstrap.js` is the bulk hydration endpoint reading many Redis cache keys for the SPA.
- `api/health.js`, `api/seed-health.js`, and related scripts are operational health surfaces.
- `api/mcp.ts` and `api/mcp-proxy.js` indicate an agent/tool integration surface.

## Desktop Surface

- Tauri config is `src-tauri/tauri.conf.json`.
- Desktop product is `World Monitor`, bundle targets include app, dmg, nsis, msi, and appimage.
- Desktop builds run `npm run build:desktop` and bundle `../api`, `sidecar/local-api-server.mjs`, `sidecar/package.json`, `sidecar/node`, `../data`, and `../src/config`.
- Desktop app CSP allows localhost/127.0.0.1 sidecar traffic and normal web/asset endpoints.
- Sidecar tests are included in `npm run test:sidecar`.
- SCM/Chevron adaptation should account for offline/desktop usage if internal operations teams need local fallback or packaged analyst workstations.

## Deploy Surfaces

- Vercel is configured by `vercel.json`, with SPA rewrites, API CORS headers, docs proxying to Mintlify, OpenAPI headers, OAuth/MCP rewrites, and strict CSP.
- Docker surfaces include root `Dockerfile`, `Dockerfile.relay`, `Dockerfile.digest-notifications`, seed bundle Dockerfiles, and `docker/Dockerfile`.
- `docker-compose.yml` and `SELF_HOSTING.md` support self-hosted deployment.
- Railway-oriented services are represented by `nixpacks.toml`, relay scripts, seed scripts, and docs such as `docs/railway-seed-consolidation-runbook.md`.
- Static docs live in `docs/`; blog site is a separate package under `blog-site/`.

## Key Dependencies For Adaptation

- Mapping/geospatial: `maplibre-gl`, `deck.gl`, `pmtiles`, `@protomaps/basemaps`, `supercluster`, `h3-js`.
- Data parsing: `fast-xml-parser`, `papaparse`, `yaml`, `d3`.
- Auth/billing: `@clerk/clerk-js`, `convex`, `@dodopayments/convex`, `dodopayments-checkout`, `jose`.
- Caching/rate limits: `@upstash/redis`, `@upstash/ratelimit`.
- AI/LLM: `@anthropic-ai/sdk`, OpenRouter/Groq env support, self-hosted OpenAI-compatible env support, `@xenova/transformers`, `onnxruntime-web`.
- Realtime/relay: `ws`, `telegram`, AIS/OpenSky relay scripts.
- Media/feeds: `hls.js`, `youtubei.js`.
- Cloud storage: `@aws-sdk/client-s3` for S3/R2-style object access.

## SCM / Chevron Adaptation Implications

- The stack already has a strong supply-chain nucleus: `server/worldmonitor/supply-chain/v1`, `proto/worldmonitor/supply_chain/v1`, `src/components/SupplyChainPanel.ts`, `src/components/ChokepointStripPanel.ts`, `src/components/RouteExplorer/`, `src/components/PipelineStatusPanel.ts`, and `src/components/EnergyRiskOverviewPanel.ts`.
- Energy-sector context is already first-class: economic energy handlers, pipeline/fuel/storage endpoints, commodity quotes, chokepoints, Hormuz tracker, and energy disruption panels.
- A Chevron SCM dashboard can likely be implemented as a new variant that filters and rearranges existing panels before adding new private data contracts.
- For source-code changes later, use the existing dependency direction: types/config/services/components/app.
- For new SCM APIs, prefer the existing protobuf -> generated stubs -> server handler -> Vercel catch-all flow.
- For new public or seeded data that should appear at app load, add bootstrap cache keys in `api/bootstrap.js` and wire SPA hydration through existing data-loader/cache-key patterns.
- For Chevron-private feeds, keep secret-bearing integrations server-side or in Railway/desktop sidecar services; only expose normalized operational indicators to the browser.
- No new dependency appears necessary for an initial SCM dashboard; existing map, chart, API, cache, and feed infrastructure should cover route risk, supplier geography, energy logistics, and operational alerts.
