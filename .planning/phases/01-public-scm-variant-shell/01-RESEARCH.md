# Phase 1 Research: Public SCM Variant Shell

**Phase:** 1 - Public SCM Variant Shell  
**Goal:** Create a runnable SCM demo variant using existing panels, map layers, and public-data framing.  
**Requirements:** VAR-01, VAR-02, VAR-03, VAR-04, FRM-01, FRM-02, FRM-03, FRM-04, VER-01, VER-02, VER-03, VER-05

## Existing Variant System

The current variant system is centered on these files:

- `src/config/variant.ts` resolves the active variant from `VITE_VARIANT`, local storage, Tauri state, localhost storage, and hostnames.
- `src/config/variant-meta.ts` defines metadata used by `vite.config.ts` and HTML generation.
- `src/config/panels.ts` defines variant panel sets, map layer defaults, mobile map layer defaults, `ALL_PANELS`, `VARIANT_DEFAULTS`, `VARIANT_PANEL_OVERRIDES`, `DEFAULT_PANELS`, `DEFAULT_MAP_LAYERS`, and `MOBILE_DEFAULT_MAP_LAYERS`.
- `src/config/variants/energy.ts` is a structured reference variant for energy and is the closest model for SCM.
- `src/app/panel-layout.ts` includes variant navigation and panel creation.
- `vite.config.ts` reads `VITE_VARIANT` and `VARIANT_META`, injects variant HTML, and uses variant-specific favicon paths for non-full variants.

Phase 1 should avoid API/proto/server work. The existing data surfaces are sufficient for a shell.

## Required Code Areas

Likely implementation files:

- `src/config/variant.ts`
- `src/config/variant-meta.ts`
- `src/config/panels.ts`
- `src/config/variants/scm.ts` or `src/config/variants/chevron-scm.ts`
- `src/app/panel-layout.ts`
- Potential i18n/label files if variant navigation labels are translated rather than literal
- A test file under `tests/`, likely `tests/scm-variant-config.test.mjs` or similar

Do not touch:

- `src/generated/*`
- `server/worldmonitor/*`
- `proto/worldmonitor/*`
- `api/bootstrap.js`, unless a test proves it does not include private-looking SCM data

## Variant Name Decision

Prefer `scm` as the canonical variant id because requirements say Chevron-specific wording is demo/framing only and the product should remain generic energy SCM. Use user-facing names like "Energy SCM Demo" or "SCM Demo". Avoid putting `chevron` into runtime identifiers unless implementation constraints require it.

`chevron-scm` may be acceptable as an alias later, but Phase 1 should keep the code reusable.

## Panel Mix

Start from the energy variant and prioritize existing public-data panels:

- `map`
- `live-news`
- `supply-chain`
- `hormuz`
- `trade-policy`
- `sanctions-pressure`
- `energy-complex`
- `energy-disruptions`
- `energy-risk-overview`
- `pipeline-status`
- `storage-facility-map`
- `fuel-shortages`
- `commodities`
- `oil-inventories`
- `fuel-prices`
- `macro-signals`
- `monitors`

Only include panels that are already registered in `src/app/panel-layout.ts` and `src/config/panels.ts`. If Route Explorer is not a normal dashboard panel, do not force it into Phase 1; it can be linked or deferred to Phase 4.

## Map Layer Mix

SCM-relevant public layers should be enabled by default:

- `pipelines`
- `storageFacilities`
- `fuelShortages`
- `waterways`
- `tradeRoutes`
- `ais`
- `commodityPorts`
- `commodityHubs`
- `minerals`
- `sanctions`
- `weather`
- `natural`
- `fires`
- `outages`

Disable unrelated geopolitical clutter unless needed by an already enabled panel.

## Public-Data Framing

Phase 1 must include visible framing that this is a public/open-source data demo. Good places:

- Variant metadata title/description.
- Variant navigation label.
- A lightweight banner or panel text if an existing global banner/component pattern exists.
- Panel labels and empty/degraded states where SCM-specific wording is introduced.

Avoid claiming:

- Real Chevron suppliers.
- Internal Chevron routes.
- Internal contracts, shipments, inventory, pricing, or facility-sensitive details.
- Final legal compliance decisions.

## Testing Targets

Automated checks should prove:

- `scm` is accepted by `src/config/variant.ts` and does not fall back to `full`.
- `VARIANT_META.scm` exists with public-data-safe wording.
- `VARIANT_DEFAULTS.scm` includes the required SCM public-data panels.
- `DEFAULT_MAP_LAYERS` and `MOBILE_DEFAULT_MAP_LAYERS` can resolve SCM defaults.
- SCM defaults do not include unrelated high-noise layers such as `military`, `bases`, `iranAttacks`, or `nuclear`.
- Public-data framing strings exist in metadata or variant labels.

Verification commands:

- `npm run typecheck`
- `npm run lint:boundaries`
- `npm run test:data -- tests/<scm-variant-test>.mjs`
- Optional smoke: `cross-env VITE_VARIANT=scm playwright test e2e/runtime-fetch.spec.ts` or a smaller existing smoke path if runtime cost is high.

## Validation Architecture

Phase 1 validation should combine static guardrail tests and TypeScript checks:

- Static tests inspect variant source/config files and do not require a dev server.
- Typecheck validates the new variant id and config wiring.
- Boundary lint validates no new layer violations.
- Browser/E2E smoke can be manual or automated depending on local environment readiness.

Nyquist sampling:

- Run the focused SCM variant config test after every task that changes variant registration or panel/layer defaults.
- Run `npm run typecheck` after all source edits.
- Run `npm run lint:boundaries` after all imports/config edits.
- Run a browser/E2E smoke after the shell compiles.

