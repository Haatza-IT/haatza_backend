const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function getFormattedTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}${MM}${dd}_${hh}${mm}${ss}`;
}

async function runBackup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    // 1. Fetch total count
    const totalCountRes = await client.query('SELECT COUNT(*) FROM dashboard;');
    const totalCount = parseInt(totalCountRes.rows[0].count, 10);
    console.log(`Current total rows in dashboard: ${totalCount}`);

    if (totalCount !== 176) {
      throw new Error(`Expected exactly 176 rows, found ${totalCount}! Aborting backup.`);
    }

    // 2. Fetch ALL 20 columns of ALL 176 rows
    const resAll176 = await client.query(
      `SELECT * FROM dashboard ORDER BY widget_id;`
    );
    const allRows = resAll176.rows;
    console.log(`Fetched all ${allRows.length} rows (all 20 columns).`);

    if (allRows.length !== 176) {
      throw new Error(`Expected 176 rows, found ${allRows.length}! Aborting backup.`);
    }

    // Separate HAATZA (w0001..w0169) and legacy LITE (W017..W023)
    const haatzaRows = allRows.filter(r => /^w[0-9]{4}$/.test(r.widget_id));
    const legacyRows = allRows.filter(r => /^W[0-9]{3}$/.test(r.widget_id));

    if (haatzaRows.length !== 169) {
      throw new Error(`Expected exactly 169 HAATZA rows, found ${haatzaRows.length}!`);
    }
    if (legacyRows.length !== 7) {
      throw new Error(`Expected exactly 7 legacy LITE rows, found ${legacyRows.length}!`);
    }

    // Ensure scratch directory exists
    const scratchDir = path.join(__dirname, '..', 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    const timestamp = getFormattedTimestamp();

    // 3. Save JSON backup of all 176 rows (all 20 columns)
    // Refuse if file exists (flag: 'wx')
    const backupJsonPath = path.join(scratchDir, `backup_dashboard_snapshot_${timestamp}.json`);
    if (fs.existsSync(backupJsonPath)) {
      throw new Error(`Backup file already exists: ${backupJsonPath}. Refusing to overwrite.`);
    }

    const backupData = {
      backup_timestamp: new Date().toISOString(),
      total_rows: allRows.length,
      columns_count: Object.keys(allRows[0]).length,
      haatza_rows_count: haatzaRows.length,
      legacy_rows_count: legacyRows.length,
      legacy_rows: legacyRows,
      haatza_rows: haatzaRows,
      all_rows: allRows
    };

    fs.writeFileSync(backupJsonPath, JSON.stringify(backupData, null, 2), { encoding: 'utf8', flag: 'wx' });
    console.log(`Saved JSON backup of ALL 176 rows to: ${backupJsonPath}`);

    // 4. Generate Rollback SQL (restores ONLY the 169 HAATZA rows, touches 0 legacy LITE rows)
    const rollbackSqlPath = path.join(scratchDir, `rollback_dashboard_snapshot_${timestamp}.sql`);
    if (fs.existsSync(rollbackSqlPath)) {
      throw new Error(`Rollback SQL file already exists: ${rollbackSqlPath}. Refusing to overwrite.`);
    }

    let sqlContent = `-- Rollback SQL for HAATZA Dashboard (restores 169 HAATZA rows w0001..w0169)\n`;
    sqlContent += `-- Generated at: ${new Date().toISOString()}\n`;
    sqlContent += `-- Source snapshot: backup_dashboard_snapshot_${timestamp}.json\n`;
    sqlContent += `-- Restores items, updated_at, and updated_by for w0001 to w0169\n`;
    sqlContent += `-- GUARANTEE: Exactly 169 UPDATE statements, 0 statements touching W017-W023\n\n`;
    sqlContent += `BEGIN;\n\n`;

    for (const row of haatzaRows) {
      // Escape JSON for single-quote literal in SQL: replace ' with ''
      const itemsJsonStr = JSON.stringify(row.items);
      const escapedJson = itemsJsonStr.replace(/'/g, "''");
      const updatedAtStr = row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString();
      const updatedByStr = (row.updated_by || 'admin1').replace(/'/g, "''");
      const widgetId = row.widget_id;

      sqlContent += `UPDATE dashboard SET items = '${escapedJson}'::jsonb, updated_at = '${updatedAtStr}'::timestamptz, updated_by = '${updatedByStr}' WHERE widget_id = '${widgetId}';\n`;
    }

    sqlContent += `\nCOMMIT;\n`;
    fs.writeFileSync(rollbackSqlPath, sqlContent, { encoding: 'utf8', flag: 'wx' });
    console.log(`Saved Rollback SQL to: ${rollbackSqlPath}`);

    console.log('BACKUP COMPLETED SUCCESSFULLY.');
    return {
      backupJsonPath,
      rollbackSqlPath,
      totalRows: allRows.length,
      haatzaCount: haatzaRows.length,
      legacyCount: legacyRows.length
    };
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runBackup().catch(err => {
    console.error('BACKUP FAILED:', err);
    process.exit(1);
  });
}

module.exports = { runBackup };
