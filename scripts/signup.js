import { chromium } from 'playwright';

const name = 'Test User';
const email = 'losdodgerz@gmail.com';
const company = 'Test Company';

async function signup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to f-suite.com/#demo-form...');
  await page.goto('https://f-suite.com/#demo-form');
  await page.waitForLoadState('networkidle');

  // Scroll to the demo form
  await page.evaluate(() => {
    const demoForm = document.querySelector('#demo-form');
    if (demoForm) demoForm.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'test-results/join-1-before.png' });
  console.log('Screenshot: join-1-before.png');

  // Fill the demo form
  console.log('Filling demo form...');
  const form = page.locator('#demo-form');

  await form.getByPlaceholder(/name/i).fill(name);
  await form.getByPlaceholder(/email/i).fill(email);
  await form.getByPlaceholder(/company/i).fill(company);

  await page.screenshot({ path: 'test-results/join-2-filled.png' });
  console.log('Screenshot: join-2-filled.png');

  // Look for submit button
  const submitButton = form.getByRole('button');
  const buttonText = await submitButton.textContent();
  console.log(`Button text: "${buttonText}"`);

  console.log('Clicking submit...');
  await submitButton.click();

  // Wait for response
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'test-results/join-3-after-submit.png' });
  console.log('Screenshot: join-3-after-submit.png');

  console.log('Current URL:', page.url());

  await browser.close();
}

signup().catch(console.error);
