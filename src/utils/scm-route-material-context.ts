import { SCM_MATERIAL_MAPPINGS, SCM_ROUTE_PRESETS, findScmMaterialMapping } from '@/config/scm-route-presets';
import type {
  ScmMaterialMapping,
  ScmRouteMaterialConfidence,
  ScmRouteMaterialContextInput,
  ScmRouteMaterialContextSummary,
  ScmRoutePreset,
  ScmRouteSignalCategory,
} from '@/types/scm-route-materials';

const CONFIDENCE_RANK: Record<ScmRouteMaterialConfidence, number> = {
  high: 3,
  medium: 2,
  low: 1,
  unavailable: 0,
};

const UNKNOWN_MATERIAL_PREFIX = 'unknown-material-';

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function lowestConfidence(values: ScmRouteMaterialConfidence[]): ScmRouteMaterialConfidence {
  return values.reduce<ScmRouteMaterialConfidence>((lowest, current) => (
    CONFIDENCE_RANK[current] < CONFIDENCE_RANK[lowest] ? current : lowest
  ), 'high');
}

function maxScore(ids: readonly string[], scores?: Map<string, number>): number {
  if (!scores || ids.length === 0) return 0;
  return ids.reduce((max, id) => Math.max(max, scores.get(id) ?? 0), 0);
}

function buildUnknownMaterialMapping(materialId: string): ScmMaterialMapping {
  const label = materialId
    .replace(new RegExp(`^${UNKNOWN_MATERIAL_PREFIX}`), '')
    .replace(/[-_]+/g, ' ')
    .trim() || 'Unknown material';
  return {
    materialId,
    label,
    hs2: null,
    productLabel: null,
    confidence: 'unavailable',
    sourceNote: {
      source: 'Public mapping unavailable',
      note: 'No public material-to-product mapping is configured for this demo input.',
    },
    fallback: {
      reason: 'No public mapping configured.',
      copy: 'No defensible public HS/product mapping is available for this material in the demo.',
    },
    signalCategories: ['market_context'],
  };
}

export function listScmRoutePresets(): readonly ScmRoutePreset[] {
  return SCM_ROUTE_PRESETS;
}

export function listScmMaterialMappings(): readonly ScmMaterialMapping[] {
  return SCM_MATERIAL_MAPPINGS;
}

export function getScmRoutePreset(id: string): ScmRoutePreset | undefined {
  return SCM_ROUTE_PRESETS.find(preset => preset.id === id);
}

export function getScmMaterialMapping(materialId: string): ScmMaterialMapping {
  return findScmMaterialMapping(materialId) ?? buildUnknownMaterialMapping(materialId);
}

export function buildScmRouteMaterialContext(
  input: ScmRouteMaterialContextInput,
): ScmRouteMaterialContextSummary {
  const preset = input.preset;
  const materialIds = input.materialIds?.length ? input.materialIds : preset.materialIds;
  const materials = materialIds.map(getScmMaterialMapping);
  const maxChokepointScore = maxScore(preset.chokepointIds, input.chokepointScores);
  const materialConfidence = lowestConfidence(materials.map(material => material.confidence));
  const routeAvailability = input.routeAvailability ?? (preset.routeIds.length ? 'available' : 'partial');
  const routeConfidence: ScmRouteMaterialConfidence = routeAvailability === 'unavailable'
    ? 'low'
    : preset.confidence;
  const confidence = lowestConfidence([preset.confidence, routeConfidence, materialConfidence]);
  const signalCategories = unique<ScmRouteSignalCategory>([
    ...preset.signalCategories,
    ...materials.flatMap(material => material.signalCategories),
  ]);
  const weakMaterial = materials.find(material => material.confidence === 'low' || material.confidence === 'unavailable');

  const degradedStateCopy = routeAvailability === 'unavailable'
    ? 'Public route upstream unavailable for this demo corridor; no operational absence of risk is implied.'
    : routeAvailability === 'partial'
      ? 'Public route coverage is partial for this demo corridor.'
      : weakMaterial
        ? weakMaterial.fallback.copy
        : null;

  const chokepointCopy = preset.chokepointIds.length
    ? `Public route context includes ${preset.chokepointIds.length} chokepoint signal${preset.chokepointIds.length === 1 ? '' : 's'}; highest current score is ${maxChokepointScore}/100.`
    : 'Public route context has no modeled transit chokepoint for this corridor.';

  return {
    presetId: preset.id,
    label: preset.label,
    dataPosture: preset.dataPosture,
    originIso2: preset.originIso2,
    originLabel: preset.originLabel,
    destinationIso2: preset.destinationIso2,
    destinationLabel: preset.destinationLabel,
    hs2: preset.hs2,
    productLabel: preset.productLabel,
    cargoType: preset.cargoType,
    routeIds: preset.routeIds,
    chokepointIds: preset.chokepointIds,
    maxChokepointScore,
    materials,
    signalCategories,
    sourceNote: preset.sourceNote,
    freshnessLabel: preset.freshnessLabel,
    confidence,
    degradedStateCopy,
    marketContextCopy: 'Commodity and energy price signals are market context for this demo, not direct operational SCM evidence.',
    routeContextCopy: `${preset.originLabel} to ${preset.destinationLabel} ${preset.productLabel}: ${chokepointCopy}`,
  };
}

export function buildScmRouteMaterialContexts(
  chokepointScores?: Map<string, number>,
): ScmRouteMaterialContextSummary[] {
  return SCM_ROUTE_PRESETS.map(preset => buildScmRouteMaterialContext({ preset, chokepointScores }));
}
