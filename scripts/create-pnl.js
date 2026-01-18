import xlsx from 'xlsx';

// Sample P&L with fixed costs for testing
const data = [
  ['Profit & Loss Statement', '', ''],
  ['Company: Test Corp', '', ''],
  ['Period: Q4 2025', '', ''],
  ['', '', ''],
  ['Category', 'Description', 'Monthly Cost ($)'],
  ['', '', ''],
  ['FIXED COSTS', '', ''],
  ['Internet & Telecom', 'Business Internet - Comcast', 450],
  ['Internet & Telecom', 'Phone System - RingCentral', 280],
  ['Cloud Services', 'AWS Hosting', 1200],
  ['Cloud Services', 'Google Workspace', 360],
  ['Cloud Services', 'Microsoft 365', 420],
  ['Software', 'Salesforce CRM', 750],
  ['Software', 'Slack Business+', 200],
  ['Software', 'Zoom Enterprise', 300],
  ['Software', 'Adobe Creative Cloud', 600],
  ['Insurance', 'Business Liability Insurance', 850],
  ['Insurance', 'Cyber Insurance', 400],
  ['Rent & Utilities', 'Office Rent', 5500],
  ['Rent & Utilities', 'Electricity', 380],
  ['Rent & Utilities', 'Water & Sewage', 120],
  ['Professional Services', 'Accounting Software - QuickBooks', 180],
  ['Professional Services', 'Legal Retainer', 1500],
  ['Marketing', 'SEO Tools - Ahrefs', 199],
  ['Marketing', 'Email Marketing - Mailchimp', 250],
  ['HR & Payroll', 'Payroll Service - Gusto', 350],
  ['HR & Payroll', 'HR Software - BambooHR', 400],
  ['', '', ''],
  ['TOTAL FIXED COSTS', '', 14689],
];

// Create workbook and worksheet
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 25 },  // Category
  { wch: 40 },  // Description
  { wch: 18 },  // Monthly Cost
];

// Add worksheet to workbook
xlsx.utils.book_append_sheet(wb, ws, 'P&L');

// Save file
const outputPath = 'test-data/sample-pnl.xlsx';
xlsx.writeFile(wb, outputPath);

console.log(`Created: ${outputPath}`);
console.log('Fixed costs included:');
console.log('- Internet & Telecom: $730/month');
console.log('- Cloud Services: $1,980/month');
console.log('- Software: $1,850/month');
console.log('- Insurance: $1,250/month');
console.log('- Rent & Utilities: $6,000/month');
console.log('- Professional Services: $1,680/month');
console.log('- Marketing: $449/month');
console.log('- HR & Payroll: $750/month');
console.log('Total: $14,689/month');
