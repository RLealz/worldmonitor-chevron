# Phase 1 Plan 02 Summary

## Implemented

- Added SCM default panel ordering in `src/config/panels.ts` using existing public panels only.
- Added SCM default map layers and mobile map layers tuned for supply-chain, energy, sanctions, and route context.
- Wired `scm` into the existing public trade-policy and supply-chain loader gate in `src/app/data-loader.ts`.
- Added SCM-specific panel copy in `SupplyChainPanel` so empty/degraded states distinguish:
  - no public data returned
  - upstream unavailable
  - stale public data
  - demo-only scenario assumptions
- Added SCM-specific framing in `EnergyRiskOverviewPanel` for public-data usage, stale freshness, and demo framing.
- Added `src/config/variants/scm.ts` as the structured reference variant file parallel to the existing variant reference files.

## Remaining Limitation

- `EnergyRiskOverviewPanel` still relies on `_energy-risk-overview-state.ts`, which collapses "public upstream unavailable" and "no current public data returned" into the same degraded tile state. The SCM panel copy now states that limitation explicitly instead of implying proprietary or missing internal data.
