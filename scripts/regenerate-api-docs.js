const fs = require('fs');
const { formatDashboardResponse } = require('../dist/modules/dashboard/dashboard-formatter.util');
const { generate169DashboardRows } = require('../dist/modules/dashboard/dashboard-seed.util');
const {
  ALL_CATEGORY_ID,
  MENS_FASHION_CATEGORY_ID,
  ELECTRONICS_CATEGORY_ID,
} = require('../dist/modules/dashboard/dashboard.config');

console.log('Generating accurate response payloads from new data file...');
const all169Rows = generate169DashboardRows();

// 1. Category 101 response
const cat101Rows = all169Rows.filter(r => r.category_id === ALL_CATEGORY_ID);
const cat101Formatted = formatDashboardResponse('HAATZA', ALL_CATEGORY_ID, '56', cat101Rows);

// 2. Category 102 response (Men's Fashion)
const cat102Rows = all169Rows.filter(r => r.category_id === MENS_FASHION_CATEGORY_ID);
const cat102Formatted = formatDashboardResponse('HAATZA', MENS_FASHION_CATEGORY_ID, '56', cat102Rows);

// 3. Category 104 response (Electronics)
const cat104Rows = all169Rows.filter(r => r.category_id === ELECTRONICS_CATEGORY_ID);
const cat104Formatted = formatDashboardResponse('HAATZA', ELECTRONICS_CATEGORY_ID, '56', cat104Rows);

console.log('Cat 101 count:', cat101Formatted.count);
console.log('Cat 102 count:', cat102Formatted.count);
console.log('Cat 104 count:', cat104Formatted.count);

// Read current API doc
let doc = fs.readFileSync('docs/HAATZA_DASHBOARD_API.md', 'utf8');

// Replace example 1: Complete HAATZA Success Response Example (200 OK)
const ex1Header = '### Complete HAATZA Success Response Example (`200 OK`)\n\n```json\n';
const ex1End = '\n```\n\n---';
const ex1Idx = doc.indexOf(ex1Header);
const ex1EndIdx = doc.indexOf(ex1End, ex1Idx);

if (ex1Idx !== -1 && ex1EndIdx !== -1) {
  const jsonStr = JSON.stringify(cat101Formatted, null, 2);
  doc = doc.slice(0, ex1Idx + ex1Header.length) + jsonStr + doc.slice(ex1EndIdx);
  console.log('Replaced Example 1 (Cat 101).');
} else {
  console.log('Warning: Example 1 boundaries not found!');
}

// Write back doc
fs.writeFileSync('docs/HAATZA_DASHBOARD_API.md', doc, 'utf8');
console.log('Saved updated docs/HAATZA_DASHBOARD_API.md.');
