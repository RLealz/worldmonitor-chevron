import { expect, test } from '@playwright/test';

const FORBIDDEN_PROMO_TEXT = /World Monitor|WORLD MONITOR|@eliehabib|GitHub|Discord|worldmonitorai/i;

const DEMO_VIEWS = [
  { id: 'scm', label: 'Chevron SCM' },
  { id: 'energy', label: 'Energy' },
  { id: 'materials', label: 'Materials/Commodities' },
  { id: 'trade', label: 'Trade/Sanctions' },
  { id: 'routes', label: 'Routes/Maritime' },
  { id: 'markets', label: 'Finance/Markets' },
] as const;

test.describe('Chevron demo view navigation', () => {
  test('switches between Chevron-branded demo views without promo surfaces', async ({ page }) => {
    await page.goto('/?alert=false');
    await page.evaluate(() => localStorage.setItem('wm-layer-warning-dismissed', '1'));

    for (const view of DEMO_VIEWS) {
      await expect(page.locator(`[data-chevron-demo-view="${view.id}"]`).first()).toContainText(view.label);
    }

    for (const view of DEMO_VIEWS.slice(1)) {
      await page.locator(`[data-chevron-demo-view="${view.id}"]`).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator(`[data-chevron-demo-view="${view.id}"].active`).first()).toBeVisible();
      await expect.poll(
        () => page.evaluate(() => localStorage.getItem('chevron-demo-view')),
      ).toBe(view.id);

      const shellText = [
        await page.locator('.header').innerText(),
        await page.locator('.site-footer').innerText(),
      ].join('\n');
      expect(shellText).toContain('Chevron SCM');
      expect(shellText).not.toMatch(FORBIDDEN_PROMO_TEXT);
      await expect(page.locator('.github-link, #githubStars, .credit-link, .site-footer-credit')).toHaveCount(0);
    }

    await page.setViewportSize({ width: 390, height: 820 });
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    const mobileText = await page.locator('#mobileMenu').innerText();
    for (const view of DEMO_VIEWS) expect(mobileText).toContain(view.label);
    expect(mobileText).not.toMatch(FORBIDDEN_PROMO_TEXT);
  });
});
