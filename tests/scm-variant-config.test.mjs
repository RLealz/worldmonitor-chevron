import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const CONFIG_SRC = new URL('../src/config/', import.meta.url);
const COMPONENTS_SRC = new URL('../src/components/', import.meta.url);

const variantSource = readFileSync(new URL('variant.ts', CONFIG_SRC), 'utf8');
const variantMetaSource = readFileSync(new URL('variant-meta.ts', CONFIG_SRC), 'utf8');
const panelsSource = readFileSync(new URL('panels.ts', CONFIG_SRC), 'utf8');
const energyRiskOverviewSource = readFileSync(new URL('EnergyRiskOverviewPanel.ts', COMPONENTS_SRC), 'utf8');
const supplyChainPanelSource = readFileSync(new URL('SupplyChainPanel.ts', COMPONENTS_SRC), 'utf8');

function extractConstObjectBody(source, constName) {
  const marker = `const ${constName}`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `could not find ${constName}`);

  const assignment = source.indexOf('=', start);
  assert.notEqual(assignment, -1, `could not find assignment for ${constName}`);

  const braceStart = source.indexOf('{', assignment);
  assert.notEqual(braceStart, -1, `could not find opening brace for ${constName}`);

  let depth = 0;
  let inString = false;
  let stringQuote = '';

  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    const prev = source[i - 1];

    if (inString) {
      if (ch === stringQuote && prev !== '\\') {
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if (ch === '"' || ch === '\'' || ch === '`') {
      inString = true;
      stringQuote = ch;
      continue;
    }

    if (ch === '{') {
      depth += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart + 1, i);
      }
    }
  }

  throw new Error(`unterminated object literal for ${constName}`);
}

function extractObjectKeys(body) {
  const keys = [];
  for (const match of body.matchAll(/(?:['"]([^'"]+)['"]|(\w[\w-]*))\s*:/g)) {
    const key = match[1] || match[2];
    if (
      key &&
      ![
        'name',
        'enabled',
        'priority',
        'premium',
        'title',
        'description',
        'keywords',
        'url',
        'siteName',
        'shortName',
        'subject',
        'classification',
        'categories',
        'features',
      ].includes(key)
    ) {
      keys.push(key);
    }
  }
  return keys;
}

function extractBooleanMap(body) {
  return Object.fromEntries(
    [...body.matchAll(/(\w+):\s*(true|false)/g)].map(([, key, value]) => [key, value === 'true']),
  );
}

