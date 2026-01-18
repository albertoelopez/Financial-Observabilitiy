import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testUpload() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('CORS')) {
      console.log('ERROR:', msg.text());
    }
  });

  console.log('1. Navigating to optimizer...');
  await page.goto('http://localhost:3000/optimizer');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('2. Uploading P&L file...');
  const filePath = path.join(__dirname, '../test-data/sample-pnl.xlsx');

  // Find file input and upload
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  await page.screenshot({ path: 'test-results/upload-1-file-selected.png' });
  console.log('Screenshot: upload-1-file-selected.png');

  // Wait for upload and processing
  console.log('3. Waiting for AI analysis...');
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'test-results/upload-2-processing.png' });
  console.log('Screenshot: upload-2-processing.png');

  // Check for results or navigation
  console.log('Current URL:', page.url());

  // Wait longer for AI processing
  console.log('4. Waiting for results (this may take a while)...');
  await page.waitForTimeout(30000);

  await page.screenshot({ path: 'test-results/upload-3-results.png' });
  console.log('Screenshot: upload-3-results.png');
  console.log('Final URL:', page.url());

  await browser.close();
}

testUpload().catch(console.error);
