const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function backup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log('Querying all 169 rows for backup...');
  const res = await client.query(`
    SELECT widget_id, items, updated_at, updated_by
    FROM dashboard
    ORDER BY widget_id ASC;
  `);

  if (res.rows.length !== 169) {
    throw new Error(`Expected exactly 169 rows to backup, found ${res.rows.length}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const scratchDir = path.resolve(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const jsonPath = path.join(scratchDir, `backup_dashboard_items_${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(res.rows, null, 2), 'utf8');
  console.log(`JSON Backup saved to: ${jsonPath}`);

  // Also generate rollback SQL
  const sqlLines = [
    '-- AUTOMATIC ROLLBACK SCRIPT FOR DASHBOARD ITEMS',
    `-- Generated At: ${new Date().toISOString()}`,
    'BEGIN;'
  ];

  for (const r of res.rows) {
    const escapedItems = JSON.stringify(r.items).replace(/'/g, "''");
    const escapedUpdatedBy = String(r.updated_by || 'admin1').replace(/'/g, "''");
    const updatedAtIso = new Date(r.updated_at).toISOString();
    sqlLines.push(
      `UPDATE dashboard SET items = '${escapedItems}'::jsonb, updated_at = '${updatedAtIso}'::timestamptz, updated_by = '${escapedUpdatedBy}' WHERE widget_id = '${r.widget_id}';`
    );
  }
  sqlLines.push('COMMIT;');

  const sqlPath = path.join(scratchDir, `rollback_dashboard_items_${timestamp}.sql`);
  fs.writeFileSync(sqlPath, sqlLines.join('\n'), 'utf8');
  console.log(`Rollback SQL saved to: ${sqlPath}`);

  await client.end();
  return { jsonPath, sqlPath, rowCount: res.rows.length };
}

if (require.main === module) {
  backup().catch(console.error);
}

module.exports = { backup };
