import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';

test.describe('F-Suite Join/Demo Form', () => {
  test('should display join form with fields', async ({ page }) => {
    const trace = createTrace('e2e-join-form', { test: 'join-form-display' });

    await page.goto('/#demo-form');
    await page.waitForLoadState('networkidle');

    // Check form elements - the Join now form at bottom
    await expect(page.getByText(/join now/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#demo-form').getByPlaceholder(/name/i)).toBeVisible();
    await expect(page.locator('#demo-form').getByPlaceholder(/email/i)).toBeVisible();

    trace.score({
      name: 'join-form-elements',
      value: 1,
      comment: 'Join form elements present'
    });

    await flush();
  });

  test('should have partnership info section', async ({ page }) => {
    const trace = createTrace('e2e-partnership-info', { test: 'partnership-section' });

    await page.goto('/#demo-form');
    await page.waitForLoadState('networkidle');

    // Check partnership info is visible
    await expect(page.getByText(/partnership info/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/become a partner/i)).toBeVisible();

    trace.score({
      name: 'partnership-visible',
      value: 1,
      comment: 'Partnership info section visible'
    });

    await flush();
  });

  test('should fill out join form', async ({ page }) => {
    const trace = createTrace('e2e-join-form-fill', { test: 'form-fill' });

    await page.goto('/#demo-form');
    await page.waitForLoadState('networkidle');

    // Fill the form (use #demo-form to target specific form)
    await page.locator('#demo-form').getByPlaceholder(/name/i).fill('Test User');
    await page.locator('#demo-form').getByPlaceholder(/email/i).fill('test@example.com');

    // Take screenshot of filled form
    await page.screenshot({ path: 'test-results/join-form-filled.png' });

    trace.score({
      name: 'form-fillable',
      value: 1,
      comment: 'Join form can be filled out'
    });

    await flush();
  });
});
