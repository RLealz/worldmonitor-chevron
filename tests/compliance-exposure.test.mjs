import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  buildComplianceExposureSummary,
  buildComplianceExposureSummaries,
} from '../src/utils/compliance-exposure.ts';
import { PUBLIC_SUPPLIER_RISK_ARCHETYPES } from '../src/config/supplier-risk-archetypes.ts';

const NOW = '2026-04-28T00:00:00.000Z';

function archetype(id) {
  const item = PUBLIC_SUPPLIER_RISK_ARCHETYPES.find(candidate => candidate.id === id);
  assert.ok(item, `missing archetype ${id}`);
  return item;
}

function assertEvidenceShape(summary) {
  assert.ok(summary.evidence.length >= 1, 'expected public evidence');
  for (const item of summary.evidence) {
    assert.equal(typeof item.source, 'string');
    assert.ok(item.source.length > 0, 'source is required');
    assert.equal(typeof item.timestamp, 'string');
    assert.ok(item.timestamp.length > 0, 'timestamp is required');
    assert.equal(typeof item.dateLabel, 'string');
    assert.ok(item.dateLabel.length > 0, 'date label is required');
    assert.ok(['high', 'medium', 'low'].includes(item.confidence), 'confidence is required');
    assert.equal(typeof item.reason, 'string');
    assert.ok(item.reason.length > 0, 'reason is required');
  }
}

function textOf(value) {
  return JSON.stringify(value).toLowerCase();
}

