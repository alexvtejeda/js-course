import { test, expect } from '@playwright/test';

test('Quick teal theme verification', async ({ page }) => {
  // Navigate to landing page
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait a bit for styles to load
  await page.waitForTimeout(2000);

  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);

    return {
      background: styles.getPropertyValue('--background').trim(),
      primary: styles.getPropertyValue('--primary').trim(),
      ring: styles.getPropertyValue('--ring').trim(),
    };
  });

  console.log('CSS Variables:', cssVars);

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/theme-check.png',
    fullPage: true
  });

  // Verify teal theme (hue 192.18 in OKLCH)
  expect(cssVars.primary).toContain('192.18');
});
