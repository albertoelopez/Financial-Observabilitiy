import { chromium } from 'playwright';

async function testLocal() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  console.log('Testing localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/local-1-home.png' });
  console.log('Screenshot: local-1-home.png');

  // Try to go to optimizer
  console.log('Navigating to /optimizer...');
  await page.goto('http://localhost:3000/optimizer');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/local-2-optimizer.png' });
  console.log('Screenshot: local-2-optimizer.png');
  console.log('Current URL:', page.url());

  await browser.close();
}

testLocal().catch(console.error);
