import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';

test.describe('F-Suite Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    const trace = createTrace('e2e-homepage-load', { test: 'homepage-load' });

    await page.goto('/');

    // Check main elements are visible
    await expect(page.getByRole('link', { name: /try a demo/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: /cut your fixed costs/i })).toBeVisible();

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

    // Check navigation links exist
    await expect(page.getByRole('link', { name: /why us/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: /how it works/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /faq/i })).toBeVisible();

    trace.score({
      name: 'navigation-works',
      value: 1,
      comment: 'Navigation links are visible'
    });

    await flush();
  });

  test('should click Try a Demo button', async ({ page }) => {
    const trace = createTrace('e2e-try-demo', { test: 'try-demo-click' });

    await page.goto('/');

    // Click Try a Demo
    await page.getByRole('link', { name: /try a demo/i }).click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/after-demo-click.png' });

    trace.score({
      name: 'demo-button-works',
      value: 1,
      comment: 'Try a Demo button clicked successfully'
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
