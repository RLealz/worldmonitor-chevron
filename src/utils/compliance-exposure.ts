import type { SupplierRiskArchetype } from '@/types/supplier-risk';
import type {
  ComplianceExposureConfidence,
  ComplianceExposureDataPosture,
  ComplianceExposureEvidence,
  ComplianceExposureInputs,
  ComplianceExposureLevel,
  ComplianceExposureSignal,
  ComplianceExposureSummary,
} from '@/types/compliance-exposure';

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_AFTER_MS = 45 * DAY_MS;
const DEFAULT_NOW = '2026-04-28T00:00:00.000Z';
const DATA_POSTURE: ComplianceExposureDataPosture = 'public_screening_signal';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseTime(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIso(value: string | Date | null | undefined, fallback: string): string {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (typeof value === 'string' && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : value;
  }
  return fallback;
}

function dateLabel(value: string): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value || 'public source date unavailable';
  return new Date(parsed).toISOString().slice(0, 10);
}

function isStale(timestamp: string, now: string): boolean {
  const ts = parseTime(timestamp);
  const current = parseTime(now);
  if (!ts || !current) return true;
  return current - ts > STALE_AFTER_MS;
}

function confidenceFromScore(score: number): ComplianceExposureConfidence {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

function levelFromScore(score: number, evidence: ComplianceExposureEvidence[]): ComplianceExposureLevel {
  if (!evidence.length) return 'unknown';
  if (score >= 70) return 'critical';
  if (score >= 40) return 'elevated';
  if (score >= 20) return 'guarded';
  return 'low';
}

function evidence(params: {
  signal: ComplianceExposureSignal;
  source: string;
  timestamp: string;
  confidence: ComplianceExposureConfidence;
  reason: string;
  severity?: number;
  sourceName?: string;
  sourceList?: string;
  sourceUrl?: string;
}): ComplianceExposureEvidence {
  return {
    signal: params.signal,
    source: params.source,
    sourceName: params.sourceName,
    sourceList: params.sourceList,
    sourceUrl: params.sourceUrl,
    timestamp: params.timestamp,
    dateLabel: dateLabel(params.timestamp),
    confidence: params.confidence,
    reason: params.reason,
    severity: params.severity ?? 0,
  };
}

function sameText(a: string | undefined, b: string | undefined): boolean {
  return Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());
}

function containsText(haystack: string | undefined, needle: string | undefined): boolean {
  return Boolean(haystack && needle && haystack.toLowerCase().includes(needle.toLowerCase()));
}

function countryMatches(value: string | undefined, archetype: SupplierRiskArchetype): boolean {
  return sameText(value, archetype.exporterIso2)
    || sameText(value, archetype.importerIso2)
    || sameText(value, archetype.exporterLabel)
    || sameText(value, archetype.importerLabel);
}

function productMatches(value: string | undefined, archetype: SupplierRiskArchetype): boolean {
  if (!value) return false;
  return containsText(value, archetype.hs2)
    || containsText(value, archetype.productLabel)
    || archetype.materials.some(material => containsText(value, material));
}

function archetypeContext(archetype: SupplierRiskArchetype): ComplianceExposureSummary['contextLinks'] {
  return [
    { kind: 'supplier_archetype', id: archetype.id, label: archetype.label },
    { kind: 'country', id: archetype.exporterIso2, label: archetype.exporterLabel },
    { kind: 'country', id: archetype.importerIso2, label: archetype.importerLabel },
    { kind: 'product', id: `HS${archetype.hs2}`, label: archetype.productLabel },
    ...archetype.materials.map(material => ({ kind: 'material' as const, id: material.toLowerCase(), label: material })),
  ];
}

function latestCountryPressure(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const fallbackTimestamp = toIso(input.sanctionsPressure?.fetchedAt, input.now ?? DEFAULT_NOW);
  const datasetTimestamp = toIso(input.sanctionsPressure?.datasetDate, fallbackTimestamp);
  const countries = input.sanctionsPressure?.countries ?? [];
  return countries
    .filter(country => countryMatches(country.countryCode, archetype) || countryMatches(country.countryName, archetype))
    .map(country => {
      const vesselAircraft = (country.vesselCount ?? 0) + (country.aircraftCount ?? 0);
      const severity = clamp(18 + Math.min(country.entryCount, 50) + (country.newEntryCount ?? 0) * 2 + vesselAircraft, 18, 58);
      return evidence({
        signal: 'sanctions_country',
        source: 'OFAC public sanctions pressure',
        sourceName: 'OFAC sanctions lists',
        sourceList: 'SDN and Consolidated public lists',
        timestamp: datasetTimestamp,
        confidence: datasetTimestamp === fallbackTimestamp && !input.sanctionsPressure?.datasetDate ? 'medium' : 'high',
        severity,
        reason: `${country.countryName || country.countryCode} has ${country.entryCount} public sanctions designations in the current pressure feed.`,
      });
    });
}

