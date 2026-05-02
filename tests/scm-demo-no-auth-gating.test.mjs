import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);

function read(path) {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

describe('SCM demo auth and Pro gating guardrails', () => {
  it('centralizes standalone SCM demo access policy', () => {
    const source = read('src/config/demo-access-policy.ts');

    assert.match(source, /STANDALONE_DEMO_VARIANTS = new Set\(\['scm', 'chevron-scm'\]\)/);
    assert.match(source, /suppressUserAccountUx: standalone/);
    assert.match(source, /suppressCommerceUx: standalone/);
    assert.match(source, /ungateDemoDashboardUx: standalone/);
  });

  it('does not mount account or commerce shell UX for SCM', () => {
    const app = read('src/App.ts');
    const events = read('src/app/event-handlers.ts');
    const authWidget = read('src/components/AuthHeaderWidget.ts');

    assert.match(app, /if \(!DEMO_ACCESS_POLICY\.suppressUserAccountUx\) \{\s*this\.eventHandlers\.setupAuthWidget\(\);/s);
    assert.match(app, /if \(!DEMO_ACCESS_POLICY\.suppressCommerceUx\) \{\s*showProBanner\(this\.state\.container\);/s);
    assert.match(app, /if \(!DEMO_ACCESS_POLICY\.suppressCommerceUx\) \{[\s\S]*captureReferralFromUrl\(\);[\s\S]*initCheckoutWatchers\(\);/);
    assert.match(events, /setupAuthWidget\(\): void \{\s*if \(DEMO_ACCESS_POLICY\.suppressUserAccountUx\) return;/);
    assert.match(authWidget, /if \(DEMO_ACCESS_POLICY\.suppressUserAccountUx\) return;/);
  });

  it('removes user-facing Pro links, panel gates, and add-panel upsells from SCM layout', () => {
    const layout = read('src/app/panel-layout.ts');
    const panelGating = read('src/services/panel-gating.ts');

    assert.match(panelGating, /if \(DEMO_ACCESS_POLICY\.ungateDemoDashboardUx\) return true;/);
    assert.match(layout, /if \(DEMO_ACCESS_POLICY\.ungateDemoDashboardUx\) \{[\s\S]*unlockPanel\(\);[\s\S]*return;/);
    assert.match(layout, /\$\{DEMO_ACCESS_POLICY\.suppressCommerceUx \? '' : `<a href="\$\{this\.ctx\.isDesktopApp \? 'https:\/\/worldmonitor\.app\/pro'/);
    assert.match(layout, /if \(!DEMO_ACCESS_POLICY\.suppressCommerceUx\) \{[\s\S]*ai-widget-block-pro[\s\S]*mcp-panel-block[\s\S]*\}/);
    assert.match(layout, /lockedFeatures && !DEMO_ACCESS_POLICY\.ungateDemoDashboardUx/);
  });

  it('keeps SCM settings free of account-gated tabs and upsells', () => {
    const settings = read('src/components/UnifiedSettings.ts');
    const events = read('src/app/event-handlers.ts');
    const app = read('src/App.ts');

    assert.match(settings, /const isSignedIn = !DEMO_ACCESS_POLICY\.suppressUserAccountUx/);
    assert.match(settings, /const showNotificationsTab = !DEMO_ACCESS_POLICY\.suppressUserAccountUx/);
    assert.match(settings, /const showApiKeysTab = !DEMO_ACCESS_POLICY\.suppressCommerceUx/);
    assert.match(settings, /if \(DEMO_ACCESS_POLICY\.suppressCommerceUx\) return '';/);
    assert.match(settings, /!DEMO_ACCESS_POLICY\.ungateDemoDashboardUx && !isPanelEntitled/);
    assert.match(settings, /!DEMO_ACCESS_POLICY\.ungateDemoDashboardUx && !isProUser\(\)/);
    assert.match(events, /!DEMO_ACCESS_POLICY\.ungateDemoDashboardUx && !isProUser\(\)/);
    assert.match(app, /private enforceFreeTierLimits\(\): void \{\s*if \(DEMO_ACCESS_POLICY\.ungateDemoDashboardUx\) return;/);
  });

  it('renders SCM map layer toggles without Pro locks', () => {
    const deck = read('src/components/DeckGLMap.ts');
    const globe = read('src/components/GlobeMap.ts');

    assert.match(deck, /const premiumUnlocked = DEMO_ACCESS_POLICY\.ungateDemoDashboardUx \|\| hasPremiumAccess\(getAuthState\(\)\);/);
    assert.match(globe, /const _wmKey = DEMO_ACCESS_POLICY\.ungateDemoDashboardUx \|\| getSecretState\('WORLDMONITOR_API_KEY'\)\.present;/);
  });

  it('keeps SCM variant copy focused on public demo data instead of access gating', () => {
    const scmVariant = read('src/config/variants/scm.ts');
    const forbidden = /\b(sign in|sign up|create account|upgrade|subscription|pricing|checkout|billing|locked|unlock|pro)\b/i;

    assert.doesNotMatch(scmVariant, forbidden);
    assert.match(scmVariant, /Public-data SCM monitoring demo/);
  });
});
