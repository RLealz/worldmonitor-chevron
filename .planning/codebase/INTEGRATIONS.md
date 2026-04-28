# Integrations Map - Tech Focus

## Integration Overview

- This repo integrates many public OSINT feeds through Vercel Edge routes, server handlers, Redis seed caches, and Railway relay/seed services.
- The main API surface is `api/`, backed by generated sebuf routes and handlers in `server/worldmonitor/`.
- The bulk client hydration surface is `api/bootstrap.js`, which reads predefined Upstash Redis keys and returns `data` plus `missing`.
- The live/realtime relay surface is Railway-style Node, especially `scripts/ais-relay.cjs` and relay helper code such as `api/_relay.js`.
- The desktop integration surface is Tauri plus a local Node sidecar in `src-tauri/sidecar/`.
- The SCM/Chevron opportunity is to reuse existing energy, maritime, trade, market, and chokepoint integrations while adding private supplier/shipment/procurement feeds behind the same gateway/cache patterns.

## External APIs And Public Data Sources

- Market data: Yahoo Finance dev proxy in `vite.config.ts`, Finnhub via `FINNHUB_API_KEY`, Alpha Vantage via `ALPHA_VANTAGE_API_KEY`, CoinGecko via `COINGECKO_API_KEY`, Hyperliquid/crypto-related handlers under `server/worldmonitor/market/v1`.
- Energy/economic data: EIA via `EIA_API_KEY`, FRED via `FRED_API_KEY`, ENTSO-E via `ENTSO_E_TOKEN`, GIE via `GIE_API_KEY`, JODI/oil and gas cache keys in `api/bootstrap.js`, and energy handlers under `server/worldmonitor/economic/v1`.
- Trade data: WTO via `WTO_API_KEY`, UN Comtrade via `COMTRADE_API_KEYS`, trade handlers under `server/worldmonitor/trade/v1`, and intelligence Comtrade helpers under `server/worldmonitor/intelligence/v1`.
- Supply chain and energy infrastructure: `server/worldmonitor/supply-chain/v1` includes shipping rates, chokepoints, critical minerals, route impact, pipelines, storage facilities, fuel shortages, and energy disruptions.
- Maritime: AISStream via `AISSTREAM_API_KEY`, NGA MSI via the `/api/nga-msi` Vite proxy, and maritime handlers under `server/worldmonitor/maritime/v1`.
- Aviation: OpenSky via `OPENSKY_CLIENT_ID` and `OPENSKY_CLIENT_SECRET`, AviationStack via `AVIATIONSTACK_API`, ICAO via `ICAO_API_KEY`, Travelpayouts via `TRAVELPAYOUTS_API_TOKEN`, and Wingbits via `WINGBITS_API_KEY`.
- Conflict/unrest: ACLED via `ACLED_EMAIL`, `ACLED_PASSWORD`, or `ACLED_ACCESS_TOKEN`; UCDP via `UCDP_ACCESS_TOKEN`; handlers under `server/worldmonitor/conflict/v1` and `server/worldmonitor/unrest/v1`.
- Climate/disaster/health: NASA FIRMS via `NASA_FIRMS_API_KEY`, OpenAQ via `OPENAQ_API_KEY`, WAQI via `WAQI_API_KEY`, ReliefWeb via `RELIEFWEB_APPNAME`, plus climate/health handlers.
- Cyber/security: Cloudflare Radar via `CLOUDFLARE_API_TOKEN`, AbuseIPDB via `ABUSEIPDB_API_KEY`, OTX via `OTX_API_KEY`, URLHaus via `URLHAUS_AUTH_KEY`, and cyber handlers under `server/worldmonitor/cyber/v1`.
- News/RSS: many RSS sources are proxied in `vite.config.ts`; allowed domains are centralized in `api/_rss-allowed-domains.js` and shared RSS config appears under `shared/`.
- Social/OSINT messaging: Telegram MTProto uses `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION`, and `TELEGRAM_CHANNEL_SET`; Telegram bot delivery uses `TELEGRAM_BOT_TOKEN`.
- AI/search: Groq via `GROQ_API_KEY`, OpenRouter via `OPENROUTER_API_KEY`, Anthropic via `ANTHROPIC_API_KEY`, Exa via `EXA_API_KEYS`, Brave via `BRAVE_API_KEYS`, Firecrawl via `FIRECRAWL_API_KEY`, and self-hosted LLM variables.

## Redis And Cache Integration

