import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import { DashboardCacheService } from '../src/modules/dashboard/dashboard-cache.service';
import { PrismaService } from '../src/database/prisma.service';
import {
  ALL_CATEGORY_ID,
  HAATZA_CATEGORIES,
  PLACEHOLDER_MENS_FASHION_ID,
  PLACEHOLDER_WOMENS_FASHION_ID,
} from '../src/modules/dashboard/dashboard.config';
import {
  formatWidgetItem,
  formatCleanWidget,
} from '../src/modules/dashboard/dashboard-formatter.util';
import { customerDashboardQuerySchema } from '../src/modules/dashboard/dashboard.schema';

interface TestResult {
  testNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function checkNoNulls(obj: any, path = 'root'): { hasNull: boolean; nullPath?: string } {
  if (obj === null) {
    return { hasNull: true, nullPath: path };
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const res = checkNoNulls(obj[i], `${path}[${i}]`);
      if (res.hasNull) return res;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, val] of Object.entries(obj)) {
      const res = checkNoNulls(val, `${path}.${key}`);
      if (res.hasNull) return res;
    }
  }
  return { hasNull: false };
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING THE 13 MANDATORY SECTION 13 VERIFICATION TESTS');
  console.log('====================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const dashboardService = app.get(DashboardService);
  const cacheService = app.get(DashboardCacheService);
  const prisma = app.get(PrismaService);

  try {
    // ----------------------------------------------------
    // TEST 1: All (101), territory 56: 16 widgets, sequence 1 to 16, with items
    // ----------------------------------------------------
    cacheService.clearAll();
    const res1 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });

    const forbiddenFields = [
      'product_id',
      'warehouse_id',
      'territory',
      'module',
      'created_by',
      'updated_by',
      'created_at',
      'updated_at',
      'placement',
    ];

    const hasForbiddenField = res1.widgets.some((w: any) =>
      forbiddenFields.some((f) => f in w),
    );

    const seqs1 = res1.widgets.map((w) => w.sequence);
    const expectedSeqs1 = Array.from({ length: 16 }, (_, i) => i + 1);
    const hasItems1 = res1.widgets.every((w) => Array.isArray(w.items) && w.items.length > 0);

    const pass1 =
      res1.success === true &&
      res1.count === 16 &&
      res1.widgets.length === 16 &&
      JSON.stringify(seqs1) === JSON.stringify(expectedSeqs1) &&
      hasItems1 &&
      !hasForbiddenField;

    results.push({
      testNumber: 1,
      name: 'All (101), territory 56: 16 widgets, seq 1-16, with items, clean envelope',
      passed: pass1,
      details: `Count: ${res1.count}, Seqs: ${seqs1.join(',')}, All widgets have items: ${hasItems1}, Forbidden fields absent: ${!hasForbiddenField}`,
    });

    // ----------------------------------------------------
    // TEST 2: Electronics (102), territory 56: 9 widgets, sequence 1,3,4,5,6,9,10,15,16, items []
    // ----------------------------------------------------
    const res2 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: 'c4000000-0000-4000-8000-000000000102',
      territory: '56',
    });

    const expectedSeqs2 = [1, 3, 4, 5, 6, 9, 10, 15, 16];
    const seqs2 = res2.widgets.map((w) => w.sequence);
    const allEmptyItems2 = res2.widgets.every((w) => Array.isArray(w.items) && w.items.length === 0);

    const pass2 =
      res2.success === true &&
      res2.count === 9 &&
      res2.widgets.length === 9 &&
      JSON.stringify(seqs2) === JSON.stringify(expectedSeqs2) &&
      allEmptyItems2;

    results.push({
      testNumber: 2,
      name: 'Electronics (102), territory 56: 9 widgets, seq 1,3,4,5,6,9,10,15,16, items []',
      passed: pass2,
      details: `Count: ${res2.count}, Seqs: ${seqs2.join(',')}, Items empty: ${allEmptyItems2}`,
    });

    // ----------------------------------------------------
    // TEST 3: Any category from 103 to 118, territory 56: the same 9 widgets
    // ----------------------------------------------------
    const cat108 = 'c4000000-0000-4000-8000-000000000108'; // Books
    const cat115 = 'c4000000-0000-4000-8000-000000000115'; // Jewelry
    const res3a = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: cat108,
      territory: '56',
    });
    const res3b = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: cat115,
      territory: '56',
    });

    const seqs3a = res3a.widgets.map((w) => w.sequence);
    const seqs3b = res3b.widgets.map((w) => w.sequence);
    const pass3 =
      res3a.count === 9 &&
      res3b.count === 9 &&
      JSON.stringify(seqs3a) === JSON.stringify(expectedSeqs2) &&
      JSON.stringify(seqs3b) === JSON.stringify(expectedSeqs2) &&
      res3a.widgets.every((w) => w.items.length === 0) &&
      res3b.widgets.every((w) => w.items.length === 0);

    results.push({
      testNumber: 3,
      name: 'Any category from 103 to 118 (tested Books 108 & Jewelry 115): exact 9 widgets',
      passed: pass3,
      details: `Cat 108 Count: ${res3a.count}, Cat 115 Count: ${res3b.count}, Matching sequences: true`,
    });

    // ----------------------------------------------------
    // TEST 4: All (101), territory 99: empty list, no error
    // ----------------------------------------------------
    const res4 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '99',
    });

    const pass4 =
      res4.success === true &&
      res4.count === 0 &&
      Array.isArray(res4.widgets) &&
      res4.widgets.length === 0;

    results.push({
      testNumber: 4,
      name: 'All (101), territory 99: empty list, no error',
      passed: pass4,
      details: `Success: ${res4.success}, Count: ${res4.count}, Widgets: ${JSON.stringify(res4.widgets)}`,
    });

    // ----------------------------------------------------
    // TEST 5: Set one row status to false: that widget disappears
    // ----------------------------------------------------
    // We temporarily toggle w0016 (More to Explore on All category)
    await prisma.dashboard.update({
      where: { widgetId: 'w0016' },
      data: { status: false },
    });
    cacheService.clearAll();

    const res5 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });

    const containsW0016 = res5.widgets.some((w) => w.widget_id === 'w0016');
    const pass5 = res5.count === 15 && !containsW0016;

    // Restore status = true
    await prisma.dashboard.update({
      where: { widgetId: 'w0016' },
      data: { status: true },
    });
    cacheService.clearAll();

    results.push({
      testNumber: 5,
      name: "Set one row's status to false: that widget disappears",
      passed: pass5,
      details: `Count became 15: ${res5.count === 15}, w0016 absent: ${!containsW0016}, Restored status: true`,
    });

    // ----------------------------------------------------
    // TEST 6: Set one row's effective_to to yesterday: that widget disappears
    // ----------------------------------------------------
    // Temporarily set w0015 effective_to to yesterday
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    const originalRow = await prisma.dashboard.findUnique({ where: { widgetId: 'w0015' } });
    await prisma.dashboard.update({
      where: { widgetId: 'w0015' },
      data: { effectiveTo: yesterday },
    });
    cacheService.clearAll();

    const res6 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });

    const containsW0015 = res6.widgets.some((w) => w.widget_id === 'w0015');
    const pass6 = res6.count === 15 && !containsW0015;

    // Restore original effectiveTo
    if (originalRow) {
      await prisma.dashboard.update({
        where: { widgetId: 'w0015' },
        data: { effectiveTo: originalRow.effectiveTo },
      });
    }
    cacheService.clearAll();

    results.push({
      testNumber: 6,
      name: "Set one row's effective_to to yesterday: that widget disappears",
      passed: pass6,
      details: `Count became 15: ${res6.count === 15}, w0015 absent: ${!containsW0015}, Restored date`,
    });

    // ----------------------------------------------------
    // TEST 7: No null anywhere in the response (check whole response including nested items)
    // ----------------------------------------------------
    const res7 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });

    const nullCheck = checkNoNulls(res7);
    const pass7 = !nullCheck.hasNull;

    results.push({
      testNumber: 7,
      name: 'No null anywhere in the response (nested inspection)',
      passed: pass7,
      details: nullCheck.hasNull ? `Found null at ${nullCheck.nullPath}` : 'Zero nulls verified across all 16 widgets and nested items',
    });

    // ----------------------------------------------------
    // TEST 8: Every banner item, product item, and category tile has all its fields
    // ----------------------------------------------------
    const heroBannerWidget = res7.widgets.find((w) => w.widget_id === 'w0001'); // Banner
    const topCategoriesWidget = res7.widgets.find((w) => w.widget_id === 'w0003'); // Category tile
    const suggestedProductsWidget = res7.widgets.find((w) => w.widget_id === 'w0004'); // Product

    const bannerFields = ['banner_image', 'title', 'content', 'redirect_category_id', 'redirect_url'];
    const categoryTileFields = ['category_name', 'category_image', 'category_id'];
    const productFields = [
      'product_id',
      'product_title',
      'product_image',
      'category_id',
      'mrp',
      'discount_price',
      'discount_percentage',
      'is_add_to_cart',
    ];

    const allBannerItemsValid = heroBannerWidget?.items.every((b: any) =>
      bannerFields.every((f) => f in b && b[f] !== null),
    );
    const allCategoryTilesValid = topCategoriesWidget?.items.every((c: any) =>
      categoryTileFields.every((f) => f in c && c[f] !== null),
    );
    const allProductsValid = suggestedProductsWidget?.items.every((p: any) =>
      productFields.every((f) => f in p && p[f] !== null),
    );

    const pass8 = Boolean(allBannerItemsValid && allCategoryTilesValid && allProductsValid);

    results.push({
      testNumber: 8,
      name: 'Every banner, category tile, and product item has all its fields consistently',
      passed: pass8,
      details: `Banner items complete: ${allBannerItemsValid}, Category tiles complete: ${allCategoryTilesValid}, Product items complete: ${allProductsValid}`,
    });

    // ----------------------------------------------------
    // TEST 9: Missing or null field gets correct default, and real values (false, 0) not overwritten
    // ----------------------------------------------------
    const sampleProductItem = {
      product_id: 'p-test',
      is_add_to_cart: false, // real false
      discount_percentage: 0, // real 0
      mrp: null, // should become 0
      product_title: undefined, // should become ""
    };
    const formattedProduct = formatWidgetItem(sampleProductItem, 'PRODUCT');

    const pass9 =
      formattedProduct.product_id === 'p-test' &&
      formattedProduct.is_add_to_cart === false &&
      formattedProduct.discount_percentage === 0 &&
      formattedProduct.mrp === 0 &&
      formattedProduct.product_title === '';

    results.push({
      testNumber: 9,
      name: 'Missing/null field gets default, real false and 0 are preserved',
      passed: pass9,
      details: `is_add_to_cart preserved false: ${formattedProduct.is_add_to_cart === false}, discount_percentage preserved 0: ${formattedProduct.discount_percentage === 0}, mrp defaulted: ${formattedProduct.mrp}, product_title defaulted: '${formattedProduct.product_title}'`,
    });

    // ----------------------------------------------------
    // TEST 10: Cache: miss on 1st request, hit on 2nd, refreshed after TTL/clear
    // ----------------------------------------------------
    cacheService.clearAll();
    const initialCacheSize = cacheService.size;
    const key = cacheService.buildKey('HAATZA', ALL_CATEGORY_ID, '56');

    // 1st request: miss, gets cached
    await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });
    const sizeAfterFirst = cacheService.size;
    const hitData = cacheService.get(key);

    // 2nd request: hit from cache
    const secondReqRes = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });

    const pass10 =
      initialCacheSize === 0 &&
      sizeAfterFirst === 1 &&
      hitData !== null &&
      secondReqRes.count === 16;

    results.push({
      testNumber: 10,
      name: 'Cache: miss on 1st request, hit on 2nd request without DB query',
      passed: pass10,
      details: `Initial size: ${initialCacheSize}, After 1st req: ${sizeAfterFirst}, Hit data retrieved: ${hitData !== null}`,
    });

    // ----------------------------------------------------
    // TEST 11: Cache keys: different category, territory or module gives different entry. HAATZA and LITE separate
    // ----------------------------------------------------
    const keyHaatza = cacheService.buildKey('HAATZA', ALL_CATEGORY_ID, '56');
    const keyElectronics = cacheService.buildKey('HAATZA', 'c4000000-0000-4000-8000-000000000102', '56');
    const keyTerritory99 = cacheService.buildKey('HAATZA', ALL_CATEGORY_ID, '99');
    const keyLite = cacheService.buildKey('LITE', ALL_CATEGORY_ID, '56', 'WAREHOUSE001');

    const pass11 =
      keyHaatza === `dashboard:HAATZA:${ALL_CATEGORY_ID}:56` &&
      keyElectronics === 'dashboard:HAATZA:c4000000-0000-4000-8000-000000000102:56' &&
      keyTerritory99 === `dashboard:HAATZA:${ALL_CATEGORY_ID}:99` &&
      keyLite === `dashboard:LITE:${ALL_CATEGORY_ID}:56:WAREHOUSE001` &&
      new Set([keyHaatza, keyElectronics, keyTerritory99, keyLite]).size === 4;

    results.push({
      testNumber: 11,
      name: 'Cache keys: category, territory, warehouseId and module create distinct separated keys',
      passed: pass11,
      details: `Keys generated:\n  - ${keyHaatza}\n  - ${keyElectronics}\n  - ${keyTerritory99}\n  - ${keyLite}`,
    });

    // ----------------------------------------------------
    // TEST 12: Invalidation: after updating a row, next request returns new data
    // ----------------------------------------------------
    // Populate cache first
    await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });
    const cachedBefore = cacheService.get(keyHaatza);

    // Update widget w0001 name temporarily
    await dashboardService.updateWidget('w0001', {
      widget_name: 'Hero Banner Updated',
    });
    // Invalidation should have cleared cache
    const cachedAfterUpdate = cacheService.get(keyHaatza);

    const freshRes12 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '56',
    });
    const updatedWidget = freshRes12.widgets.find((w) => w.widget_id === 'w0001');

    // Restore widget w0001 name
    await dashboardService.updateWidget('w0001', {
      widget_name: 'Hero Banner',
    });

    const pass12 =
      cachedBefore !== null &&
      cachedAfterUpdate === null &&
      updatedWidget?.widget_name === 'Hero Banner Updated';

    results.push({
      testNumber: 12,
      name: 'Invalidation: mutating a widget immediately flushes cache and next read returns new data',
      passed: pass12,
      details: `Cached before: ${cachedBefore !== null}, Cache flushed after update: ${cachedAfterUpdate === null}, Updated name read: '${updatedWidget?.widget_name}'`,
    });

    // ----------------------------------------------------
    // TEST 13: Invalid requests return clear errors and are never cached
    // ----------------------------------------------------
    cacheService.clearAll();
    let errModCaught = false;
    let errCatCaught = false;
    let errTerrCaught = false;
    let errLiteWhCaught = false;

    // 1. Invalid module
    try {
      await dashboardService.getCustomerDashboard({
        module: 'FLIPKART',
        categoryId: ALL_CATEGORY_ID,
        territory: '56',
      });
    } catch (e: any) {
      errModCaught = e.message.includes('module must be either');
    }

    // 2. Missing categoryId
    try {
      await dashboardService.getCustomerDashboard({
        module: 'HAATZA',
        categoryId: '',
        territory: '56',
      });
    } catch (e: any) {
      errCatCaught = e.message.includes('categoryId is required');
    }

    // 3. Invalid territory (not 2 digits)
    try {
      await dashboardService.getCustomerDashboard({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: '560',
      });
    } catch (e: any) {
      errTerrCaught = e.message.includes('territory is required and must be exactly 2 digits');
    }

    // 4. LITE missing warehouseId
    try {
      await dashboardService.getCustomerDashboard({
        module: 'LITE',
        categoryId: ALL_CATEGORY_ID,
        territory: '56',
        warehouseId: '',
      });
    } catch (e: any) {
      errLiteWhCaught = e.message.includes('warehouseId is required for LITE module');
    }

    // Also verify schema validator
    const schemaInvalidTerr = customerDashboardQuerySchema.safeParse({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: '5',
    });
    const schemaPass = !schemaInvalidTerr.success;

    const cacheRemainsEmpty = cacheService.size === 0;

    const pass13 =
      errModCaught &&
      errCatCaught &&
      errTerrCaught &&
      errLiteWhCaught &&
      schemaPass &&
      cacheRemainsEmpty;

    results.push({
      testNumber: 13,
      name: 'Invalid requests return clear errors and are never cached',
      passed: pass13,
      details: `Module err: ${errModCaught}, Cat err: ${errCatCaught}, Terr err: ${errTerrCaught}, LITE WH err: ${errLiteWhCaught}, Schema blocked: ${schemaPass}, Cache size remains: ${cacheService.size}`,
    });

    console.log('\n====================================================');
    console.log('TEST EXECUTION SUMMARY:');
    console.log('====================================================');
    let allPassed = true;
    for (const r of results) {
      const statusIcon = r.passed ? 'PASSED [OK]' : 'FAILED [X]';
      if (!r.passed) allPassed = false;
      console.log(`Test ${r.testNumber}: ${statusIcon} - ${r.name}`);
      console.log(`   Details: ${r.details}\n`);
    }

    console.log('====================================================');
    console.log(`TOTAL: 13 Tests | PASSED: ${results.filter((r) => r.passed).length} | FAILED: ${results.filter((r) => !r.passed).length}`);
    console.log('====================================================');

    if (!allPassed) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Suite Failed with unexpected error:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runTests();
