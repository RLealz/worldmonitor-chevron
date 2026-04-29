import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const TEXT_EXTENSIONS = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

const EXCLUDED_DIRS = new Set([
  '.git',
  '.omx',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

const SCM_SOURCE_FILES = [
  'src/config/panels.ts',
  'src/config/variant.ts',
  'src/config/variant-meta.ts',
  'src/config/supplier-risk-archetypes.ts',
  'src/config/scm-route-presets.ts',
  'src/types/supplier-risk.ts',
  'src/types/compliance-exposure.ts',
  'src/types/scm-route-materials.ts',
  'src/utils/supplier-risk-signals.ts',
  'src/utils/compliance-exposure.ts',
  'src/utils/scm-route-material-context.ts',
  'src/components/SupplierRiskPanel.ts',
  'src/components/SanctionsPressurePanel.ts',
  'src/components/TradePolicyPanel.ts',
  'src/components/SupplyChainPanel.ts',
  'src/components/EnergyRiskOverviewPanel.ts',
  'src/components/RouteExplorer/RouteExplorer.ts',
  'src/app/data-loader.ts',
  'src/styles/supplier-risk-panel.css',
  'src/styles/compliance-exposure.css',
  'src/styles/supply-chain-panel.css',
  'src/styles/route-explorer.css',
];

const EXPLICIT_PUBLIC_ARTIFACTS = [
  'api/bootstrap.js',
  'docs/api/worldmonitor.openapi.yaml',
  'public/openapi.yaml',
  'README.md',
];

const DIRECTORY_SCOPES = [
  'docs',
  'blog-site/src',
  '.planning',
];

export const REQUIRED_PUBLIC_POSTURES = [
  'synthetic_archetype',
  'public_signal_summary',
  'public_demo_corridor',
];

const NEGATIVE_OR_LIMITATION_CONTEXT = /\b(no|not|without|avoid|forbid|forbidden|ban|banned|block|blocked|guardrail|out of scope|defer|deferred|future|must not|do not|does not|cannot|never|not included|not contain|not expose|not imply|rather than|instead of|such as|wording that says|language that says|prohibited-looking|private-data-shaped)\b/i;

export const PRIVATE_DATA_PATTERNS = [
  {
    id: 'real-chevron-supplier-roster',
    pattern: /\breal\s+Chevron\s+supplier\s+roster\b/i,
  },
  {
    id: 'chevron-uses-route',
    pattern: /\bChevron\s+(uses|owns|operates|relies on|routes through)\b/i,
  },
  {
    id: 'internal-chevron-route',
    pattern: /\binternal\s+Chevron\s+route\b/i,
  },
  {
    id: 'private-chevron-shipment',
    pattern: /\b(private|internal|Chevron)\s+shipment\s+(id|schedule|record|feed|payload)s?\b/i,
  },
  {
    id: 'supplier-roster-field',
    pattern: /\bsupplierRoster\b|\bsupplier_roster\b/i,
  },
  {
    id: 'shipment-field',
    pattern: /\bshipmentId\b|\bshipment_id\b|\bshipmentSchedule\b|\bshipment_schedule\b/i,
  },
  {
    id: 'vessel-nomination-field',
    pattern: /\bvesselNomination\b|\bvessel_nomination\b/i,
  },
  {
    id: 'contract-pricing-field',
    pattern: /\bcontractPricing\b|\bcontract_pricing\b|\bcontractPrice\b|\bcontract_price\b/i,
  },
  {
    id: 'inventory-level-field',
    pattern: /\binventoryLevel\b|\binventory_level\b|\binternalInventory\b|\binternal_inventory\b/i,
  },
  {
    id: 'customer-route-field',
    pattern: /\bcustomerRoute\b|\bcustomer_route\b|\binternalRoute\b|\binternal_route\b/i,
  },
  {
    id: 'facility-sensitive-field',
    pattern: /\bfacilitySensitive\b|\bfacility_sensitive\b|\bsensitiveFacility\b|\bsensitive_facility\b/i,
  },
  {
    id: 'private-compliance-case-field',
    pattern: /\brestrictedPartyCase\b|\brestricted_party_case\b|\bcomplianceCaseId\b|\bcompliance_case_id\b/i,
  },
  {
    id: 'legal-finality-claim',
    pattern: /\b(legally cleared|legally prohibited|compliance violation|final compliance determination|approved transaction|cleared party)\b/i,
  },
];

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

function walkTextFiles(directory) {
  const absolute = path.join(REPO_ROOT, directory);
  if (!existsSync(absolute)) return [];
  const out = [];
  const stack = [absolute];
  while (stack.length) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = toPosix(path.relative(REPO_ROOT, full));
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) stack.push(full);
        continue;
      }
      if (!entry.isFile() || !isTextFile(full)) continue;
      out.push(rel);
    }
  }
  return out;
}

export function listScmPublicArtifactFiles() {
  const files = new Set();
  for (const rel of [...SCM_SOURCE_FILES, ...EXPLICIT_PUBLIC_ARTIFACTS]) {
    if (existsSync(path.join(REPO_ROOT, rel))) files.add(rel);
  }
  for (const scope of DIRECTORY_SCOPES) {
    for (const rel of walkTextFiles(scope)) files.add(rel);
  }
  return [...files].sort();
}

function isAllowedLimitationLine(line) {
  return NEGATIVE_OR_LIMITATION_CONTEXT.test(line);
}

function scanLine(file, line, lineNumber) {
  const findings = [];
  for (const rule of PRIVATE_DATA_PATTERNS) {
    if (!rule.pattern.test(line)) continue;
    if (isAllowedLimitationLine(line)) continue;
    findings.push({
      file,
      line: lineNumber,
      rule: rule.id,
      text: line.trim(),
    });
  }
  return findings;
}

export function scanScmPublicArtifacts(files = listScmPublicArtifactFiles()) {
  const findings = [];
  for (const file of files) {
    const absolute = path.join(REPO_ROOT, file);
    if (!existsSync(absolute) || !statSync(absolute).isFile()) continue;
    const text = readFileSync(absolute, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      findings.push(...scanLine(file, line, index + 1));
    });
  }
  return findings;
}

export function assertRequiredPostures() {
  const configFiles = [
    'src/config/supplier-risk-archetypes.ts',
    'src/config/scm-route-presets.ts',
  ];
  const joined = configFiles
    .map(file => readFileSync(path.join(REPO_ROOT, file), 'utf8'))
    .join('\n');
  return REQUIRED_PUBLIC_POSTURES.filter(posture => !joined.includes(posture));
}

export function findPrivateBootstrapKeys() {
  const file = path.join(REPO_ROOT, 'api/bootstrap.js');
  if (!existsSync(file)) return [];
  const text = readFileSync(file, 'utf8');
  const keyLike = [...text.matchAll(/['"`]([A-Za-z0-9:_-]*(?:supplier|shipment|contract|inventory|internal-route|customer-route|restricted-party)[A-Za-z0-9:_-]*)['"`]/gi)];
  return keyLike
    .map(match => match[1])
    .filter(value => !/public|demo|synthetic|source|contract-mode/i.test(value));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const findings = scanScmPublicArtifacts();
  const missingPostures = assertRequiredPostures();
  const privateBootstrapKeys = findPrivateBootstrapKeys();
  if (findings.length || missingPostures.length || privateBootstrapKeys.length) {
    console.error(JSON.stringify({ findings, missingPostures, privateBootstrapKeys }, null, 2));
    process.exit(1);
  }
  console.log(`SCM public artifact safety scan passed (${listScmPublicArtifactFiles().length} files).`);
}