describe('public compliance exposure model', () => {
  it('raises exposure for a public sanctions country signal with provenance', () => {
    const summary = buildComplianceExposureSummary(archetype('east-asia-battery-materials-archetype'), {
      now: NOW,
      sanctionsPressure: {
        fetchedAt: '2026-04-27T00:00:00.000Z',
        datasetDate: '2026-04-26T00:00:00.000Z',
        countries: [{ countryCode: 'CN', countryName: 'China', entryCount: 42, newEntryCount: 2 }],
      },
    });

    assert.ok(['elevated', 'critical'].includes(summary.level), `unexpected level ${summary.level}`);
    assert.equal(summary.dataPosture, 'public_screening_signal');
    assert.ok(summary.evidence.some(item => item.signal === 'sanctions_country' && item.sourceList));
    assertEvidenceShape(summary);
  });

  it('represents public entity lookup evidence without private supplier matching', () => {
    const summary = buildComplianceExposureSummary(archetype('gulf-feedstock-archetype'), {
      now: NOW,
      entityLookups: [{
        query: 'demo vessel',
        source: 'opensanctions',
        fetchedAt: '2026-04-27T00:00:00.000Z',
        results: [{
          id: 'opensanctions:demo',
          name: 'Demo Public Vessel',
          entityType: 'vessel',
          countryCodes: ['SA'],
          programs: ['PUBLIC-PROGRAM'],
        }],
      }],
    });

    assert.ok(summary.evidence.some(item => item.signal === 'sanctions_entity_lookup'));
    assert.ok(summary.reasons.some(reason => reason.includes('country/program context only')));
    assert.doesNotMatch(textOf(summary), /customer-private/);
    assertEvidenceShape(summary);
  });

  it('raises exposure for public trade restriction and barrier context', () => {
    const summary = buildComplianceExposureSummary(archetype('east-asia-battery-materials-archetype'), {
      now: NOW,
      trade: {
        restrictions: {
          fetchedAt: '2026-04-27T00:00:00.000Z',
          restrictions: [{
            reportingCountry: 'United States',
            affectedCountry: 'China',
            productSector: 'Electrical and battery inputs',
            measureType: 'Import restriction',
            status: 'high',
            notifiedAt: '2026-04-20',
            sourceUrl: 'https://example.test/public-trade',
          }],
        },
        barriers: {
          fetchedAt: '2026-04-27T00:00:00.000Z',
          barriers: [{
            notifyingCountry: 'China',
            title: 'Battery input notice',
            productDescription: 'graphite battery materials',
            measureType: 'technical barrier',
            status: 'active',
            dateDistributed: '2026-04-18',
          }],
        },
      },
    });

    assert.ok(['elevated', 'critical'].includes(summary.level), `unexpected level ${summary.level}`);
    assert.ok(summary.evidence.some(item => item.signal === 'trade_restriction'));
    assert.ok(summary.evidence.some(item => item.signal === 'trade_barrier'));
    assertEvidenceShape(summary);
  });

  it('combines sanctions, tariff, and trade-flow exposure without finality language', () => {
    const summaries = buildComplianceExposureSummaries(PUBLIC_SUPPLIER_RISK_ARCHETYPES, {
      now: NOW,
      sanctionsPressure: {
        fetchedAt: '2026-04-27T00:00:00.000Z',
        datasetDate: '2026-04-26T00:00:00.000Z',
        countries: [{ countryCode: 'CN', countryName: 'China', entryCount: 20 }],
      },
      trade: {
        tariffs: {
          fetchedAt: '2026-04-27T00:00:00.000Z',
          effectiveTariffRate: {
            sourceName: 'Public effective tariff source',
            observationPeriod: '2026-Q1',
            updatedAt: '2026-04-15',
            tariffRate: 22,
          },
          datapoints: [{ reportingCountry: 'United States', partnerCountry: 'China', productSector: 'Electrical', year: 2026, tariffRate: 8 }],
        },
        comtrade: {
          fetchedAt: '2026-04-27T00:00:00.000Z',
          flows: [{ reporterName: 'China', partnerName: 'United States', cmdCode: '85', cmdDesc: 'Electrical inputs', year: 2026, yoyChange: -36, isAnomaly: true }],
        },
      },
    });

    assert.ok(summaries[0].score >= summaries[1].score);
    assert.ok(summaries[0].evidence.some(item => item.signal === 'tariff'));
    assert.ok(summaries[0].evidence.some(item => item.signal === 'trade_flow'));
    assert.doesNotMatch(textOf(summaries), /cleared|approved|compliant|violation|final legal/);
  });

  it('penalizes stale or missing public provenance instead of implying certainty', () => {
    const summary = buildComplianceExposureSummary(archetype('north-american-equipment-archetype'), {
      now: NOW,
      trade: {
        restrictions: {
          fetchedAt: '2026-01-01T00:00:00.000Z',
          restrictions: [{
            reportingCountry: 'Canada',
            affectedCountry: 'United States',
            productSector: 'Industrial machinery',
            measureType: 'Monitoring notice',
            status: 'moderate',
          }],
        },
      },
    });

    assert.notEqual(summary.confidence, 'high');
    assert.ok(summary.staleSignals.includes('trade_restriction'));
    assert.ok(summary.evidence.some(item => item.signal === 'freshness' && item.confidence === 'low'));
    assertEvidenceShape(summary);
  });

  it('keeps low coverage as public screening context, not a clearance conclusion', () => {
    const summary = buildComplianceExposureSummary(archetype('low-coverage-archetype'), { now: NOW });

    assert.equal(summary.level, 'low');
    assert.equal(summary.dataPosture, 'public_screening_signal');
    assert.ok(summary.reasons.some(reason => reason.includes('No current public sanctions or trade-control screening signal')));
    assert.doesNotMatch(textOf(summary), /cleared|approved|compliant|prohibited|violation/);
    assertEvidenceShape(summary);
  });
});

describe('compliance exposure demo-safety guardrails', () => {
  it('does not introduce private SCM or legal-finality wording in new files', () => {
    const sources = [
      '../src/types/compliance-exposure.ts',
      '../src/utils/compliance-exposure.ts',
      '../tests/compliance-exposure.test.mjs',
    ];
    const text = sources
      .filter(path => existsSync(new URL(path, import.meta.url)))
      .map(path => readFileSync(new URL(path, import.meta.url), 'utf8'))
      .join('\n');
    const banned = [
      new RegExp(`${'real'} Chevron ${'supplier'}`, 'i'),
      new RegExp(`${'internal'} ${'route'}`, 'i'),
      new RegExp(`${'shipment'} ${'schedule'}`, 'i'),
      new RegExp(`${'contract'} ${'pricing'}`, 'i'),
      new RegExp(`${'inventory'} ${'level'}`, 'i'),
      new RegExp(`${'site'}-${'sensitive'}`, 'i'),
      new RegExp(`${'legally'} ${'prohibited'}`, 'i'),
      new RegExp(`${'final'} ${'determination'}`, 'i'),
    ];

    for (const pattern of banned) {
      assert.doesNotMatch(text, pattern, `banned wording ${pattern}`);
    }
  });
});
