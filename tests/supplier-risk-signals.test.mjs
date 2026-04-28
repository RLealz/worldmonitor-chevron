import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  buildSupplierRiskSummary,
  buildSupplierRiskSummaries,
} from '../src/utils/supplier-risk-signals.ts';
import { PUBLIC_SUPPLIER_RISK_ARCHETYPES } from '../src/config/supplier-risk-archetypes.ts';

const NOW = '2026-04-28T00:00:00.000Z';
const FRESH = {
  countryProduct: '2026-04-27T00:00:00.000Z',
  routeChokepoint: '2026-04-27T00:00:00.000Z',
  sanctionsTrade: '2026-04-27T00:00:00.000Z',
  materials: '2026-04-27T00:00:00.000Z',
};

function archetype(id) {
  const item = PUBLIC_SUPPLIER_RISK_ARCHETYPES.find(candidate => candidate.id === id);
  assert.ok(item, `missing archetype ${id}`);
  return item;
}

function assertEvidenceShape(summary) {
  assert.ok(summary.evidence.length >= 4, 'expected public evidence items');
  for (const item of summary.evidence) {
    assert.equal(typeof item.source, 'string');
    assert.ok(item.source.length > 0, 'evidence source is required');
    assert.equal(typeof item.timestamp, 'string');
    assert.ok(item.timestamp.length > 0, 'evidence timestamp is required');
    assert.match(item.timestamp, /^\d{4}-\d{2}-\d{2}T/, 'evidence timestamp must be ISO-like');
    assert.ok(['high', 'medium', 'low'].includes(item.confidence), 'evidence confidence is required');
    assert.equal(typeof item.reason, 'string');
    assert.ok(item.reason.length > 0, 'evidence reason is required');
  }
}

