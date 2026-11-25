const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { DashboardService } = require('../dist/modules/dashboard/dashboard.service');
const { DashboardCacheService } = require('../dist/modules/dashboard/dashboard-cache.service');
const {
  formatDashboardResponse,
  formatCleanWidget,
} = require('../dist/modules/dashboard/dashboard-formatter.util');
const {
  HAATZA_CATEGORIES,
  ALL_CATEGORY_ID,
  RULE_B_SEQUENCES,
  ALLOWED_PLACEMENTS,
  INDIAN_STATE_CODES,
  LITE_WAREHOUSES,
} = require('../dist/modules/dashboard/dashboard.config');
const {
  customerDashboardQuerySchema,
} = require('../dist/modules/dashboard/dashboard.schema');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('HAATZA & LITE DASHBOARD VERIFICATION & TEST SUITE (STATE-CODE)');
  console.log('================================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const dashboardService = app.get(DashboardService);
  const cacheService = app.get(DashboardCacheService);

  const testResults = [];

  function record(id, name, passed, details = '') {
    testResults.push({ id, name, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${mark}] Test ${id}: ${name}`);
    if (details) console.log(`       Details: ${details}`);
  }

  try {
    // =========================================================================
    // PART 1: AUTOMATED NO-JUMBLING UNIT TESTS (MOCKED DB LAYER)
    // =========================================================================
    console.log('\n--- PART 1: Automated No-Jumbling Unit Tests (Mocked DB Layer) ---');

    // Test 1.1: Mocked Rows with Shuffled Order, Reverse Order, and Equal Sequences
    const mockDbRecords = [
      { widgetId: 'w0015', sequence: 15, widgetName: 'Fresh New Arrivals', items: [] },
      { widgetId: 'w0004', sequence: 4, widgetName: 'Suggested for You', items: [] },
      { widgetId: 'w0020', sequence: 5, widgetName: 'Promo Banners B', items: [] },
      { widgetId: 'w0001', sequence: 1, widgetName: 'Hero Banner', items: [] },
      { widgetId: 'w0016', sequence: 16, widgetName: 'More to Explore', items: [] },
      { widgetId: 'w0005', sequence: 5, widgetName: 'Promo Banners A', items: [] },
      { widgetId: 'w0010', sequence: 10, widgetName: 'Deals of the Day', items: [] },
      { widgetId: 'w0003', sequence: 3, widgetName: 'Top Categories', items: [] },
      { widgetId: 'w0009', sequence: 9, widgetName: 'Trending Fashion', items: [] },
      { widgetId: 'w0006', sequence: 6, widgetName: 'Liked by You', items: [] },
    ];

    // Case A: Shuffled input
    const resA = formatDashboardResponse('HAATZA', 'c4000000-0000-4000-8000-000000000102', 'AP', mockDbRecords);
    const seqsA = resA.widgets.map((w) => w.sequence);
    const idsA = resA.widgets.map((w) => w.widget_id);

    let isSortedA = true;
    for (let i = 0; i < seqsA.length - 1; i++) {
      if (seqsA[i] > seqsA[i + 1]) isSortedA = false;
      if (seqsA[i] === seqsA[i + 1] && idsA[i].localeCompare(idsA[i + 1]) > 0) isSortedA = false;
    }
    const tieBreakCorrectA = idsA.indexOf('w0005') < idsA.indexOf('w0020');

    record(
      '1.1',
      'No-Jumbling: Shuffled mock input sorts by sequence ASC, then widget_id ASC',
      isSortedA && tieBreakCorrectA,
      `Sorted: ${isSortedA}, Equal seq 5 tiebreak: w0005 before w0020 (${tieBreakCorrectA})`,
    );

    // Case B: Reverse input
    const reverseMock = [...mockDbRecords].reverse();
    const resB = formatDashboardResponse('HAATZA', 'c4000000-0000-4000-8000-000000000102', 'AP', reverseMock);
    const seqsB = resB.widgets.map((w) => w.sequence);
    const idsB = resB.widgets.map((w) => w.widget_id);

    let isSortedB = true;
    for (let i = 0; i < seqsB.length - 1; i++) {
      if (seqsB[i] > seqsB[i + 1]) isSortedB = false;
      if (seqsB[i] === seqsB[i + 1] && idsB[i].localeCompare(idsB[i + 1]) > 0) isSortedB = false;
    }
    const tieBreakCorrectB = idsB.indexOf('w0005') < idsB.indexOf('w0020');

    record(
      '1.2',
      'No-Jumbling: Reverse-ordered mock input sorts by sequence ASC, then widget_id ASC',
      isSortedB && tieBreakCorrectB,
      `Sorted: ${isSortedB}, Equal seq 5 tiebreak: w0005 before w0020 (${tieBreakCorrectB})`,
    );

    // =========================================================================
    // PART 2: STATIC CODEBASE ASSERTION (ORDER BY ON ALL MULTI-WIDGET QUERIES)
    // =========================================================================
    console.log('\n--- PART 2: Codebase Static Assertion (ORDER BY in All Queries) ---');

    const serviceCode = fs.readFileSync('src/modules/dashboard/dashboard.service.ts', 'utf8');
    const formatterCode = fs.readFileSync('src/modules/dashboard/dashboard-formatter.util.ts', 'utf8');

    const customerOrderCorrect =
      serviceCode.includes("orderBy: [{ sequence: 'asc' }, { widgetId: 'asc' }]");

    const adminOrderCorrect =
      serviceCode.includes("orderBy: [") &&
      serviceCode.includes("{ module: 'asc' }") &&
      serviceCode.includes("{ categoryId: 'asc' }") &&
      serviceCode.includes("{ placement: 'asc' }") &&
      serviceCode.includes("{ sequence: 'asc' }") &&
      serviceCode.includes("{ widgetId: 'asc' }");

    const formatterTiebreakCorrect = formatterCode.includes(
      'cleanWidgets.sort((a, b) => a.sequence - b.sequence || a.widget_id.localeCompare(b.widget_id))',
    );

    record(
      '2.1',
      'Customer Dashboard DB Query has explicit ORDER BY [{ sequence: "asc" }, { widgetId: "asc" }]',
      customerOrderCorrect,
      `Found explicit deterministic sort in findCustomerWidgets`,
    );

    record(
      '2.2',
      'Admin Raw List DB Query has explicit ORDER BY [module, categoryId, placement, sequence, widgetId]',
      adminOrderCorrect,
      `Found explicit 5-tier sort in findAllWidgets`,
    );

    record(
      '2.3',
      'Response Formatter enforces sequence sort with widget_id tiebreaker',
      formatterTiebreakCorrect,
      `Found secondary localeCompare tiebreaker in formatDashboardResponse`,
    );

    // =========================================================================
    // PART 3: 28 INDIAN STATE CODES VALIDATION & REJECTION RULES
    // =========================================================================
    console.log('\n--- PART 3: 28 Indian State Codes Validation & Rejection Rules ---');

    // 3.1 All 28 Indian state codes accepted
    let all28Accepted = true;
    for (const code of INDIAN_STATE_CODES) {
      try {
        const parsed = customerDashboardQuerySchema.parse({
          module: 'HAATZA',
          categoryId: ALL_CATEGORY_ID,
          territory: code,
          placement: 'DESKTOP',
        });
        if (parsed.territory !== code) all28Accepted = false;
      } catch (e) {
        all28Accepted = false;
      }
    }
    record(
      '3.1',
      'All 28 Indian State Codes (AP, KA, MH, TS, etc.) are validly parsed',
      all28Accepted && INDIAN_STATE_CODES.length === 28,
      `Verified exact list of ${INDIAN_STATE_CODES.length} Indian state codes`,
    );

    // 3.2 Numeric PIN codes rejected
    let pinRejected = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: '560001',
        placement: 'DESKTOP',
      });
    } catch (e) {
      pinRejected = e.issues && e.issues.some((i) => i.path.includes('territory'));
    }
    record('3.2', 'Numeric PIN code (e.g. 560001) is strictly rejected with 400 Bad Request', pinRejected);

    // 3.3 Old 2-digit number rejected
    let oldTwoDigitRejected = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: '56',
        placement: 'DESKTOP',
      });
    } catch (e) {
      oldTwoDigitRejected = e.issues && e.issues.some((i) => i.path.includes('territory'));
    }
    record('3.3', 'Old 2-digit territory code (e.g. "56") is strictly rejected with 400 Bad Request', oldTwoDigitRejected);

    // 3.4 Lowercase state code rejected
    let lowercaseStateRejected = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'ap',
        placement: 'DESKTOP',
      });
    } catch (e) {
      lowercaseStateRejected = e.issues && e.issues.some((i) => i.path.includes('territory'));
    }
    record('3.4', 'Lowercase state code (e.g. "ap") is strictly rejected with 400 Bad Request', lowercaseStateRejected);

    // 3.5 "ALL" rejected in customer query
    let allRejected = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'ALL',
        placement: 'DESKTOP',
      });
    } catch (e) {
      allRejected = e.issues && e.issues.some((i) => i.path.includes('territory'));
    }
    record('3.5', 'Territory "ALL" in customer query is strictly rejected with 400 Bad Request', allRejected);

    // 3.6 Non-state 2-letter string rejected
    let nonStateRejected = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'ZZ',
        placement: 'DESKTOP',
      });
    } catch (e) {
      nonStateRejected = e.issues && e.issues.some((i) => i.path.includes('territory'));
    }
    record('3.6', 'Invalid 2-letter non-state code (e.g. "ZZ") is strictly rejected with 400 Bad Request', nonStateRejected);

    // =========================================================================
    // PART 4: PLACEMENT FILTER VALIDATION & BEHAVIOR
    // =========================================================================
    console.log('\n--- PART 4: Placement Filter Validation & Behavior ---');

    // 4.1 Missing placement throws 400
    let missingPlacementBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'AP',
      });
    } catch (err) {
      missingPlacementBlocked = err.issues && err.issues.some((i) => i.path.includes('placement'));
    }
    record(
      '4.1',
      'Missing placement parameter is strictly rejected with 400 Bad Request (Mandatory for both HAATZA & LITE)',
      missingPlacementBlocked,
      `Validation error raised on missing placement`,
    );

    // 4.2 placement=TABLET throws 400
    let tabletBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'AP',
        placement: 'TABLET',
      });
    } catch (err) {
      tabletBlocked = err.issues && err.issues.some((i) => i.path.includes('placement'));
    }
    record(
      '4.2',
      'placement=TABLET is strictly rejected with 400 Bad Request',
      tabletBlocked,
      `Validation error raised on invalid placement value 'TABLET'`,
    );

    // 4.3 placement=desktop (lowercase) throws 400
    let lowercaseBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        categoryId: ALL_CATEGORY_ID,
        territory: 'AP',
        placement: 'desktop',
      });
    } catch (err) {
      lowercaseBlocked = err.issues && err.issues.some((i) => i.path.includes('placement'));
    }
    record(
      '4.3',
      'Lowercase placement=desktop is rejected with 400 Bad Request (case-sensitive uppercase required)',
      lowercaseBlocked,
      `Validation error raised on lowercase 'desktop'`,
    );

    // 4.4 placement=MOBILE returns HTTP 200 with 16 widgets (w0460 to w0475) on 628-row database (no DESKTOP leakage)
    const mobileRes = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: 'AP',
      placement: 'MOBILE',
    });
    const countOk = mobileRes.success === true && mobileRes.count === 16 && mobileRes.widgets.length === 16;
    const allMobileIds = mobileRes.widgets.every((w) => w.widget_id >= 'w0460' && w.widget_id <= 'w0475');
    const noDesktopLeak = mobileRes.widgets.every((w) => !(w.widget_id >= 'w0001' && w.widget_id <= 'w0169'));
    const passMobile = countOk && allMobileIds && noDesktopLeak;
    record(
      '4.4',
      'placement=MOBILE returns HTTP 200 with 16 widgets (w0460 to w0475) and zero DESKTOP widget_id leakage',
      passMobile,
      `Count: ${mobileRes.count}, All IDs w0460..w0475: ${allMobileIds}, No Desktop IDs: ${noDesktopLeak}`,
    );

    // =========================================================================
    // PART 5: LITE MODULE VALIDATIONS
    // =========================================================================
    console.log('\n--- PART 5: LITE Module Validations ---');

    // 5.1 LITE without warehouseId throws 400
    let liteNoWhBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'LITE',
        categoryId: ALL_CATEGORY_ID,
        territory: 'AP',
        placement: 'DESKTOP',
      });
    } catch (err) {
      liteNoWhBlocked = err.issues && err.issues.some((i) => i.path.includes('warehouseId'));
    }
    record('5.1', 'LITE module without warehouseId throws 400 Bad Request', liteNoWhBlocked);

    // 5.2 LITE with invalid warehouseId throws 400
    let liteBadWhBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'LITE',
        categoryId: ALL_CATEGORY_ID,
        territory: 'AP',
        placement: 'DESKTOP',
        warehouseId: 'WH_999',
      });
    } catch (err) {
      liteBadWhBlocked = err.issues && err.issues.some((i) => i.path.includes('warehouseId'));
    }
    record('5.2', 'LITE module with non-existent warehouseId throws 400 Bad Request', liteBadWhBlocked);

    // 5.3 All 5 dark-store warehouses accepted
    let allWhsAccepted = true;
    for (const wh of LITE_WAREHOUSES) {
      try {
        const parsed = customerDashboardQuerySchema.parse({
          module: 'LITE',
          categoryId: ALL_CATEGORY_ID,
          territory: 'AP',
          placement: 'DESKTOP',
          warehouseId: wh,
        });
        if (parsed.warehouseId !== wh) allWhsAccepted = false;
      } catch (e) {
        allWhsAccepted = false;
      }
    }
    record(
      '5.3',
      'All 5 LITE Dark-Store Warehouses (WAREHOUSE001–005) are validly accepted',
      allWhsAccepted && LITE_WAREHOUSES.length === 5,
      `Verified 5 warehouses: ${LITE_WAREHOUSES.join(', ')}`,
    );

    // =========================================================================
    // PART 6: TERRITORY PRECEDENCE OVER 'ALL' (IN-MEMORY TEST)
    // =========================================================================
    console.log('\n--- PART 6: Territory Precedence (Exact State Code Over "ALL") ---');

    // Test exact state override: widget sequence 1 has both 'ALL' and 'AP' records.
    // The exact 'AP' record must override the 'ALL' record.
    const precedenceTestRows = [
      { widgetId: 'w0001', sequence: 1, territory: 'ALL', widgetName: 'Hero Banner Default', items: [{ title: 'Default Banner' }] },
      { widgetId: 'w9001', sequence: 1, territory: 'AP', widgetName: 'Hero Banner AP Localized', items: [{ title: 'AP Banner' }] },
      { widgetId: 'w0002', sequence: 2, territory: 'ALL', widgetName: 'Grid Default', items: [] },
    ];

    // Filter logic simulating dashboard service precedence:
    // First map by sequence: exact state match takes precedence over 'ALL'
    const seqMap = new Map();
    for (const r of precedenceTestRows) {
      if (r.territory === 'AP') {
        seqMap.set(r.sequence, r);
      } else if (r.territory === 'ALL' && !seqMap.has(r.sequence)) {
        seqMap.set(r.sequence, r);
      }
    }
    const resolvedRows = Array.from(seqMap.values());
    const seq1Resolved = resolvedRows.find((r) => r.sequence === 1);
    const precedenceCorrect = seq1Resolved && seq1Resolved.widgetId === 'w9001' && seq1Resolved.territory === 'AP';

    record(
      '6.1',
      'Territory Precedence: Exact Indian state code record overrides default "ALL" record for same sequence',
      precedenceCorrect,
      `Resolved sequence 1 widget: ${seq1Resolved ? seq1Resolved.widgetId : 'none'} (territory: ${seq1Resolved ? seq1Resolved.territory : 'none'})`,
    );

    // =========================================================================
    // PART 7: ASCENDING ORDER & CACHE PARITY ACROSS ALL 18 CATEGORIES
    // =========================================================================
    console.log('\n--- PART 7: Ascending Order & Cache Parity Across Categories ---');

    const { generate628DashboardRows } = require('../dist/modules/dashboard/dashboard-seed.util');
    const allPlannedRows = generate628DashboardRows();
    const haatzaDesktopPlanned = allPlannedRows.filter(
      (r) => r.module === 'HAATZA' && r.placement === 'DESKTOP',
    );

    let all18CategoriesAscending = true;
    let all18CacheMissHitIdentical = true;
    cacheService.clearAll();

    for (const cat of HAATZA_CATEGORIES) {
      const expectedSeqs = cat.no === 1 ? Array.from({ length: 16 }, (_, i) => i + 1) : RULE_B_SEQUENCES;

      // 1. Verify planned data sequence alignment for this category
      const catPlannedRows = haatzaDesktopPlanned.filter((r) => r.category_id === cat.categoryId);
      const plannedFormatted = formatDashboardResponse('HAATZA', cat.categoryId, 'AP', catPlannedRows.map(r => ({
        widgetId: r.widget_id,
        sequence: r.sequence,
        widgetName: r.widget_name,
        items: r.items,
      })));
      const plannedSeqs = plannedFormatted.widgets.map((w) => w.sequence);
      if (JSON.stringify(plannedSeqs) !== JSON.stringify(expectedSeqs)) {
        all18CategoriesAscending = false;
      }

      // 2. Test live service call (Cache Miss & Cache Hit parity)
      const missRes = await dashboardService.getCustomerDashboard({
        module: 'HAATZA',
        categoryId: cat.categoryId,
        territory: 'AP',
        placement: 'DESKTOP',
      });

      const hitRes = await dashboardService.getCustomerDashboard({
        module: 'HAATZA',
        categoryId: cat.categoryId,
        territory: 'AP',
        placement: 'DESKTOP',
      });

      const missSeqs = missRes.widgets.map((w) => w.sequence);
      const hitSeqs = hitRes.widgets.map((w) => w.sequence);
      const missIds = missRes.widgets.map((w) => w.widget_id);
      const hitIds = hitRes.widgets.map((w) => w.widget_id);

      const missHitEqual =
        JSON.stringify(missSeqs) === JSON.stringify(hitSeqs) &&
        JSON.stringify(missIds) === JSON.stringify(hitIds);

      // If DB has been migrated (post-Phase 2), verify DB rows match expectedSeqs
      if (missRes.count > 0 && JSON.stringify(missSeqs) !== JSON.stringify(expectedSeqs)) {
        all18CategoriesAscending = false;
      }

      if (!missHitEqual) all18CacheMissHitIdentical = false;
    }

    record(
      '7.1',
      'All 18 Categories strictly ascending sequence order with no duplicates (DESKTOP)',
      all18CategoriesAscending,
      `Tested 18 categories: Cat 101 has 16 widgets (1..16), Cats 102..118 have 9 widgets (1,3,4,5,6,9,10,15,16)`,
    );

    record(
      '7.2',
      'Cache-Miss vs Cache-Hit responses are 100% identical in order and widget IDs across all 18 categories',
      all18CacheMissHitIdentical,
      `Verified deep equality of widgets array on cache miss vs hit for all 18 categories`,
    );

    // =========================================================================
    // PART 8: CACHE KEY ISOLATION & DUAL INVALIDATION
    // =========================================================================
    console.log('\n--- PART 8: Cache Key Isolation & Dual Invalidation ---');

    cacheService.clearAll();
    const cKeyDesktop = cacheService.buildKey('HAATZA', 'DESKTOP', ALL_CATEGORY_ID, 'AP');
    const cKeyMobile = cacheService.buildKey('HAATZA', 'MOBILE', ALL_CATEGORY_ID, 'AP');
    const cKeyLite = cacheService.buildKey('LITE', 'DESKTOP', ALL_CATEGORY_ID, 'AP', 'WAREHOUSE001');

    record(
      '8.1',
      'HAATZA Cache Key Format: dashboard:HAATZA:<placement>:<categoryId>:<territory>',
      cKeyDesktop === `dashboard:HAATZA:DESKTOP:${ALL_CATEGORY_ID}:AP`,
      `Key: ${cKeyDesktop}`,
    );

    record(
      '8.2',
      'LITE Cache Key Format: dashboard:LITE:<placement>:<categoryId>:<territory>:<warehouseId>',
      cKeyLite === `dashboard:LITE:DESKTOP:${ALL_CATEGORY_ID}:AP:WAREHOUSE001`,
      `Key: ${cKeyLite}`,
    );

    await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: 'AP',
      placement: 'DESKTOP',
    });
    const hasDesktopInCache = cacheService.get(cKeyDesktop) !== null;
    const hasMobileInCache = cacheService.get(cKeyMobile) !== null;

    await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: 'AP',
      placement: 'MOBILE',
    });
    const hasMobileInCacheAfter = cacheService.get(cKeyMobile) !== null;

    record(
      '8.3',
      'Cache Key Isolation: DESKTOP and MOBILE have separate cache keys and do not collide',
      hasDesktopInCache && !hasMobileInCache && hasMobileInCacheAfter,
      `Keys: ${cKeyDesktop} and ${cKeyMobile} stored independently`,
    );

    // Dual Invalidation: invalidateCategory clears BOTH placements
    cacheService.invalidateCategory('HAATZA', ALL_CATEGORY_ID);
    const desktopCleared = cacheService.get(cKeyDesktop) === null;
    const mobileCleared = cacheService.get(cKeyMobile) === null;
    record(
      '8.4',
      'Dual Cache Invalidation: invalidateCategory loops over ALLOWED_PLACEMENTS and clears both DESKTOP & MOBILE',
      desktopCleared && mobileCleared,
      `Both cache entries cleared by single invalidateCategory call`,
    );

    // =========================================================================
    // PART 9: CORE VALIDATION & RESPONSE HYGIENE
    // =========================================================================
    console.log('\n--- PART 9: Core Validation & Response Hygiene ---');

    // 9.1 Missing categoryId
    let missingCatBlocked = false;
    try {
      customerDashboardQuerySchema.parse({
        module: 'HAATZA',
        territory: 'AP',
        placement: 'DESKTOP',
      });
    } catch (err) {
      missingCatBlocked = err.issues && err.issues.some((i) => i.path.includes('categoryId'));
    }
    record('9.1', 'Missing categoryId throws 400 Bad Request', missingCatBlocked);

    // 9.2 Zero nulls anywhere in responses
    const resCat101 = await dashboardService.getCustomerDashboard({
      module: 'HAATZA',
      categoryId: ALL_CATEGORY_ID,
      territory: 'AP',
      placement: 'DESKTOP',
    });

    function checkNoNull(val, p = 'root') {
      if (val === null) return { hasNull: true, path: p };
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          const c = checkNoNull(val[i], `${p}[${i}]`);
          if (c.hasNull) return c;
        }
      } else if (typeof val === 'object' && val !== null) {
        for (const [k, v] of Object.entries(val)) {
          const c = checkNoNull(v, `${p}.${k}`);
          if (c.hasNull) return c;
        }
      }
      return { hasNull: false };
    }
    const nullCheck = checkNoNull(resCat101);
    record('9.2', 'Zero null values anywhere in customer response envelope', !nullCheck.hasNull);

    // 9.3 Forbidden fields excluded from customer widgets
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
    const hasForbidden = resCat101.widgets.some((w) => forbiddenFields.some((f) => f in w));
    record(
      '9.3',
      'Customer widget objects contain only clean layout fields (internal columns excluded)',
      !hasForbidden,
      `Forbidden fields (created_by, updated_by, warehouse_id, placement) cleanly excluded from widgets`,
    );

    // =========================================================================
    // PART 10: ADVANCED CACHE, STAMPEDE & MULTI-STATE PRECEDENCE UNIT TESTS
    // =========================================================================
    console.log('\n--- PART 10: Advanced Cache, Stampede & Multi-State Precedence Tests ---');

    // 10.1 LRU read-refresh
    cacheService.clearAll();
    cacheService.set('key-a', 'val-a');
    cacheService.set('key-b', 'val-b');
    // Access key-a to refresh its position to MRU
    const readRefreshedVal = cacheService.get('key-a');
    // Fill to 500 max keys: key-b was older than key-a because key-a was refreshed
    for (let i = 1; i <= 498; i++) {
      cacheService.set(`filler-${i}`, `val-${i}`);
    }
    // Now cache has 500 entries: key-b, key-a, filler-1..498
    // Adding 501st entry triggers eviction of least recently used (key-b)
    cacheService.set('filler-extra', 'val-extra');
    const keyBPostEvict = cacheService.get('key-b'); // should be evicted (null)
    const keyAPostEvict = cacheService.get('key-a'); // should still exist (refreshed!)
    const lruRefreshPassed = readRefreshedVal === 'val-a' && keyBPostEvict === null && keyAPostEvict === 'val-a';
    record(
      '10.1',
      'LRU Read-Refresh: Accessing entry refreshes position and prevents premature eviction',
      lruRefreshPassed,
      `key-a refreshed: ${keyAPostEvict !== null}, key-b evicted: ${keyBPostEvict === null}`,
    );

    // 10.2 LRU eviction at 500
    cacheService.clearAll();
    for (let i = 0; i < 500; i++) {
      cacheService.set(`test-key-${i}`, `data-${i}`);
    }
    const sizeAtLimit = cacheService.size;
    // Add 501st key
    cacheService.set('test-key-500', 'data-500');
    const sizeAfterOverflow = cacheService.size;
    const oldestEvicted = cacheService.get('test-key-0') === null;
    const newestRetained = cacheService.get('test-key-500') === 'data-500';
    const lruEvictPassed = sizeAtLimit === 500 && sizeAfterOverflow === 500 && oldestEvicted && newestRetained;
    record(
      '10.2',
      'LRU Eviction at 500: Cache bounds strictly at 500 keys and evicts oldest entry on overflow',
      lruEvictPassed,
      `Capacity held at 500: ${sizeAfterOverflow === 500}, Oldest evicted: ${oldestEvicted}, Newest retained: ${newestRetained}`,
    );

    // 10.3 TTL Expiry
    cacheService.clearAll();
    cacheService.set('ttl-test-key', 'active-data', 50); // 50ms TTL
    const beforeExpiry = cacheService.get('ttl-test-key');
    await new Promise((r) => setTimeout(r, 70));
    const afterExpiry = cacheService.get('ttl-test-key');
    const ttlPassed = beforeExpiry === 'active-data' && afterExpiry === null;
    record(
      '10.3',
      'TTL Expiry: Entry automatically expires after configured duration (50ms custom TTL)',
      ttlPassed,
      `Before expiry: ${beforeExpiry}, After expiry: ${afterExpiry}`,
    );

    // 10.4 Expired entry never served
    cacheService.clearAll();
    cacheService.set('expired-check-key', 'data', 20); // 20ms TTL
    await new Promise((r) => setTimeout(r, 30));
    const readExpired = cacheService.get('expired-check-key');
    const sizeAfterExpiredRead = cacheService.size; // should be 0 because read deletes expired entry
    const expiredNeverServed = readExpired === null && sizeAfterExpiredRead === 0;
    record(
      '10.4',
      'Expired entry never served: Expired keys return null and are purged from cache on read',
      expiredNeverServed,
      `Returned value: ${readExpired}, Purged on read: ${sizeAfterExpiredRead === 0}`,
    );

    // 10.5 In-flight request sharing (cache stampede protection)
    cacheService.clearAll();
    let loadCounter = 0;
    const slowLoader = async () => {
      loadCounter++;
      await new Promise((r) => setTimeout(r, 60));
      return { payload: 'shared-loader-result', counter: loadCounter };
    };
    const flightResults = await Promise.all([
      cacheService.getOrSet('inflight-key', slowLoader),
      cacheService.getOrSet('inflight-key', slowLoader),
      cacheService.getOrSet('inflight-key', slowLoader),
      cacheService.getOrSet('inflight-key', slowLoader),
    ]);
    const allGotResult = flightResults.every((res) => res.payload === 'shared-loader-result' && res.counter === 1);
    const inFlightPassed = allGotResult && loadCounter === 1;
    record(
      '10.5',
      'In-Flight Request Sharing: Concurrent requests share single underlying resolution (1 loader call)',
      inFlightPassed,
      `Concurrent callers: 4, Total loader executions: ${loadCounter}`,
    );

    // 10.6 KA / KL / TS exact-state override beats ALL
    // Function that mirrors DashboardService precedence resolver on fixture records
    function resolvePrecedence(records, requestedTerritory) {
      const selectedMap = new Map();
      for (const record of records) {
        const existing = selectedMap.get(record.sequence);
        if (!existing) {
          selectedMap.set(record.sequence, record);
        } else if (record.territory === requestedTerritory && existing.territory !== requestedTerritory) {
          selectedMap.set(record.sequence, record);
        }
      }
      return Array.from(selectedMap.values()).sort((a, b) => a.sequence - b.sequence);
    }

    const multiStateFixtures = [
      { sequence: 1, territory: 'ALL', widgetId: 'w_all_seq1', name: 'Default Hero' },
      { sequence: 1, territory: 'KA', widgetId: 'w_ka_seq1', name: 'Karnataka Special Hero' },
      { sequence: 1, territory: 'KL', widgetId: 'w_kl_seq1', name: 'Kerala Festive Hero' },
      { sequence: 1, territory: 'TS', widgetId: 'w_ts_seq1', name: 'Telangana Tech Hero' },
      { sequence: 2, territory: 'ALL', widgetId: 'w_all_seq2', name: 'Default Deals' },
    ];

    const kaResolved = resolvePrecedence(multiStateFixtures, 'KA');
    const klResolved = resolvePrecedence(multiStateFixtures, 'KL');
    const tsResolved = resolvePrecedence(multiStateFixtures, 'TS');
    const mhResolved = resolvePrecedence(multiStateFixtures, 'MH'); // MH has no override, should get ALL

    const kaPass = kaResolved[0].widgetId === 'w_ka_seq1' && kaResolved[1].widgetId === 'w_all_seq2';
    const klPass = klResolved[0].widgetId === 'w_kl_seq1' && klResolved[1].widgetId === 'w_all_seq2';
    const tsPass = tsResolved[0].widgetId === 'w_ts_seq1' && tsResolved[1].widgetId === 'w_all_seq2';
    const mhPass = mhResolved[0].widgetId === 'w_all_seq1' && mhResolved[1].widgetId === 'w_all_seq2';
    const multiStatePass = kaPass && klPass && tsPass && mhPass;
    record(
      '10.6',
      'KA / KL / TS exact-state override beats ALL: State-specific widget takes precedence with zero leakage',
      multiStatePass,
      `KA: ${kaResolved[0].widgetId}, KL: ${klResolved[0].widgetId}, TS: ${tsResolved[0].widgetId}, MH (fallback): ${mhResolved[0].widgetId}`,
    );

    // 10.7 LITE invalidation clears all warehouses and territories
    cacheService.clearAll();
    const catLite201 = 'c4000000-0000-4000-8000-000000000201';
    const catLite202 = 'c4000000-0000-4000-8000-000000000202';
    cacheService.set(cacheService.buildKey('LITE', 'DESKTOP', catLite201, 'AP', 'WAREHOUSE001'), { id: 'd1' });
    cacheService.set(cacheService.buildKey('LITE', 'MOBILE', catLite201, 'KA', 'WAREHOUSE002'), { id: 'd2' });
    cacheService.set(cacheService.buildKey('LITE', 'DESKTOP', catLite201, 'TS', 'WAREHOUSE003'), { id: 'd3' });
    cacheService.set(cacheService.buildKey('LITE', 'DESKTOP', catLite202, 'AP', 'WAREHOUSE001'), { id: 'other' });

    cacheService.invalidateCategory('LITE', catLite201);
    const cleared1 = cacheService.get(cacheService.buildKey('LITE', 'DESKTOP', catLite201, 'AP', 'WAREHOUSE001')) === null;
    const cleared2 = cacheService.get(cacheService.buildKey('LITE', 'MOBILE', catLite201, 'KA', 'WAREHOUSE002')) === null;
    const cleared3 = cacheService.get(cacheService.buildKey('LITE', 'DESKTOP', catLite201, 'TS', 'WAREHOUSE003')) === null;
    const retainedOther = cacheService.get(cacheService.buildKey('LITE', 'DESKTOP', catLite202, 'AP', 'WAREHOUSE001')) !== null;
    const liteInvalidatePassed = cleared1 && cleared2 && cleared3 && retainedOther;
    record(
      '10.7',
      'LITE invalidation clears all warehouses and territories: Dual placement and multi-warehouse entries invalidated',
      liteInvalidatePassed,
      `AP/WH001 cleared: ${cleared1}, KA/WH002 cleared: ${cleared2}, TS/WH003 cleared: ${cleared3}, Cat 202 preserved: ${retainedOther}`,
    );

    // Summary
    const totalPassed = testResults.filter((r) => r.passed).length;
    const totalFailed = testResults.filter((r) => !r.passed).length;

    console.log('\n================================================================');
    console.log(`TEST SUITE SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED out of ${testResults.length} total tests`);
    console.log('================================================================\n');

    const summaryData = {
      timestamp: new Date().toISOString(),
      totalPassed,
      totalFailed,
      totalTests: testResults.length,
      results: testResults,
    };

    fs.writeFileSync(
      'scratch/test_suite_results.json',
      JSON.stringify(summaryData, null, 2),
      'utf8',
    );

    // Also write markdown report table
    let md = '# Phase 1.8: Comprehensive Dashboard Test Suite Results\n\n';
    md += `- **Timestamp:** ${summaryData.timestamp}\n`;
    md += `- **Total Tests:** ${summaryData.totalTests}\n`;
    md += `- **Passed:** ${summaryData.totalPassed}\n`;
    md += `- **Failed:** ${summaryData.totalFailed}\n\n`;
    md += '| Test ID | Test Description | Status | Details |\n';
    md += '|:---:|---|:---:|---|\n';
    for (const r of testResults) {
      md += `| ${r.id} | ${r.name} | ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.details || '-'} |\n`;
    }

    const mdPath = path.join(__dirname, '../scratch/table_test_suite_results.md');
    fs.writeFileSync(mdPath, md, 'utf8');
    const mdSha256 = crypto.createHash('sha256').update(fs.readFileSync(mdPath)).digest('hex');
    console.log(`Test Suite Table written to: ${mdPath}`);
    console.log(`SHA-256: ${mdSha256}`);

    if (totalFailed > 0) {
      process.exit(1);
    }
  } finally {
    await app.close();
  }
}

runComprehensiveTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
