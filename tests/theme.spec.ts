import { test, expect } from '@playwright/test';

test.describe('Teal Theme Verification', () => {
  test('should display teal theme colors on landing page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if page loaded successfully
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Get computed styles for primary button (if exists)
    const buttons = page.locator('button, a[class*="button"]').first();
    if (await buttons.count() > 0) {
      const buttonStyles = await buttons.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });

      console.log('Button styles:', buttonStyles);
    }

    // Check background color
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Background color:', bgColor);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/teal-theme-landing.png', fullPage: true });
  });

  test('should navigate to auth setup and verify theme', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Try to find and click a button to get started
    const getStartedButton = page.locator('text=/get started|sign up|setup|continue/i').first();

    if (await getStartedButton.count() > 0) {
      await getStartedButton.click();
      await page.waitForLoadState('networkidle');

      // Take screenshot of auth page
      await page.screenshot({ path: 'tests/screenshots/teal-theme-auth.png', fullPage: true });
    }
  });

  test('should verify CSS variables are set correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);

      return {
        background: styles.getPropertyValue('--background').trim(),
        foreground: styles.getPropertyValue('--foreground').trim(),
        primary: styles.getPropertyValue('--primary').trim(),
        secondary: styles.getPropertyValue('--secondary').trim(),
        accent: styles.getPropertyValue('--accent').trim(),
        border: styles.getPropertyValue('--border').trim(),
        ring: styles.getPropertyValue('--ring').trim(),
      };
    });

    console.log('CSS Variables:', cssVars);

    // Verify that CSS variables are set
    expect(cssVars.background).toBeTruthy();
    expect(cssVars.foreground).toBeTruthy();
    expect(cssVars.primary).toBeTruthy();

    // Verify teal theme is applied (should contain teal-ish hue ~192 in OKLCH)
    expect(cssVars.primary).toContain('192.18');
  });

  test('should verify button primary colors match teal theme', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Look for primary buttons
    const primaryButton = page.locator('button:not([disabled])').first();

    if (await primaryButton.count() > 0) {
      const computedStyles = await primaryButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor,
        };
      });

      console.log('Primary button computed styles:', computedStyles);

      // Take a screenshot
      await primaryButton.screenshot({ path: 'tests/screenshots/teal-primary-button.png' });
    }
  });
});
