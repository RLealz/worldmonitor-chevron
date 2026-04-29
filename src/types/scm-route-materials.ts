export type ScmRouteDemoPosture = 'public_demo_corridor';

export type ScmRouteMaterialConfidence = 'high' | 'medium' | 'low' | 'unavailable';

export type ScmRouteCargoType = 'container' | 'tanker' | 'bulk' | 'roro';

export type ScmRouteSignalCategory =
  | 'route_chokepoint'
  | 'critical_minerals'
  | 'pipeline_storage'
  | 'fuel_shortage'
  | 'energy_disruption'
  | 'market_context';

export interface ScmRouteMaterialSourceNote {
  source: string;
  note: string;
  fetchedAt?: string;
}

export interface ScmRouteMaterialFallback {
  reason: string;
  copy: string;
}

export interface ScmMaterialMapping {
  materialId: string;
  label: string;
  hs2: string | null;
  productLabel: string | null;
  confidence: ScmRouteMaterialConfidence;
  sourceNote: ScmRouteMaterialSourceNote;
  fallback: ScmRouteMaterialFallback;
  signalCategories: ScmRouteSignalCategory[];
}

export interface ScmRoutePreset {
  id: string;
  label: string;
  dataPosture: ScmRouteDemoPosture;
  originIso2: string;
  originLabel: string;
  destinationIso2: string;
  destinationLabel: string;
  hs2: string;
  productLabel: string;
  cargoType: ScmRouteCargoType;
  materialIds: string[];
  routeIds: string[];
  chokepointIds: string[];
  signalCategories: ScmRouteSignalCategory[];
  rationale: string;
  sourceNote: ScmRouteMaterialSourceNote;
  freshnessLabel: string;
  confidence: Exclude<ScmRouteMaterialConfidence, 'unavailable'>;
}

export interface ScmRouteMaterialContextInput {
  preset: ScmRoutePreset;
  chokepointScores?: Map<string, number>;
  materialIds?: string[];
  routeAvailability?: 'available' | 'partial' | 'unavailable';
}

export interface ScmRouteMaterialContextSummary {
  presetId: string;
  label: string;
  dataPosture: ScmRouteDemoPosture;
  originIso2: string;
  originLabel: string;
  destinationIso2: string;
  destinationLabel: string;
  hs2: string;
  productLabel: string;
  cargoType: ScmRouteCargoType;
  routeIds: string[];
  chokepointIds: string[];
  maxChokepointScore: number;
  materials: ScmMaterialMapping[];
  signalCategories: ScmRouteSignalCategory[];
  sourceNote: ScmRouteMaterialSourceNote;
  freshnessLabel: string;
  confidence: ScmRouteMaterialConfidence;
  degradedStateCopy: string | null;
  marketContextCopy: string;
  routeContextCopy: string;
}