function entityLookupEvidence(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const lookups = input.entityLookups ?? [];
  return lookups.flatMap(lookup => {
    const timestamp = toIso(lookup.fetchedAt, input.now ?? DEFAULT_NOW);
    return lookup.results
      .filter(result => result.countryCodes.some(code => countryMatches(code, archetype)) || containsText(result.name, archetype.exporterLabel))
      .slice(0, 3)
      .map(result => evidence({
        signal: 'sanctions_entity_lookup',
        source: `Public sanctions entity lookup (${lookup.source || 'public source'})`,
        sourceName: lookup.source || 'public sanctions lookup',
        sourceList: result.programs[0] || 'public sanctions entity index',
        timestamp,
        confidence: 'medium',
        severity: result.entityType === 'vessel' || result.entityType === 'aircraft' ? 34 : 28,
        reason: `Demo lookup "${lookup.query}" returned public ${result.entityType || 'entity'} signal "${result.name}" linked by country/program context only.`,
      }));
  });
}

function tradeRestrictionEvidence(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const fetchedAt = input.trade?.restrictions?.fetchedAt ?? input.now ?? DEFAULT_NOW;
  return (input.trade?.restrictions?.restrictions ?? [])
    .filter(item => countryMatches(item.reportingCountry, archetype) || countryMatches(item.affectedCountry, archetype) || productMatches(item.productSector, archetype))
    .map(item => evidence({
      signal: 'trade_restriction',
      source: 'Public trade restriction feed',
      sourceName: item.measureType || 'trade restriction',
      sourceUrl: item.sourceUrl,
      timestamp: toIso(item.notifiedAt, fetchedAt),
      confidence: item.notifiedAt ? 'high' : 'medium',
      severity: item.status === 'high' ? 38 : item.status === 'moderate' ? 28 : 18,
      reason: `${item.reportingCountry} ${item.measureType || 'trade measure'} public signal affects ${item.affectedCountry || 'reported counterpart'}${item.productSector ? ` for ${item.productSector}` : ''}.`,
    }));
}

function tradeBarrierEvidence(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const fetchedAt = input.trade?.barriers?.fetchedAt ?? input.now ?? DEFAULT_NOW;
  return (input.trade?.barriers?.barriers ?? [])
    .filter(item => countryMatches(item.notifyingCountry, archetype) || productMatches(item.productDescription, archetype))
    .map(item => evidence({
      signal: 'trade_barrier',
      source: 'Public trade barrier feed',
      sourceName: item.measureType || 'trade barrier',
      sourceUrl: item.sourceUrl,
      timestamp: toIso(item.dateDistributed, fetchedAt),
      confidence: item.dateDistributed ? 'high' : 'medium',
      severity: item.status?.toLowerCase().includes('active') ? 30 : 20,
      reason: `${item.notifyingCountry} public barrier notice${item.title ? ` "${item.title}"` : ''} is relevant to the country/product context.`,
    }));
}

function tariffEvidence(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const tariff = input.trade?.tariffs;
  if (!tariff?.effectiveTariffRate && !tariff?.datapoints?.length) return [];
  const effective = tariff.effectiveTariffRate;
  const latest = [...(tariff.datapoints ?? [])]
    .filter(point => countryMatches(point.reportingCountry, archetype) || countryMatches(point.partnerCountry, archetype) || productMatches(point.productSector, archetype))
    .sort((a, b) => b.year - a.year)[0];
  if (!effective && !latest) return [];
  const rate = effective?.tariffRate ?? latest?.tariffRate ?? 0;
  return [evidence({
    signal: 'tariff',
    source: 'Public tariff context',
    sourceName: effective?.sourceName || 'WTO MFN/effective tariff public data',
    sourceUrl: effective?.sourceUrl,
    timestamp: toIso(effective?.updatedAt, tariff.fetchedAt ?? (latest ? `${latest.year}-12-31T00:00:00.000Z` : input.now ?? DEFAULT_NOW)),
    confidence: effective?.updatedAt || latest ? 'medium' : 'low',
    severity: rate >= 20 ? 26 : rate >= 10 ? 18 : 10,
    reason: `Public tariff context shows ${rate.toFixed(1)}% rate${effective?.observationPeriod ? ` for ${effective.observationPeriod}` : ''}.`,
  })];
}

