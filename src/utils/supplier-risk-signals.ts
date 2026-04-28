import type {
  SupplierRiskArchetype,
  SupplierRiskConfidence,
  SupplierRiskEvidence,
  SupplierRiskSignalInputs,
  SupplierRiskSourceTimestamps,
  SupplierRiskSummary,
  SupplierRiskLevel,
} from '@/types/supplier-risk';
import { computeSupplierRouteRisk } from '@/utils/supplier-route-risk';
import type { ChokepointScoreMap } from '@/utils/supplier-route-risk';

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_AFTER_MS = 14 * DAY_MS;

const DEFAULT_NOW = '2026-04-28T00:00:00.000Z';

const DEFAULT_SOURCE_TIMESTAMPS: Required<SupplierRiskSourceTimestamps> = {
  countryProduct: '2026-04-27T00:00:00.000Z',
  routeChokepoint: '2026-04-27T00:00:00.000Z',
  sanctionsTrade: '2026-04-27T00:00:00.000Z',
  materials: '2026-04-27T00:00:00.000Z',
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function confidenceFromScore(score: number): SupplierRiskConfidence {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

function levelFromScore(score: number, evidence: SupplierRiskEvidence[]): SupplierRiskLevel {
  if (!evidence.length) return 'unknown';
  if (score >= 70) return 'critical';
  if (score >= 40) return 'elevated';
  if (score >= 20) return 'guarded';
  return 'low';
}

function parseTime(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isStale(timestamp: string, now: string): boolean {
  const ts = parseTime(timestamp);
  const current = parseTime(now);
  if (!ts || !current) return true;
  return current - ts > STALE_AFTER_MS;
}

function evidence(
  signal: SupplierRiskEvidence['signal'],
  source: string,
  timestamp: string,
  confidence: SupplierRiskConfidence,
  reason: string,
): SupplierRiskEvidence {
  return { signal, source, timestamp, confidence, reason };
}

function sourceTimestamps(input?: SupplierRiskSourceTimestamps): Required<SupplierRiskSourceTimestamps> {
  return {
    ...DEFAULT_SOURCE_TIMESTAMPS,
    ...input,
  };
}

function materialMatches(archetype: SupplierRiskArchetype, riskyMaterials: Set<string>): string[] {
  const normalized = new Map([...riskyMaterials].map(label => [label.toLowerCase(), label]));
  return archetype.materials
    .filter(label => normalized.has(label.toLowerCase()))
    .map(label => normalized.get(label.toLowerCase()) ?? label);
}

export function buildSupplierRiskSummary(
  archetype: SupplierRiskArchetype,
  inputs: SupplierRiskSignalInputs = {},
): SupplierRiskSummary {
  const now = inputs.now ?? DEFAULT_NOW;
  const timestamps = sourceTimestamps(inputs.sourceTimestamps);
  const scores: ChokepointScoreMap = inputs.chokepointScores ?? new Map();
  const routeRisk = computeSupplierRouteRisk(archetype.exporterIso2, archetype.importerIso2, scores);
  const evidenceItems: SupplierRiskEvidence[] = [];
  const reasons: string[] = [];
  const staleSignals: string[] = [];
  let score = 0;
  let confidenceScore = 40;

  evidenceItems.push(evidence(
    'country_product',
    'Public country/product exposure archetype',
    timestamps.countryProduct,
    'medium',
    `${archetype.exporterLabel} to ${archetype.importerLabel} ${archetype.productLabel} exposure is a synthetic public-signal archetype.`,
  ));
  confidenceScore += 10;

  if (routeRisk.riskLevel === 'critical') {
    score += 45;
    reasons.push(`Route disruption critical: ${routeRisk.recommendation}`);
  } else if (routeRisk.riskLevel === 'at_risk') {
    score += 24;
    reasons.push(`Route disruption elevated: ${routeRisk.recommendation}`);
  } else if (routeRisk.riskLevel === 'unknown') {
    score += 8;
    confidenceScore -= 18;
    reasons.push('Route model coverage is incomplete for this public exporter/importer pair.');
  } else {
    reasons.push('Route model shows no disrupted transit chokepoints above the guarded threshold.');
  }
  evidenceItems.push(evidence(
    'route_chokepoint',
    'WorldMonitor public route/chokepoint model',
    timestamps.routeChokepoint,
    routeRisk.riskLevel === 'unknown' ? 'low' : 'medium',
    routeRisk.recommendation,
  ));
  confidenceScore += routeRisk.riskLevel === 'unknown' ? 0 : 14;

  const sanctionsHit = inputs.sanctionsCountryIso2s?.has(archetype.exporterIso2) ?? false;
  const tradeHit = inputs.tradeRestrictedCountryIso2s?.has(archetype.exporterIso2) ?? false;
  if (sanctionsHit || tradeHit) {
    const reasonParts = [
      sanctionsHit ? 'public sanctions pressure' : '',
      tradeHit ? 'public trade restriction signal' : '',
    ].filter(Boolean);
    score += sanctionsHit && tradeHit ? 42 : sanctionsHit ? 35 : 24;
    reasons.push(`${reasonParts.join(' and ')} raised supplier-screening risk.`);
    evidenceItems.push(evidence(
      'sanctions_trade',
      'Public sanctions and trade-control signal',
      timestamps.sanctionsTrade,
      'medium',
      `${reasonParts.join(' and ')} applies to ${archetype.exporterLabel}; this is a screening signal, not a legal determination.`,
    ));
    confidenceScore += 12;
  } else {
    evidenceItems.push(evidence(
      'sanctions_trade',
      'Public sanctions and trade-control signal',
      timestamps.sanctionsTrade,
      'medium',
      `No configured public sanctions or trade-control hit for ${archetype.exporterLabel}.`,
    ));
    confidenceScore += 8;
  }

  const matchedMaterials = materialMatches(archetype, inputs.materialRiskLabels ?? new Set());
  if (matchedMaterials.length) {
    score += 15;
    reasons.push(`Energy material watchlist overlap: ${matchedMaterials.join(', ')}.`);
    evidenceItems.push(evidence(
      'materials',
      'Public energy materials relevance signal',
      timestamps.materials,
      'medium',
      `${archetype.label} includes material exposure to ${matchedMaterials.join(', ')}.`,
    ));
    confidenceScore += 8;
  } else {
    evidenceItems.push(evidence(
      'materials',
      'Public energy materials relevance signal',
      timestamps.materials,
      archetype.materials.length ? 'medium' : 'low',
      archetype.materials.length
        ? `Tracked materials: ${archetype.materials.join(', ')}.`
        : 'No material mapping is assigned to this public archetype.',
    ));
    confidenceScore += archetype.materials.length ? 6 : -8;
  }

  const freshnessEntries: Array<[keyof Required<SupplierRiskSourceTimestamps>, string]> = [
    ['countryProduct', timestamps.countryProduct],
    ['routeChokepoint', timestamps.routeChokepoint],
    ['sanctionsTrade', timestamps.sanctionsTrade],
    ['materials', timestamps.materials],
  ];
  for (const [key, timestamp] of freshnessEntries) {
    if (isStale(timestamp, now)) {
      staleSignals.push(key);
    }
  }
  if (staleSignals.length) {
    score += 8;
    confidenceScore -= 20;
    reasons.push(`Public data freshness is stale for ${staleSignals.join(', ')}.`);
    evidenceItems.push(evidence(
      'freshness',
      'Public source freshness check',
      now,
      'low',
      `Stale public signal timestamps detected for ${staleSignals.join(', ')}.`,
    ));
  } else {
    evidenceItems.push(evidence(
      'freshness',
      'Public source freshness check',
      now,
      'high',
      'All configured public signal timestamps are within the freshness window.',
    ));
    confidenceScore += 8;
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  const finalConfidenceScore = clamp(Math.round(confidenceScore), 0, 100);

  return {
    id: archetype.id,
    label: archetype.label,
    dataPosture: archetype.dataPosture,
    level: levelFromScore(finalScore, evidenceItems),
    score: finalScore,
    confidence: confidenceFromScore(finalConfidenceScore),
    confidenceScore: finalConfidenceScore,
    exporterIso2: archetype.exporterIso2,
    exporterLabel: archetype.exporterLabel,
    importerIso2: archetype.importerIso2,
    importerLabel: archetype.importerLabel,
    hs2: archetype.hs2,
    productLabel: archetype.productLabel,
    materials: archetype.materials,
    routeIds: routeRisk.routeIds,
    transitChokepoints: routeRisk.transitChokepoints,
    maxDisruptionScore: routeRisk.maxDisruptionScore,
    evidence: evidenceItems,
    reasons,
    staleSignals,
    generatedAt: now,
  };
}

export function buildSupplierRiskSummaries(
  archetypes: SupplierRiskArchetype[],
  inputs: SupplierRiskSignalInputs = {},
): SupplierRiskSummary[] {
  return archetypes
    .map(archetype => buildSupplierRiskSummary(archetype, inputs))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

