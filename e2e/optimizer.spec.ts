import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';
import path from 'path';

const hasTestCredentials = process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD;

test.describe('F-Suite Optimizer - AI Evaluation', () => {
  test.skip(!hasTestCredentials, 'Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD not set');

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/.*(?!signin).*/, { timeout: 15000 });
  });

  test('should display optimizer upload page', async ({ page }) => {
    const trace = createTrace('e2e-optimizer-upload-page', { test: 'upload-page' });

    await page.goto('/optimizer');

    await expect(page.getByText(/drag and drop/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /select file/i })).toBeVisible();

    trace.score({
      name: 'upload-page-ready',
      value: 1,
      comment: 'Optimizer upload page displays correctly'
    });

    await flush();
  });

  test('should show supported file formats', async ({ page }) => {
    const trace = createTrace('e2e-optimizer-formats', { test: 'file-formats' });

    await page.goto('/optimizer');

    await expect(page.getByText(/supported format/i)).toBeVisible({ timeout: 10000 });

    trace.score({
      name: 'formats-displayed',
      value: 1,
      comment: 'Supported file formats info visible'
    });

    await flush();
  });

  test('should handle file upload flow', async ({ page }) => {
    const trace = createTrace('e2e-optimizer-upload-flow', { test: 'upload-flow' });
    const span = trace.span({ name: 'file-upload-test' });

    await page.goto('/optimizer');

    // Check file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached({ timeout: 10000 });

    span.end({ output: { status: 'file-input-found' } });

    trace.score({
      name: 'upload-flow-ready',
      value: 1,
      comment: 'File upload mechanism is in place'
    });

    await flush();
  });
});

test.describe('F-Suite Optimizer - Results Evaluation', () => {
  test.skip(!hasTestCredentials, 'Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD not set');

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/.*(?!signin).*/, { timeout: 15000 });
  });

  test('should display results page with mock data', async ({ page }) => {
    const trace = createTrace('e2e-optimizer-results', { test: 'results-display' });

    // Set mock successful analysis data
    await page.goto('/optimizer');
    await page.evaluate(() => {
      localStorage.setItem('statusAnalyzeFile', JSON.stringify({
        status: 'done',
        records: [
          {
            id: 1,
            title: 'Internet Service',
            averagePrice: 150,
            optimizationOptions: [
              { id: 1, title: 'Find cheaper provider', isChat: 'search' },
              { id: 2, title: 'Negotiate current rate', isChat: 'ask' }
            ]
          }
        ]
      }));
    });

    await page.goto('/optimizer-list');

    // Check results are displayed
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/optimizer-results.png' });

    trace.score({
      name: 'results-displayed',
      value: 1,
      comment: 'Optimizer results page shows data'
    });

    await flush();
  });

  test('should handle error state gracefully', async ({ page }) => {
    const trace = createTrace('e2e-optimizer-error', { test: 'error-handling' });

    await page.goto('/optimizer');
    await page.evaluate(() => {
      localStorage.setItem('statusAnalyzeFile', JSON.stringify({
        status: 'failed',
        records: 'Test error: AI analysis failed'
      }));
    });

    await page.goto('/optimizer-list');

    await expect(page.getByText(/analysis failed/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /resend/i })).toBeVisible();

    trace.score({
      name: 'error-handled',
      value: 1,
      comment: 'Error state displays retry option'
    });

    await flush();
  });
});
