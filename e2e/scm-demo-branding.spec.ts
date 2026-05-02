import { expect, test } from '@playwright/test';

const FORBIDDEN_PROMO_TEXT = /World Monitor|WORLD MONITOR|@eliehabib|GitHub|Discord|worldmonitorai/i;

test.describe('Chevron SCM demo branding', () => {
  test('renders standalone Chevron SCM shell without product promo surfaces', async ({ page }) => {
    await page.goto('/?alert=false');
    await page.evaluate(() => localStorage.setItem('wm-layer-warning-dismissed', '1'));

    await expect(page).toHaveTitle(/Chevron SCM Demo Dashboard/);
    await expect(page.locator('.header')).toBeVisible();

    const lockup = page.locator('.scm-brand-lockup');
    await expect(lockup).toBeVisible();
    await expect(page.locator('.scm-brand-logo-demo')).toBeVisible();
    await expect(page.locator('.scm-brand-logo-chevron')).toBeVisible();
    await expect(page.locator('.scm-brand-title')).toContainText('Chevron SCM');

    for (const image of await page.locator('.scm-brand-logo').all()) {
      const box = await image.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(10);
      expect(box?.height ?? 0).toBeGreaterThan(10);
    }

    await expect(page.locator('.variant-switcher--standalone')).toBeVisible();
    await expect(page.locator('.variant-option[data-variant="scm"]')).toContainText('Chevron SCM');
    await expect(page.locator('.github-link, #githubStars, .credit-link, .site-footer-credit')).toHaveCount(0);

    const shellText = [
      await page.locator('.header').innerText(),
      await page.locator('.site-footer').innerText(),
    ].join('\n');
    expect(shellText).toContain('Chevron SCM');
    expect(shellText).toContain('Public-data demo');
    expect(shellText).not.toMatch(FORBIDDEN_PROMO_TEXT);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    const mobileText = await page.locator('#mobileMenu').innerText();
    expect(mobileText).toContain('Chevron SCM');
    expect(mobileText).not.toMatch(FORBIDDEN_PROMO_TEXT);
    await page.locator('#mobileMenuClose').click();
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.locator('#unifiedSettingsBtn').click();
    await expect(page.locator('#unifiedSettingsModal')).toBeVisible();
    await expect(page.locator('#unifiedSettingsModal .modal-title')).toHaveText('Chevron SCM Settings');
    const settingsText = [
      await page.locator('#unifiedSettingsModal .modal-header').innerText(),
      await page.locator('#unifiedSettingsModal .unified-settings-tabs').innerText(),
    ].join('\n');
    expect(settingsText).not.toMatch(FORBIDDEN_PROMO_TEXT);
  });
});
