/**
 * Verification Script: Strict Item Shape & Key Set Audit
 * Checks every item in the 169 dashboard rows against exact key sets:
 * - Banner (seqs 1, 2, 5, 8, 11): banner_image, title, content, redirect_category_id, redirect_url (all strings)
 * - Product (seqs 4, 6, 7, 9, 10, 12..16): product_id, product_title, product_image, category_id (strings),
 *                                           mrp, discount_price (numbers), discount_percentage (integer), is_add_to_cart (boolean)
 * - Category tile (seq 3): category_name, category_image, category_id (strings)
 */

const fs = require('fs');
const path = require('path');

const BANNER_SEQS = new Set([1, 2, 5, 8, 11]);
const PRODUCT_SEQS = new Set([4, 6, 7, 9, 10, 12, 13, 14, 15, 16]);
const TILE_SEQS = new Set([3]);

const BANNER_KEYS = ['banner_image', 'title', 'content', 'redirect_category_id', 'redirect_url'];
const PRODUCT_KEYS = ['product_id', 'product_title', 'product_image', 'category_id', 'mrp', 'discount_price', 'discount_percentage', 'is_add_to_cart'];
const TILE_KEYS = ['category_name', 'category_image', 'category_id'];

function getWidgetType(seq) {
  if (BANNER_SEQS.has(seq)) return 'Banner';
  if (PRODUCT_SEQS.has(seq)) return 'Product';
  if (TILE_SEQS.has(seq)) return 'Category tile';
  return 'Unknown';
}

function getWidgetSeq(widgetId) {
  const num = parseInt(widgetId.slice(1), 10);
  if (num <= 16) return num;
  const catOffset = num - 17;
  const seqInCat = catOffset % 9;
  const seqMap = [1, 3, 4, 5, 6, 9, 10, 15, 16];
  return seqMap[seqInCat];
}

function checkItemShape(item, expectedKeys, expectedTypes) {
  const itemKeys = Object.keys(item);
  const missingKeys = expectedKeys.filter(k => !itemKeys.includes(k));
  const extraKeys = itemKeys.filter(k => !expectedKeys.includes(k));
  const typeErrors = [];

  for (const [k, expectedType] of Object.entries(expectedTypes)) {
    if (item[k] !== undefined) {
      const val = item[k];
      if (expectedType === 'string' && typeof val !== 'string') {
        typeErrors.push(`${k} expected string, got ${typeof val}`);
      } else if (expectedType === 'number' && typeof val !== 'number') {
        typeErrors.push(`${k} expected number, got ${typeof val}`);
      } else if (expectedType === 'integer' && (!Number.isInteger(val))) {
        typeErrors.push(`${k} expected integer, got ${val}`);
      } else if (expectedType === 'boolean' && typeof val !== 'boolean') {
        typeErrors.push(`${k} expected boolean, got ${typeof val}`);
      }
    }
  }

  return {
    valid: missingKeys.length === 0 && extraKeys.length === 0 && typeErrors.length === 0,
    missingKeys,
    extraKeys,
    typeErrors
  };
}

function auditSource(entries, label) {
  const stats = {
    Banner: { checked: 0, failures: [] },
    Product: { checked: 0, failures: [] },
    'Category tile': { checked: 0, failures: [] }
  };

  for (const { widget_id, items } of entries) {
    const seq = getWidgetSeq(widget_id);
    const type = getWidgetType(seq);
    if (type === 'Unknown') continue;

    let expectedKeys, expectedTypes;
    if (type === 'Banner') {
      expectedKeys = BANNER_KEYS;
      expectedTypes = {
        banner_image: 'string',
        title: 'string',
        content: 'string',
        redirect_category_id: 'string',
        redirect_url: 'string'
      };
    } else if (type === 'Product') {
      expectedKeys = PRODUCT_KEYS;
      expectedTypes = {
        product_id: 'string',
        product_title: 'string',
        product_image: 'string',
        category_id: 'string',
        mrp: 'number',
        discount_price: 'number',
        discount_percentage: 'integer',
        is_add_to_cart: 'boolean'
      };
    } else if (type === 'Category tile') {
      expectedKeys = TILE_KEYS;
      expectedTypes = {
        category_name: 'string',
        category_image: 'string',
        category_id: 'string'
      };
    }

    if (!Array.isArray(items)) {
      stats[type].failures.push({ widget_id, index: -1, error: 'items is not array' });
      continue;
    }

    stats[type].checked += items.length;

    items.forEach((item, idx) => {
      const res = checkItemShape(item, expectedKeys, expectedTypes);
      if (!res.valid) {
        stats[type].failures.push({
          widget_id,
          index: idx,
          missingKeys: res.missingKeys,
          extraKeys: res.extraKeys,
          typeErrors: res.typeErrors
        });
      }
    });
  }

  return stats;
}

async function run() {
  const isDbCheck = process.argv.includes('--database');
  let entries = [];
  let label = '';

  if (isDbCheck) {
    label = 'DATABASE LIVE ITEMS';
    require('dotenv').config();
    const { Client } = require('pg');
    const directConnStr = (process.env.DATABASE_URL || '').replace('-pooler', '');
    const client = new Client({ connectionString: directConnStr, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const res = await client.query("SELECT widget_id, items FROM dashboard WHERE module = 'HAATZA' AND placement = 'DESKTOP' ORDER BY widget_id;");
    await client.end();
    entries = res.rows;
  } else {
    label = 'DATA FILE (haatza-dashboard-items.data.ts)';
    const dataModule = require('../dist/modules/dashboard/data/haatza-dashboard-items.data');
    entries = Object.entries(dataModule.HAATZA_DASHBOARD_ITEMS).map(([widget_id, items]) => ({ widget_id, items }));
  }

  console.log(`================================================================`);
  console.log(`DASHBOARD ITEM SHAPE AUDIT: ${label}`);
  console.log(`================================================================\n`);

  const results = auditSource(entries, label);
  let totalChecked = 0;
  let totalFailures = 0;

  for (const [type, data] of Object.entries(results)) {
    totalChecked += data.checked;
    totalFailures += data.failures.length;
    const statusTag = data.failures.length === 0 ? 'PASS' : 'FAIL';
    console.log(`[${statusTag}] ${type.padEnd(14)}: Checked: ${String(data.checked).padStart(3)} | Failures: ${data.failures.length}`);
    if (data.failures.length > 0) {
      data.failures.forEach(f => {
        console.log(`   -> Widget ${f.widget_id} item [${f.index}]: missing=[${f.missingKeys}], extra=[${f.extraKeys}], typeErrors=[${f.typeErrors}]`);
      });
    }
  }

  console.log(`\nTOTAL ITEMS CHECKED: ${totalChecked}`);
  console.log(`TOTAL FAILURES:      ${totalFailures}`);
  console.log(`STATUS:              ${totalFailures === 0 ? 'ALL CHECKS PASSED' : 'FAILURES DETECTED'}`);

  return { results, totalChecked, totalFailures };
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { auditSource, checkItemShape };
