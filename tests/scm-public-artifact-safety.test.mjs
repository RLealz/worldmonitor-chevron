import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  REPO_ROOT,
  assertRequiredPostures,
  findPrivateBootstrapKeys,
  listScmPublicArtifactFiles,
  scanScmPublicArtifacts,
} from '../scripts/scm-public-artifact-safety.mjs';

function readRepoFile(relativePath) {
  return readFileSync(join(REPO_ROOT, relativePath), 'utf8');
}

describe('SCM public artifact safety inventory', () => {
  it('enumerates expected public and SCM artifact surfaces', () => {
    const files = listScmPublicArtifactFiles();
    const required = [
      'api/bootstrap.js',
      'docs/api/worldmonitor.openapi.yaml',
      'docs/scm-demo-safety.md',
      'public/openapi.yaml',
      'src/config/supplier-risk-archetypes.ts',
      'src/config/scm-route-presets.ts',
      'src/components/SupplyChainPanel.ts',
      'src/components/RouteExplorer/RouteExplorer.ts',
      '.planning/REQUIREMENTS.md',
      '.planning/ROADMAP.md',
    ];

    for (const file of required) {
      assert.ok(files.includes(file), `missing scan target ${file}`);
    }
    assert.equal(files.some(file => file.includes('node_modules/')), false);
    assert.equal(files.some(file => file.startsWith('dist/')), false);
    assert.equal(files.some(file => file.startsWith('.omx/')), false);
  });
});

describe('SCM public artifact safety scan', () => {
  it('finds no positive proprietary-looking SCM data claims in scanned artifacts', () => {
    const findings = scanScmPublicArtifacts();
    assert.deepEqual(findings, []);
  });

  it('keeps SCM fixtures in approved public/demo postures', () => {
    assert.deepEqual(assertRequiredPostures(), []);
  });

  it('does not expose private-looking bootstrap hydration keys', () => {
    assert.deepEqual(findPrivateBootstrapKeys(), []);
  });

  it('has generated public OpenAPI available before artifact review', () => {
    assert.ok(existsSync(join(REPO_ROOT, 'public/openapi.yaml')), 'public/openapi.yaml must exist');
    const openapi = readRepoFile('public/openapi.yaml');
    assert.match(openapi, /openapi:/);
  });

  it('does not publish private-looking SCM schemas or example fields in public OpenAPI', () => {
    const openapi = [
      readRepoFile('docs/api/worldmonitor.openapi.yaml'),
      readRepoFile('public/openapi.yaml'),
    ].join('\n');
    const banned = [
      /\bsupplierRoster\b|\bsupplier_roster\b/i,
      /\bshipmentId\b|\bshipment_id\b/i,
      /\bvesselNomination\b|\bvessel_nomination\b/i,
      /\bcontractPricing\b|\bcontract_pricing\b/i,
      /\binventoryLevel\b|\binventory_level\b/i,
      /\binternalRoute\b|\binternal_route\b/i,
      /\bcustomerRoute\b|\bcustomer_route\b/i,
      /\bfacilitySensitive\b|\bfacility_sensitive\b/i,
      /\brestrictedPartyCase\b|\brestricted_party_case\b/i,
      /\bChevron\s+(uses|owns|operates|routes through)\b/i,
    ];

    for (const pattern of banned) {
      assert.doesNotMatch(openapi, pattern, `public OpenAPI includes private-looking field ${pattern}`);
    }
  });

  it('documents SCM demo limits and the public-data safety posture', () => {
    const safetyDoc = readRepoFile('docs/scm-demo-safety.md');
    const readme = readRepoFile('README.md');

    assert.match(safetyDoc, /Public Data Posture/);
    assert.match(safetyDoc, /Confidence And Freshness/);
    assert.match(safetyDoc, /Out Of Scope/);
    assert.match(safetyDoc, /Future Production Work/);
    assert.match(safetyDoc, /does not imply access to Chevron-private systems/);
    assert.match(safetyDoc, /must not ingest, model, display, or imply access to proprietary Chevron supplier rosters/);
    assert.match(safetyDoc, /npm run build:openapi/);
    assert.match(safetyDoc, /node scripts\/scm-public-artifact-safety\.mjs/);

    assert.match(readme, /VITE_VARIANT=scm npm run dev/);
    assert.match(readme, /open-source-data-only energy supply chain demo/);
    assert.match(readme, /SCM Demo Safety Notes/);
  });
});