- Upstash Redis REST credentials are `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Core Redis helpers live in `server/_shared/redis.ts`.
- Edge JS Redis helpers live in `api/_upstash-json.js`.
- `server/_shared/redis.ts` supports `getCachedJson`, `setCachedJson`, `getCachedJsonBatch`, `runRedisPipeline`, `geoSearchByBox`, and request coalescing through `cachedFetchJson`.
- Cache keys are prefixed by Vercel environment in `server/_shared/redis.ts` unless raw mode is used.
- Bootstrap intentionally reads raw/unprefixed production keys in `api/bootstrap.js`.
- Negative cache sentinel is `__WM_NEG__` in both `server/_shared/redis.ts` and `api/bootstrap.js`.
- Seed envelope unwrapping is handled by `server/_shared/seed-envelope` and `api/_seed-envelope.js`.
- Cache tiers in `api/bootstrap.js` split keys into `FAST_KEYS` and `SLOW_KEYS` and set browser/CDN cache headers.

## Fetch And Caching Patterns

- Server handlers should use `cachedFetchJson()` or `cachedFetchJsonWithMeta()` from `server/_shared/redis.ts` when calling upstream APIs.
- Cache keys must include request-varying parameters; this is called out in the repo AGENTS guidance and existing handler patterns.
- `cachedFetchJsonWithMeta()` can emit upstream usage events when a provider label is supplied.
- Fetches should include explicit `User-Agent` headers in server-side calls.
- `fetch.bind(globalThis)` is banned by project convention; use `(...args) => globalThis.fetch(...args)`.
- Vite dev proxies external APIs in `vite.config.ts`, but production should use Vercel routes/server handlers rather than browser-direct secret-bearing calls.
- Edge helper routes in `api/_*.js` are self-contained and cannot import from `src/` or `server/`.
- XML/RSS/WMS-style feeds use `fast-xml-parser` and have regression tests such as `api/loaders-xml-wms-regression.test.mjs`.

## Bootstrap Hydration

- `api/bootstrap.js` defines `BOOTSTRAP_CACHE_KEYS`, `FAST_KEYS`, and `SLOW_KEYS`.
- Existing SCM-relevant bootstrap keys include `shippingRates`, `chokepoints`, `minerals`, `shippingStress`, `customsRevenue`, `fuelPrices`, `crudeInventories`, `natGasStorage`, `electricityPrices`, `jodiOil`, `chokepointBaselines`, `portwatchPortActivity`, `oilStocksAnalysis`, `lngVulnerability`, `pipelinesGas`, `pipelinesOil`, `storageFacilities`, `fuelShortages`, `energyDisruptions`, and `energyCrisisPolicies`.
- Bootstrap returns only public-facing normalized data and strips internal seed metadata.
- New SCM/Chevron panels that need fast initial load should get cache-key entries in `api/bootstrap.js` plus client consumers in the data-loader/cache-key flow.
- Private Chevron data should not be added to public bootstrap unless entitlement/auth and tenant separation are designed first.

## Vercel Integration

- `vercel.json` controls rewrites, headers, CORS, CSP, docs proxying, OpenAPI exposure, OAuth routes, MCP route, and SPA fallback.
- API CORS allows `Content-Type`, `Authorization`, `X-WorldMonitor-Key`, `X-Widget-Key`, and `X-Pro-Key`.
- OAuth route files are under `api/oauth/`, `api/discord/oauth/`, and `api/slack/oauth/`.
- API key validation helper is `api/_api-key.js`.
- Rate limiting helpers are in `api/_rate-limit.js` and `@upstash/ratelimit`.
- Vercel environment variables found in code include `VERCEL_ENV` and `VERCEL_GIT_COMMIT_SHA`.
- Production API hardening is concentrated in `vercel.json` CSP and route-specific headers.

## Railway / Relay Integration

- Relay URL variables include `WS_RELAY_URL`, `VITE_WS_RELAY_URL`, `RELAY_URL`, `RELAY_SHARED_SECRET`, `RELAY_AUTH_HEADER`, and `ALLOW_UNAUTHENTICATED_RELAY`.
- Relay runtime tuning variables include `RELAY_METRICS_WINDOW_SECONDS`, `RELAY_RATE_LIMIT_MAX`, `RELAY_RATE_LIMIT_WINDOW_MS`, `RELAY_RSS_RATE_LIMIT_MAX`, `RELAY_OPENSKY_RATE_LIMIT_MAX`, `RELAY_OREF_RATE_LIMIT_MAX`, and `RELAY_LOG_THROTTLE_MS`.
- Railway metadata variables found in code include `RAILWAY_ENVIRONMENT`, `RAILWAY_GIT_COMMIT_SHA`, `RAILWAY_PROJECT_ID`, and `RAILWAY_STATIC_URL`.
- AIS/OpenSky relay behavior is configured with `AIS_MAX_VESSELS`, `AIS_MAX_VESSEL_HISTORY`, `AIS_SNAPSHOT_INTERVAL_MS`, and OpenSky cache/rate variables.
- Notification relay variables include `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `NOTIFICATION_ENCRYPTION_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_FROM_BRIEF`.
- Docker/Railway deployment files include `Dockerfile.relay`, `Dockerfile.digest-notifications`, seed bundle Dockerfiles, `nixpacks.toml`, and `docs/railway-seed-consolidation-runbook.md`.

