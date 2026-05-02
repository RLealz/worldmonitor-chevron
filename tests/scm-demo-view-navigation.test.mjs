import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);

function read(path) {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('Chevron demo view navigation guardrails', () => {
  it('defines Chevron-branded demo views without reusing the WorldMonitor variant key', () => {
    const source = read('src/config/chevron-demo-views.ts');

    assert.match(source, /CHEVRON_DEMO_VIEW_STORAGE_KEY = 'chevron-demo-view'/);
    assert.doesNotMatch(source, /worldmonitor-variant/);
    for (const id of ['scm', 'energy', 'materials', 'trade', 'routes', 'markets']) {
      assert.match(source, new RegExp(`id: '${id}'`));
    }
    for (const label of ['Chevron SCM', 'Energy', 'Materials/Commodities', 'Trade/Sanctions', 'Routes/Maritime', 'Finance/Markets']) {
      assert.match(source, new RegExp(`label: '${escapeRegExp(label)}'`));
    }
    assert.match(source, /open-source signals only/);
    assert.match(source, /does not represent Chevron endorsement/);
    assert.match(source, /does not represent Chevron endorsement or access to Chevron proprietary/);
  });

  it('uses existing panel keys for every Chevron demo view preset', () => {
    const views = read('src/config/chevron-demo-views.ts');
    const panels = read('src/config/panels.ts');
    const panelKeys = [...views.matchAll(/panelKeys:\s*\[([\s\S]*?)\]/g)]
      .flatMap(match => [...match[1].matchAll(/'([a-z0-9-]+)'/g)].map(keyMatch => keyMatch[1]));

    for (const key of new Set(panelKeys)) {
      assert.match(
        panels,
        new RegExp(`(?:^|\\n)\\s*['"]?${escapeRegExp(key)}['"]?\\s*:`),
        `missing panel config for ${key}`,
      );
    }
  });

  it('renders Chevron demo navigation in the standalone shell and mobile menu', () => {
    const layout = read('src/app/panel-layout.ts');

    assert.match(layout, /CHEVRON_DEMO_VIEWS\.map\(view =>/);
    assert.match(layout, /chevronDemoViewOptionsHtml/);
    assert.match(layout, /chevronMobileViewOptionsHtml/);
    assert.match(layout, /data-chevron-demo-view="\$\{view\.id\}"/);
    assert.match(layout, /variant-switcher--standalone/);
    assert.match(layout, /isStandaloneDemo\) return chevronMobileViewOptionsHtml/);
  });

  it('applies selected Chevron demo panel and layer presets inside the SCM app shell', () => {
    const app = read('src/App.ts');

    assert.match(app, /getInitialChevronDemoView/);
    assert.match(app, /selectedChevronDemoView\.panelKeys/);
    assert.match(app, /selectedChevronDemoView\.mobileMapLayers/);
    assert.match(app, /selectedChevronDemoView\.mapLayers/);
    assert.match(app, /document\.documentElement\.dataset\.chevronDemoView = selectedChevronDemoView\.id/);
    assert.match(app, /persistChevronDemoView\(selectedChevronDemoView\.id\)/);
    assert.match(app, /saveToStorage\(STORAGE_KEYS\.panels, panelSettings\)/);
    assert.match(app, /saveToStorage\(STORAGE_KEYS\.mapLayers, mapLayers\)/);
  });

  it('switches Chevron demo views without invoking WorldMonitor variant navigation', () => {
    const events = read('src/app/event-handlers.ts');

    assert.match(events, /querySelectorAll<HTMLElement>\('\[data-chevron-demo-view\]'\)/);
    assert.match(events, /navigateToChevronDemoView/);
    assert.match(events, /persistChevronDemoView\(viewId\)/);
    assert.match(events, /trackVariantSwitch\(/);
    assert.match(events, /window\.location\.reload\(\)/);
  });
});
