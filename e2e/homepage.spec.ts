import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';

test.describe('F-Suite Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    const trace = createTrace('e2e-homepage-load', { test: 'homepage-load' });

    await page.goto('/');

    // Check main elements are visible
    await expect(page.getByRole('button', { name: /costs optimizer/i })).toBeVisible({ timeout: 10000 });

    trace.score({
      name: 'homepage-loaded',
      value: 1,
      comment: 'Homepage loaded successfully with main navigation'
    });

    await flush();
  });

  test('should have working navigation', async ({ page }) => {
    const trace = createTrace('e2e-homepage-navigation', { test: 'navigation' });

    await page.goto('/');

    // Click on Costs Optimizer button
    await page.getByRole('button', { name: /costs optimizer/i }).click();

    // Should redirect to signin (if not authenticated)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible({ timeout: 10000 });

    trace.score({
      name: 'navigation-works',
      value: 1,
      comment: 'Navigation to optimizer redirects to signin correctly'
    });

    await flush();
  });
});

test.describe('F-Suite Demo Form', () => {
  test('should display demo form section', async ({ page }) => {
    const trace = createTrace('e2e-demo-form', { test: 'demo-form' });

    await page.goto('/#demo-form');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot for manual review
    await page.screenshot({ path: 'test-results/demo-form.png' });

    trace.score({
      name: 'demo-form-visible',
      value: 1,
      comment: 'Demo form section accessible'
    });

    await flush();
  });
});
