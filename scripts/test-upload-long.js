import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testUpload() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all console messages
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('CORS') && !text.includes('socket')) {
      console.log(`[${msg.type()}]`, text);
    }
  });

  // Capture network requests
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/file') || url.includes('/expense') || url.includes('/document')) {
      console.log(`[API] ${response.status()} ${url}`);
      if (response.status() >= 400) {
        try {
          const body = await response.text();
          console.log(`[API Error]`, body.substring(0, 200));
        } catch (e) {}
      }
    }
  });

  console.log('1. Going to optimizer...');
  await page.goto('http://localhost:3000/optimizer');
  await page.waitForTimeout(3000);

  console.log('2. Uploading file...');
  const filePath = path.join(__dirname, '../test-data/sample-pnl.xlsx');
  await page.locator('input[type="file"]').setInputFiles(filePath);

  console.log('3. Waiting for processing (up to 2 minutes)...');

  // Take screenshots every 15 seconds
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(15000);
    await page.screenshot({ path: `test-results/upload-progress-${i}.png` });
    console.log(`   Screenshot ${i} taken at ${new Date().toLocaleTimeString()}`);
    console.log(`   Current URL: ${page.url()}`);

    // Check if we have results
    const hasResults = await page.locator('text=optimization').count();
    if (hasResults > 0) {
      console.log('   Found optimization results!');
      break;
    }
  }

  await page.screenshot({ path: 'test-results/upload-final.png', fullPage: true });
  console.log('Final URL:', page.url());

  await browser.close();
}

testUpload().catch(console.error);