describe('supplier risk signal model', () => {
  it('marks a stable public archetype as low risk with high confidence', () => {
    const summary = buildSupplierRiskSummary(archetype('north-american-equipment-archetype'), {
      chokepointScores: new Map([['hormuz_strait', 90], ['suez', 80]]),
      sourceTimestamps: FRESH,
      now: NOW,
    });

    assert.equal(summary.level, 'low');
    assert.equal(summary.confidence, 'high');
    assert.equal(summary.dataPosture, 'synthetic_archetype');
    assertEvidenceShape(summary);
    assert.ok(summary.reasons.some(reason => reason.includes('no disrupted transit chokepoints')));
  });

  it('raises risk for a public sanctions or trade-control screening hit', () => {
    const summary = buildSupplierRiskSummary(archetype('east-asia-battery-materials-archetype'), {
      chokepointScores: new Map(),
      sanctionsCountryIso2s: new Set(['CN']),
      tradeRestrictedCountryIso2s: new Set(['CN']),
      materialRiskLabels: new Set(['graphite']),
      sourceTimestamps: FRESH,
      now: NOW,
    });

    assert.ok(['elevated', 'critical'].includes(summary.level), `unexpected level ${summary.level}`);
    assert.ok(summary.score >= 50);
    assert.ok(summary.evidence.some(item => item.signal === 'sanctions_trade'));
    assert.ok(summary.reasons.some(reason => reason.includes('screening risk')));
    assertEvidenceShape(summary);
  });

  it('raises risk when the public route model sees a disrupted chokepoint', () => {
    const summary = buildSupplierRiskSummary(archetype('gulf-feedstock-archetype'), {
      chokepointScores: new Map([['hormuz_strait', 85]]),
      sourceTimestamps: FRESH,
      now: NOW,
    });

    assert.ok(['elevated', 'critical'].includes(summary.level), `unexpected level ${summary.level}`);
    assert.equal(summary.maxDisruptionScore, 85);
    assert.ok(summary.transitChokepoints.some(cp => cp.chokepointId === 'hormuz_strait'));
    assert.ok(summary.evidence.some(item => item.signal === 'route_chokepoint' && item.reason.includes('Hormuz')));
    assertEvidenceShape(summary);
  });

  it('lowers confidence and explains stale public data', () => {
    const summary = buildSupplierRiskSummary(archetype('north-american-equipment-archetype'), {
      chokepointScores: new Map(),
      sourceTimestamps: {
        ...FRESH,
        routeChokepoint: '2026-03-01T00:00:00.000Z',
      },
      now: NOW,
    });

    assert.notEqual(summary.confidence, 'high');
    assert.ok(summary.staleSignals.includes('routeChokepoint'));
    assert.ok(summary.evidence.some(item => item.signal === 'freshness' && item.confidence === 'low'));
    assertEvidenceShape(summary);
  });

  it('keeps missing public coverage low-confidence instead of fabricating certainty', () => {
    const summary = buildSupplierRiskSummary(archetype('low-coverage-archetype'), {
      chokepointScores: new Map(),
      sourceTimestamps: {
        countryProduct: '2026-03-01T00:00:00.000Z',
        routeChokepoint: '2026-03-01T00:00:00.000Z',
        sanctionsTrade: '2026-03-01T00:00:00.000Z',
        materials: '2026-03-01T00:00:00.000Z',
      },
      now: NOW,
    });

    assert.equal(summary.confidence, 'low');
    assert.equal(summary.dataPosture, 'public_signal_summary');
    assert.ok(summary.reasons.some(reason => reason.includes('Route model coverage is incomplete')));
    assert.ok(summary.staleSignals.length >= 3);
    assertEvidenceShape(summary);
  });

  it('sorts supplier-risk summaries by risk score for scanning', () => {
    const summaries = buildSupplierRiskSummaries(PUBLIC_SUPPLIER_RISK_ARCHETYPES, {
      chokepointScores: new Map([['hormuz_strait', 85]]),
      sanctionsCountryIso2s: new Set(['CN']),
      materialRiskLabels: new Set(['graphite']),
      sourceTimestamps: FRESH,
      now: NOW,
    });

    assert.ok(summaries.length >= 3);
    for (let i = 1; i < summaries.length; i += 1) {
      assert.ok(summaries[i - 1].score >= summaries[i].score, 'summaries should be sorted by risk score');
    }
  });

  it('keeps public demo archetypes synthetic and free of private-data-shaped fields', () => {
    const allowedPostures = new Set(['synthetic_archetype', 'public_signal_summary']);
    for (const item of PUBLIC_SUPPLIER_RISK_ARCHETYPES) {
      assert.ok(allowedPostures.has(item.dataPosture));
      assert.equal(Object.hasOwn(item, 'contractId'), false);
      assert.equal(Object.hasOwn(item, 'shipmentId'), false);
      assert.equal(Object.hasOwn(item, 'facilityId'), false);
      assert.equal(Object.hasOwn(item, 'inventoryLevel'), false);
      assert.equal(Object.hasOwn(item, 'price'), false);
    }
  });
});

describe('supplier risk demo-safety guardrails', () => {
  it('does not introduce customer-private SCM fixture wording', () => {
    const sources = [
      '../src/types/supplier-risk.ts',
      '../src/utils/supplier-risk-signals.ts',
      '../src/config/supplier-risk-archetypes.ts',
      '../src/components/SupplierRiskPanel.ts',
      '../src/config/panels.ts',
      '../src/config/variants/scm.ts',
    ];
    const text = sources
      .filter(path => existsSync(new URL(path, import.meta.url)))
      .map(path => readFileSync(new URL(path, import.meta.url), 'utf8'))
      .join('\n');
    const banned = [
      /real Chevron supplier/i,
      /internal route/i,
      /contract pricing/i,
      /shipment schedule/i,
      /supplier roster/i,
      /operational secret/i,
    ];

    for (const pattern of banned) {
      assert.doesNotMatch(text, pattern, `banned private-data wording ${pattern}`);
    }
  });
});