## Tauri / Desktop Integration

- `src-tauri/tauri.conf.json` configures the desktop shell, bundle targets, resources, and CSP.
- Desktop bundles API files, config, data, a Node runtime, and `src-tauri/sidecar/local-api-server.mjs`.
- Desktop env/runtime variables include `LOCAL_API_MODE`, `LOCAL_API_PORT`, `LOCAL_API_PORT_FILE`, `LOCAL_API_TOKEN`, `LOCAL_API_DATA_DIR`, `LOCAL_API_RESOURCE_DIR`, `LOCAL_API_REMOTE_BASE`, and `LOCAL_API_CLOUD_FALLBACK`.
- Desktop cloud fallback uses `WORLDMONITOR_VALID_KEYS`.
- A Chevron SCM desktop variant could reuse this for internal analysts or disconnected operating contexts, but private data sync should be designed carefully.

## Auth, Billing, And Entitlements

- Clerk variables include `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_PUBLISHABLE_KEY`, and `CLERK_JWT_AUDIENCE`.
- Convex variables include `CONVEX_URL`, `CONVEX_SITE_URL`, `CONVEX_SERVER_SHARED_SECRET`, `CONVEX_DEPLOY_KEY`, and `VITE_CONVEX_URL`.
- Dodo Payments variables include `DODO_API_KEY`, `DODO_WEBHOOK_SECRET`, `DODO_PAYMENTS_WEBHOOK_SECRET`, `DODO_IDENTITY_SIGNING_SECRET`, `DODO_BUSINESS_ID`, `DODO_PAYMENTS_ENVIRONMENT`, and `VITE_DODO_ENVIRONMENT`.
- Slack OAuth variables include `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_REDIRECT_URI`.
- Discord OAuth variables include `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI`.
- API/product access variables include `WORLDMONITOR_API_KEY`, `WORLDMONITOR_KEY`, `WORLDMONITOR_VALID_KEYS`, `PRO_WIDGET_KEY`, and `WIDGET_AGENT_KEY`.
- For SCM/Chevron adaptation, tenant auth and private data entitlement should sit at the gateway/server layer, not in panel-only UI logic.

## Cloud Storage And Observability

- Cloudflare R2/S3-style variables include `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_TRACE_BUCKET`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_REGION`, `CLOUDFLARE_R2_TRACE_PREFIX`, and `CLOUDFLARE_R2_TOKEN`.
- AWS SDK dependency `@aws-sdk/client-s3` supports object storage workflows.
- Sentry client variable is `VITE_SENTRY_DSN`; server/common Sentry helpers are in `api/_sentry-common.js`, `api/_sentry-edge.js`, and `api/_sentry-node.js`.
- Usage/telemetry uses variables such as `USAGE_TELEMETRY`, `USAGE_UA_PEPPER`, and `AXIOM_API_TOKEN`.
- Turnstile/security challenge support appears through `TURNSTILE_SECRET_KEY` and CSP entries in `vercel.json`.

## SCM / Chevron Source Opportunities

- Internal ERP/procurement feeds: SAP, Oracle, Coupa, Ariba, contract master data, supplier hierarchy, PO/invoice status, and material master records can map into new server handlers while keeping browser data normalized.
- Logistics feeds: TMS, freight forwarder APIs, carrier EDI/API status, ocean booking data, port ETA feeds, demurrage/detention events, and lane performance can extend `server/worldmonitor/supply-chain/v1` or a new SCM domain.
- Energy operations feeds: refinery/pipeline terminal status, storage inventory, LNG schedules, crude assay/sourcing, blending constraints, and refinery turnaround calendars align with existing pipeline/storage/fuel/energy disruption panels.
- Supplier risk feeds: financial health, sanctions screening, cyber posture, ESG incidents, country risk, labor disruptions, and adverse media can reuse `server/worldmonitor/intelligence/v1` company/country enrichment patterns.
- Market/commodity feeds: crude, refined products, petrochemicals, natural gas, freight indices, FX, and carbon pricing can extend existing market/economic cache keys.
- External public sources already useful for Chevron SCM include EIA, JODI, GIE, ENTSO-E, UN Comtrade, WTO, PortWatch, AISStream, NGA MSI, OpenSky, ACLED, UCDP, ReliefWeb, NASA FIRMS, Cloudflare Radar, sanctions handlers, and RSS/news.
- Private source design should prefer a new protobuf service if data becomes a stable product contract, and seed-to-Redis if it is heavy, slow, or shared across many panels.
- Keep secrets by name only in docs and code review artifacts; never put credential values in `.planning/` or client-visible config.
