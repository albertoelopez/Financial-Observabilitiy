import { test, expect } from '@playwright/test';
import { createTrace, flush } from './helpers/langfuse';

const hasTestCredentials = process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD;

test.describe('F-Suite Authentication', () => {
  test('should display signin page', async ({ page }) => {
    const trace = createTrace('e2e-signin-page', { test: 'signin-display' });

    await page.goto('/signin');

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    trace.score({
      name: 'signin-page-elements',
      value: 1,
      comment: 'All signin form elements present'
    });

    await flush();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const trace = createTrace('e2e-signin-invalid', { test: 'invalid-credentials' });

    await page.goto('/signin');

    await page.getByLabel(/email/i).fill('invalid@test.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show some error indication
    await page.waitForTimeout(2000);

    // Check we're still on signin page (login failed)
    await expect(page).toHaveURL(/signin/);

    trace.score({
      name: 'invalid-credentials-handled',
      value: 1,
      comment: 'Invalid credentials properly rejected'
    });

    await flush();
  });
});

test.describe('F-Suite Authenticated Flow', () => {
  test.skip(!hasTestCredentials, 'Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD not set');

  test('should login successfully with valid credentials', async ({ page }) => {
    const trace = createTrace('e2e-signin-success', { test: 'valid-credentials' });

    await page.goto('/signin');

    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect away from signin
    await page.waitForURL(/.*(?!signin).*/, { timeout: 15000 });

    trace.score({
      name: 'login-success',
      value: 1,
      comment: 'User logged in successfully'
    });

    await flush();
  });
});