describe('SCM variant config guardrails', () => {
  it('registers scm across build, Tauri, localhost, and hostname paths', () => {
    assert.match(variantSource, /'scm',/, 'SUPPORTED_VARIANTS must include scm');
    assert.match(variantSource, /return import\.meta\.env\?\.VITE_VARIANT \|\| 'full';/, 'build variant path must read VITE_VARIANT');
    assert.match(variantSource, /const isTauri = '__TAURI_INTERNALS__' in window \|\| '__TAURI__' in window;/, 'Tauri variant path must exist');
    assert.match(variantSource, /const stored = localStorage\.getItem\('worldmonitor-variant'\);/, 'stored local variant path must exist');
    assert.match(variantSource, /if \(h\.startsWith\('scm\.'\)\) return 'scm';/, 'hostname routing must recognize scm subdomains');
    assert.match(variantSource, /if \(h === 'localhost' \|\| h === '127\.0\.0\.1'\)/, 'localhost routing must preserve scm selection');
  });

  it('frames SCM metadata as public-data, open-source, and demo-safe', () => {
    const scmMetaBody = extractConstObjectBody(variantMetaSource, 'VARIANT_META');
    assert.match(scmMetaBody, /scm:\s*\{/, 'VARIANT_META must define an scm entry');
    assert.match(variantMetaSource, /Public-data supply chain dashboard/, 'SCM metadata must describe public-data coverage');
    assert.match(variantMetaSource, /open source intelligence/, 'SCM metadata must reference open-source intelligence');
    assert.match(variantMetaSource, /Demo-safe operator briefing workspace/, 'SCM metadata must keep demo-safe framing');
    assert.doesNotMatch(variantMetaSource, /Chevron/i, 'SCM metadata must not imply Chevron-private access');
  });

  it('registers SCM panel defaults with the expected public demo panels', () => {
    const scmPanelsBody = extractConstObjectBody(panelsSource, 'SCM_PANELS');
    const scmPanelKeys = new Set(extractObjectKeys(scmPanelsBody));
    const requiredPanels = [
      'map',
      'energy-risk-overview',
      'chokepoint-strip',
      'supply-chain',
      'trade-policy',
      'sanctions-pressure',
      'pipeline-status',
      'storage-facility-map',
      'fuel-shortages',
      'energy-disruptions',
      'live-news',
      'energy-complex',
      'oil-inventories',
      'hormuz-tracker',
      'commodities',
      'fuel-prices',
      'macro-signals',
      'monitors',
    ];

    for (const panelId of requiredPanels) {
      assert.ok(scmPanelKeys.has(panelId), `SCM defaults missing panel "${panelId}"`);
    }

    assert.match(
      panelsSource,
      /scm:\s*Object\.keys\(SCM_PANELS\)/,
      'VARIANT_DEFAULTS must register scm defaults from SCM_PANELS',
    );
  });

  it('keeps SCM map defaults focused on supply-chain layers and excludes high-noise defaults', () => {
    const desktopLayers = extractBooleanMap(extractConstObjectBody(panelsSource, 'SCM_MAP_LAYERS'));
    const mobileLayers = extractBooleanMap(extractConstObjectBody(panelsSource, 'SCM_MOBILE_MAP_LAYERS'));

    const requiredDesktopTrue = [
      'pipelines',
      'ais',
      'sanctions',
      'weather',
      'waterways',
      'outages',
      'natural',
      'minerals',
      'fires',
      'commodityHubs',
      'tradeRoutes',
      'commodityPorts',
      'storageFacilities',
      'fuelShortages',
      'liveTankers',
    ];
    const requiredMobileTrue = [
      'pipelines',
      'sanctions',
      'waterways',
      'outages',
      'natural',
      'commodityPorts',
      'storageFacilities',
      'fuelShortages',
    ];
    const requiredFalse = ['military', 'bases', 'iranAttacks', 'nuclear'];

    for (const key of requiredDesktopTrue) {
      assert.equal(desktopLayers[key], true, `SCM desktop map defaults must enable "${key}"`);
    }
    for (const key of requiredMobileTrue) {
      assert.equal(mobileLayers[key], true, `SCM mobile map defaults must enable "${key}"`);
    }
    for (const key of requiredFalse) {
      assert.equal(desktopLayers[key], false, `SCM desktop map defaults must disable "${key}"`);
      assert.equal(mobileLayers[key], false, `SCM mobile map defaults must disable "${key}"`);
    }
  });

  it('uses SCM-facing copy that distinguishes upstream failure, no-data, stale data, and demo assumptions', () => {
    assert.match(
      energyRiskOverviewSource,
      /Blank tiles mean the public upstream failed or returned no current public reading; the crisis-day counter is demo framing only\./,
      'Energy risk overview tooltip must explain public upstream vs demo framing',
    );
    assert.match(
      energyRiskOverviewSource,
      /Public-data SCM demo\. A "—" tile means the public upstream failed or returned no current public reading; this overview does not yet split those two cases\./,
      'Energy risk overview note must keep public-data framing explicit',
    );
    assert.match(
      supplyChainPanelSource,
      /Public upstream unavailable for \$\{tabLabel\}\. This SCM demo does not infer proprietary data\./,
      'Supply chain banner must distinguish upstream failure from private-data inference',
    );
    assert.match(
      supplyChainPanelSource,
      /No current public data returned for \$\{tabLabel\}\. This SCM demo only shows open-source coverage\./,
      'Supply chain banner must distinguish empty public coverage',
    );
    assert.match(
      supplyChainPanelSource,
      /Public \$\{tabLabel\} data is stale in this SCM demo\. Showing the last successful update from \$\{escapeHtml\(this\.formatRelativeAge\(ageMs\)\)\} ago\./,
      'Supply chain banner must distinguish stale public data',
    );
    assert.match(
      supplyChainPanelSource,
      /SCM demo note: closure scenarios are demo-only assumptions derived from public routing and chokepoint data\./,
      'Supply chain scenario framing must stay demo-only',
    );
  });

  it('does not introduce Chevron-private or proprietary fixture language into SCM files', () => {
    const scmRelevantSource = [
      variantSource,
      variantMetaSource,
      panelsSource,
      energyRiskOverviewSource,
      supplyChainPanelSource,
    ].join('\n');

    const bannedPhrases = [
      /real Chevron supplier roster/i,
      /internal route/i,
      /contract pricing/i,
      /shipment schedule/i,
    ];

    assert.doesNotMatch(scmRelevantSource, /Chevron/i, 'SCM shell files must not claim Chevron-specific internal data');
    for (const pattern of bannedPhrases) {
      assert.doesNotMatch(scmRelevantSource, pattern, `SCM shell files must not include banned phrase ${pattern}`);
    }
  });
});
