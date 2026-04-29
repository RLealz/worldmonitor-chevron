import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  SCM_MATERIAL_MAPPINGS,
  SCM_ROUTE_PRESETS,
} from '../src/config/scm-route-presets.ts';
import {
  buildScmRouteMaterialContext,
  buildScmRouteMaterialContexts,
  getScmMaterialMapping,
  getScmRoutePreset,
  listScmRoutePresets,
} from '../src/utils/scm-route-material-context.ts';

function readProjectFile(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function assertPresetShape(preset) {
  assert.equal(preset.dataPosture, 'public_demo_corridor');
  assert.match(preset.id, /^demo-/);
  assert.equal(typeof preset.label, 'string');
  assert.ok(preset.label.includes('Demo'), 'preset label should be visibly demo-framed');
  assert.match(preset.originIso2, /^[A-Z]{2}$/);
  assert.match(preset.destinationIso2, /^[A-Z]{2}$/);
  assert.match(preset.hs2, /^\d{2}$/);
  assert.ok(['container', 'tanker', 'bulk', 'roro'].includes(preset.cargoType));
  assert.ok(preset.materialIds.length > 0, 'preset should link materials');
  assert.ok(preset.signalCategories.length > 0, 'preset should link signal categories');
  assert.equal(typeof preset.sourceNote.source, 'string');
  assert.ok(preset.sourceNote.source.length > 0);
  assert.equal(typeof preset.sourceNote.note, 'string');
  assert.ok(preset.sourceNote.note.length > 0);
  assert.equal(typeof preset.freshnessLabel, 'string');
  assert.ok(preset.freshnessLabel.length > 0);
  assert.ok(['high', 'medium', 'low'].includes(preset.confidence));
}

describe('SCM route and material context model', () => {
  it('defines public demo route presets with required route, material, source, and freshness fields', () => {
    assert.ok(SCM_ROUTE_PRESETS.length >= 4);
    const ids = new Set();
    for (const preset of SCM_ROUTE_PRESETS) {
      assertPresetShape(preset);
      assert.equal(ids.has(preset.id), false, `duplicate preset id ${preset.id}`);
      ids.add(preset.id);
    }
  });

  it('lists and looks up SCM route presets without mutating fixture shape', () => {
    const presets = listScmRoutePresets();
    assert.equal(presets.length, SCM_ROUTE_PRESETS.length);
    const gulf = getScmRoutePreset('demo-gulf-energy-feedstock');
    assert.ok(gulf);
    assert.equal(gulf.cargoType, 'tanker');
    assert.equal(gulf.hs2, '27');
  });

  it('returns high-confidence fuel context for HS chapter 27', () => {
    const mapping = getScmMaterialMapping('crude-refined-fuels');
    assert.equal(mapping.confidence, 'high');
    assert.equal(mapping.hs2, '27');
    assert.match(mapping.fallback.copy, /HS chapter 27/);

    const preset = getScmRoutePreset('demo-gulf-energy-feedstock');
    const summary = buildScmRouteMaterialContext({
      preset,
      chokepointScores: new Map([['hormuz_strait', 82], ['malacca_strait', 25]]),
    });

    assert.equal(summary.confidence, 'high');
    assert.equal(summary.maxChokepointScore, 82);
    assert.equal(summary.degradedStateCopy, null);
    assert.match(summary.routeContextCopy, /highest current score is 82\/100/);
    assert.match(summary.marketContextCopy, /market context/);
  });

  it('returns fallback copy for low-confidence material mappings', () => {
    const mapping = getScmMaterialMapping('process-chemicals');
    assert.equal(mapping.confidence, 'low');
    assert.match(mapping.fallback.copy, /do not support a precise product mapping/i);

    const preset = getScmRoutePreset('demo-process-chemicals');
    const summary = buildScmRouteMaterialContext({ preset });

    assert.equal(summary.confidence, 'unavailable');
    assert.ok(summary.degradedStateCopy);
    assert.match(summary.degradedStateCopy, /do not support a precise product mapping/i);
  });

  it('returns unavailable fallback copy for unknown materials', () => {
    const mapping = getScmMaterialMapping('unknown-material-cobalt-compound');
    assert.equal(mapping.confidence, 'unavailable');
    assert.equal(mapping.hs2, null);
    assert.match(mapping.fallback.copy, /No defensible public HS\/product mapping/);
  });

  it('builds summaries that connect route, chokepoint, country, product, material, and market context', () => {
    const summaries = buildScmRouteMaterialContexts(new Map([['panama', 55], ['taiwan_strait', 35]]));
    const eastAsia = summaries.find(summary => summary.presetId === 'demo-east-asia-critical-inputs');
    assert.ok(eastAsia);
    assert.equal(eastAsia.originIso2, 'CN');
    assert.equal(eastAsia.destinationIso2, 'US');
    assert.equal(eastAsia.productLabel, 'Ores, slag and ash');
    assert.ok(eastAsia.chokepointIds.includes('panama'));
    assert.ok(eastAsia.materials.some(material => material.materialId === 'critical-battery-inputs'));
    assert.ok(eastAsia.signalCategories.includes('critical_minerals'));
    assert.match(eastAsia.marketContextCopy, /not direct operational SCM evidence/);
  });

  it('distinguishes unavailable public route upstreams from absence of operational risk', () => {
    const preset = getScmRoutePreset('demo-north-american-equipment');
    const summary = buildScmRouteMaterialContext({
      preset,
      routeAvailability: 'unavailable',
    });

    assert.equal(summary.confidence, 'low');
    assert.match(summary.degradedStateCopy, /Public route upstream unavailable/);
    assert.match(summary.degradedStateCopy, /no operational absence of risk is implied/);
  });
});

describe('SCM route and material guardrails', () => {
  it('keeps material mappings confidence-scored with fallback copy', () => {
    assert.ok(SCM_MATERIAL_MAPPINGS.length >= 5);
    for (const mapping of SCM_MATERIAL_MAPPINGS) {
      assert.ok(['high', 'medium', 'low', 'unavailable'].includes(mapping.confidence));
      assert.equal(typeof mapping.fallback.copy, 'string');
      assert.ok(mapping.fallback.copy.length > 0);
      if (mapping.confidence === 'low' || mapping.confidence === 'unavailable') {
        assert.match(mapping.fallback.copy, /public|demo|defensible|precise/i);
      }
    }
  });

  it('does not add private-data-shaped fields to public presets', () => {
    const bannedFields = [
      'supplierRoster',
      'shipmentId',
      'vesselNomination',
      'contractId',
      'inventoryLevel',
      'price',
      'facilityId',
      'customerRoute',
    ];

    for (const preset of SCM_ROUTE_PRESETS) {
      for (const field of bannedFields) {
        assert.equal(Object.hasOwn(preset, field), false, `${preset.id} includes ${field}`);
      }
    }
  });

  it('does not introduce private route claims or false-precision material wording', () => {
    const sources = [
      '../src/types/scm-route-materials.ts',
      '../src/config/scm-route-presets.ts',
      '../src/utils/scm-route-material-context.ts',
    ];
    const text = sources
      .filter(path => existsSync(new URL(path, import.meta.url)))
      .map(path => readProjectFile(path))
      .join('\n');
    const banned = [
      new RegExp(`Chevron ${'uses'}`, 'i'),
      new RegExp(`Chevron-${'owned route'}`, 'i'),
      new RegExp(`real Chevron ${'supplier'}`, 'i'),
      new RegExp(`supplier ${'roster'}`, 'i'),
      new RegExp(`shipment ${'schedule'}`, 'i'),
      new RegExp(`vessel ${'nomination'}`, 'i'),
      new RegExp(`contract ${'pricing'}`, 'i'),
      new RegExp(`facility-${'sensitive'}`, 'i'),
      new RegExp(`precise ${'customer material flow claim'}`, 'i'),
    ];

    for (const pattern of banned) {
      assert.doesNotMatch(text, pattern, `banned wording ${pattern}`);
    }
  });
});
