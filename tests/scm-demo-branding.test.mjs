import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);

function read(path) {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

function exists(path) {
  return existsSync(new URL(path, ROOT));
}

describe('Chevron SCM demo branding guardrails', () => {
  it('centralizes standalone SCM branding in a variant-aware config', () => {
    const source = read('src/config/demo-branding.ts');

    assert.match(source, /STANDALONE_DEMO_VARIANTS = new Set\(\['scm', 'chevron-scm'\]\)/);
    assert.match(source, /productName: 'Chevron SCM Demo Dashboard'/);
    assert.match(source, /shortName: 'Chevron SCM'/);
    assert.match(source, /suppressProductPromoSurfaces: true/);
    assert.match(source, /WORLDMONITOR_BRANDING/);
    assert.match(source, /applyDemoBrandingMetadata/);
    assert.match(source, /removeMeta\('meta\[name="author"\]'\)/);
    assert.match(source, /removeMeta\('meta\[name="twitter:creator"\]'\)/);
  });

  it('ships the visible SCM demo and Chevron logo assets', () => {
    assert.ok(exists('public/branding/chevron-scm-demo-logo.svg'), 'missing SCM demo logo');
    assert.ok(exists('public/branding/chevron-logo.svg'), 'missing Chevron logo');

    assert.match(read('public/branding/chevron-scm-demo-logo.svg'), /Chevron SCM Demo Dashboard/);
    assert.match(read('public/branding/chevron-logo.svg'), /Chevron logo/);
  });

  it('applies SCM branding metadata during app startup and boot detection', () => {
    const app = read('src/App.ts');
    const index = read('index.html');

    assert.match(app, /import \{ applyDemoBrandingMetadata \} from '@\/config\/demo-branding';/);
    assert.match(app, /applyDemoBrandingMetadata\(\);/);
    assert.match(index, /h\.startsWith\('scm\.'\)\)v='scm'/);
    assert.match(index, /scm\.worldmonitor\.app/);
  });

  it('removes promotional shell surfaces from the standalone SCM view only', () => {
    const layout = read('src/app/panel-layout.ts');
    const community = read('src/components/CommunityWidget.ts');
    const deck = read('src/components/DeckGLMap.ts');
    const globe = read('src/components/GlobeMap.ts');

    assert.match(layout, /if \(!DEMO_BRANDING\.suppressProductPromoSurfaces\) \{\s*this\.fetchGitHubStars\(\);/s);
    assert.match(layout, /const shellBrandHtml = isStandaloneDemo[\s\S]*scm-brand-lockup[\s\S]*brand\.partnerLogoSrc/s);
    assert.match(layout, /const promoLinksHtml = isStandaloneDemo\s*\?\s*''\s*:/);
    assert.match(layout, /variant-switcher--standalone/);
    assert.match(layout, /CHEVRON_DEMO_VIEWS\.map\(view =>/);
    assert.match(layout, /data-chevron-demo-view="\$\{view\.id\}"/);
    assert.match(layout, /isStandaloneDemo \? scmFooterLinksHtml : standardFooterLinksHtml/);
    assert.match(layout, /this\.ctx\.isDesktopApp \|\| isStandaloneDemo \? '' : `<span id="footerDownloadMount"><\/span>`/);
    assert.match(layout, /World Monitor/);
    assert.match(layout, /github\.com\/koala73\/worldmonitor/);
    assert.match(community, /if \(DEMO_BRANDING\.suppressProductPromoSurfaces\) return;/);
    assert.match(deck, /if \(!DEMO_ACCESS_POLICY\.suppressUserAccountUx\) \{[\s\S]*map-author-badge[\s\S]*Elie Habib/s);
    assert.match(globe, /if \(!DEMO_ACCESS_POLICY\.suppressUserAccountUx\) \{[\s\S]*map-author-badge[\s\S]*Elie Habib/s);
  });

  it('brands the settings shell without reintroducing account or commerce UX', () => {
    const settings = read('src/components/UnifiedSettings.ts');

    assert.match(settings, /import \{ DEMO_BRANDING \} from '@\/config\/demo-branding';/);
    assert.match(settings, /const settingsTitle = DEMO_BRANDING\.isStandaloneDemo \? `\$\{DEMO_BRANDING\.shortName\} Settings` : t\('header\.settings'\);/);
    assert.match(settings, /const showNotificationsTab = !DEMO_ACCESS_POLICY\.suppressUserAccountUx/);
    assert.match(settings, /const showApiKeysTab = !DEMO_ACCESS_POLICY\.suppressCommerceUx/);
  });

  it('keeps SCM docs demo-safe and public-data framed', () => {
    const safety = read('docs/scm-demo-safety.md');
    const index = read('docs/scm-api-data-index.md');

    assert.match(safety, /Chevron SCM Demo Dashboard/);
    assert.match(safety, /public-data supply chain operational intelligence demo/);
    assert.match(safety, /does not imply access to Chevron-private systems/);
    assert.match(index, /Chevron SCM Demo API Data Index/);
    assert.match(index, /public\/open-source data/);
    assert.match(index, /Do not add Chevron supplier rosters, contracts, shipments, inventory/);
  });
});
