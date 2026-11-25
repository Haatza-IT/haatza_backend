const { Client } = require('pg');
require('dotenv').config();
const { ALL_169_WIDGET_ITEMS } = require('./data/mock-dashboard-data');

async function updateAllDashboardItems() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log('Starting atomic update of all 169 dashboard rows inside ONE transaction...');
  await client.query('BEGIN;');

  try {
    let totalUpdated = 0;
    const widgetIds = Object.keys(ALL_169_WIDGET_ITEMS);

    if (widgetIds.length !== 169) {
      throw new Error(`Expected exactly 169 widget definitions, found ${widgetIds.length}`);
    }

    for (const widgetId of widgetIds) {
      const items = ALL_169_WIDGET_ITEMS[widgetId];
      const res = await client.query(
        `UPDATE dashboard 
         SET items = $1::jsonb, updated_at = NOW(), updated_by = $2 
         WHERE widget_id = $3;`,
        [JSON.stringify(items), 'admin1', widgetId]
      );

      if (res.rowCount !== 1) {
        throw new Error(`CRITICAL: UPDATE on ${widgetId} affected ${res.rowCount} rows instead of exactly 1! Rolling back.`);
      }
      totalUpdated++;
    }

    if (totalUpdated !== 169) {
      throw new Error(`CRITICAL: Total updated rows is ${totalUpdated}, expected 169! Rolling back.`);
    }

    await client.query('COMMIT;');
    console.log(`SUCCESS: All ${totalUpdated} rows updated cleanly in ONE transaction.`);
    return { success: true, totalUpdated };
  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('ERROR during update transaction. Rolled back successfully:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  updateAllDashboardItems().catch(console.error);
}

module.exports = { updateAllDashboardItems };