function flowEvidence(input: ComplianceExposureInputs, archetype: SupplierRiskArchetype): ComplianceExposureEvidence[] {
  const flowInputs = [
    ...(input.trade?.flows?.flows ?? []).map(flow => ({ flow, timestamp: input.trade?.flows?.fetchedAt, source: 'Public trade-flow feed' })),
    ...(input.trade?.comtrade?.flows ?? []).map(flow => ({ flow, timestamp: input.trade?.comtrade?.fetchedAt, source: 'UN Comtrade public flow feed' })),
  ];
  return flowInputs
    .filter(({ flow }) => countryMatches(flow.reportingCountry || flow.reporterName, archetype)
      || countryMatches(flow.partnerCountry || flow.partnerName, archetype)
      || productMatches(flow.productSector || flow.cmdDesc || flow.cmdCode, archetype))
    .map(({ flow, timestamp, source }) => {
      const yoy = flow.yoyChange ?? flow.yoyExportChange ?? flow.yoyImportChange ?? 0;
      return evidence({
        signal: 'trade_flow',
        source,
        sourceName: flow.cmdDesc || flow.productSector || 'trade flow',
        timestamp: toIso(timestamp, flow.year ? `${flow.year}-12-31T00:00:00.000Z` : input.now ?? DEFAULT_NOW),
        confidence: flow.year ? 'medium' : 'low',
        severity: flow.isAnomaly || Math.abs(yoy) >= 30 ? 22 : 8,
        reason: `Public trade-flow context${flow.isAnomaly ? ' flags an anomaly' : ''}${Number.isFinite(yoy) ? ` with ${yoy.toFixed(1)}% year-over-year change` : ''}.`,
      });
    });
}

export function buildComplianceExposureSummary(
  archetype: SupplierRiskArchetype,
  inputs: ComplianceExposureInputs = {},
): ComplianceExposureSummary {
  const now = inputs.now ?? DEFAULT_NOW;
  const evidenceItems: ComplianceExposureEvidence[] = [];
  const reasons: string[] = [];
  const staleSignals: ComplianceExposureSignal[] = [];
  let score = 0;
  let confidenceScore = 38;

  evidenceItems.push(evidence({
    signal: 'country_product',
    source: 'Public SCM supplier archetype',
    sourceName: 'synthetic public country/product context',
    timestamp: now,
    confidence: 'medium',
    severity: 0,
    reason: `${archetype.label} links ${archetype.exporterLabel} to ${archetype.importerLabel} for HS${archetype.hs2} ${archetype.productLabel}.`,
  }));
  confidenceScore += 8;

  for (const item of [
    ...latestCountryPressure(inputs, archetype),
    ...entityLookupEvidence(inputs, archetype),
    ...tradeRestrictionEvidence(inputs, archetype),
    ...tradeBarrierEvidence(inputs, archetype),
    ...tariffEvidence(inputs, archetype),
    ...flowEvidence(inputs, archetype),
  ]) {
    evidenceItems.push(item);
    score += item.severity;
    confidenceScore += item.confidence === 'high' ? 10 : item.confidence === 'medium' ? 6 : 0;
    reasons.push(item.reason);
  }

  if (evidenceItems.length === 1) {
    reasons.push('No current public sanctions or trade-control screening signal matched this demo context.');
    confidenceScore -= 8;
  }

  for (const item of evidenceItems) {
    if (isStale(item.timestamp, now)) {
      staleSignals.push(item.signal);
    }
  }
  if (staleSignals.length) {
    score += 6;
    confidenceScore -= 18;
    evidenceItems.push(evidence({
      signal: 'freshness',
      source: 'Public source freshness check',
      sourceName: 'freshness check',
      timestamp: now,
      confidence: 'low',
      severity: 6,
      reason: `Stale or missing public source dates detected for ${[...new Set(staleSignals)].join(', ')}.`,
    }));
    reasons.push(`Public source provenance is stale or incomplete for ${[...new Set(staleSignals)].join(', ')}.`);
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  const finalConfidenceScore = clamp(Math.round(confidenceScore), 0, 100);

  return {
    id: `compliance-${archetype.id}`,
    label: `${archetype.label} screening exposure`,
    dataPosture: DATA_POSTURE,
    level: levelFromScore(finalScore, evidenceItems),
    score: finalScore,
    confidence: confidenceFromScore(finalConfidenceScore),
    confidenceScore: finalConfidenceScore,
    supplierArchetypeId: archetype.id,
    supplierArchetypeLabel: archetype.label,
    exporterIso2: archetype.exporterIso2,
    exporterLabel: archetype.exporterLabel,
    importerIso2: archetype.importerIso2,
    importerLabel: archetype.importerLabel,
    hs2: archetype.hs2,
    productLabel: archetype.productLabel,
    materials: archetype.materials,
    routeIds: [],
    contextLinks: archetypeContext(archetype),
    evidence: evidenceItems,
    reasons,
    staleSignals: [...new Set(staleSignals)],
    generatedAt: now,
  };
}

export function buildComplianceExposureSummaries(
  archetypes: SupplierRiskArchetype[],
  inputs: ComplianceExposureInputs = {},
): ComplianceExposureSummary[] {
  return archetypes
    .map(archetype => buildComplianceExposureSummary(archetype, inputs))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}
