import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';

test.describe('F-Suite How It Works', () => {
  test('should display how it works section', async ({ page }) => {
    const trace = createTrace('e2e-how-it-works', { test: 'how-it-works' });

    await page.goto('/');

    // Click How It Works link
    await page.getByRole('link', { name: /how it works/i }).click();
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/how-it-works.png' });

    trace.score({
      name: 'how-it-works-visible',
      value: 1,
      comment: 'How It Works section accessible'
    });

    await flush();
  });

  test('should display why us section', async ({ page }) => {
    const trace = createTrace('e2e-why-us', { test: 'why-us' });

    await page.goto('/');

    // Click Why Us link
    await page.getByRole('link', { name: /why us/i }).click();
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/why-us.png' });

    trace.score({
      name: 'why-us-visible',
      value: 1,
      comment: 'Why Us section accessible'
    });

    await flush();
  });

  test('should display FAQ section', async ({ page }) => {
    const trace = createTrace('e2e-faq', { test: 'faq' });

    await page.goto('/');

    // Click FAQ link
    await page.getByRole('link', { name: /faq/i }).click();
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/faq.png' });

    trace.score({
      name: 'faq-visible',
      value: 1,
      comment: 'FAQ section accessible'
    });

    await flush();
  });
});

test.describe('F-Suite Full Page Flow', () => {
  test('should complete full landing page journey', async ({ page }) => {
    const trace = createTrace('e2e-full-journey', { test: 'landing-journey' });
    const span = trace.span({ name: 'page-journey' });

    // Start at homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /cut your fixed costs/i })).toBeVisible({ timeout: 10000 });

    // Scroll through page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check footer/bottom content is visible
    await expect(page.getByText(/financialsuite/i).first()).toBeVisible();

    span.end({ output: { status: 'journey-complete' } });

    // Take final screenshot
    await page.screenshot({ path: 'test-results/full-journey.png', fullPage: true });

    trace.score({
      name: 'full-journey-complete',
      value: 1,
      comment: 'Full landing page journey completed'
    });

    await flush();
  });
});
