import { expect, test } from '@playwright/test';

const FORBIDDEN_ACCESS_UX = /\b(sign in|sign up|create account|account menu|upgrade|subscription|pricing|checkout|billing|locked|unlock|pro)\b/i;

test.describe('SCM demo standalone access UX', () => {
  test('loads without visible auth or Pro gating', async ({ page }) => {
    await page.goto('/?alert=false');
    await page.evaluate(() => localStorage.setItem('wm-layer-warning-dismissed', '1'));

    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('#panelsGrid')).toBeVisible();
    await expect(page.locator('.variant-option[data-variant="scm"], .mobile-menu-variant[data-variant="scm"]').first()).toBeVisible();

    await page.locator('#unifiedSettingsBtn').click();
    await expect(page.locator('#unifiedSettingsModal')).toBeVisible();

    const visibleText = await page.locator('body').innerText();
    expect(visibleText).not.toMatch(FORBIDDEN_ACCESS_UX);

    await expect(page.locator('.auth-signin-btn, .auth-signup-link, .auth-clerk-user-button')).toHaveCount(0);
    await expect(page.locator('.panel-is-locked, .panel-locked-state, .layer-toggle-locked, .layer-pro-badge, .widget-pro-badge, .panel-pro-badge, .panel-toggle-pro-badge')).toHaveCount(0);
  });
});
