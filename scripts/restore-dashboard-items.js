const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function restoreDashboardItems(backupFilePath, isDryRun = false) {
  let fileToLoad = backupFilePath;

  if (!fileToLoad) {
    // Find the latest backup snapshot file in scratch
    const scratchDir = path.resolve(__dirname, '../scratch');
    const files = fs.readdirSync(scratchDir).filter(f => 
      (f.startsWith('backup_dashboard_snapshot_') || f.startsWith('backup_dashboard_items_')) && f.endsWith('.json')
    );
    if (files.length === 0) {
      throw new Error('No backup snapshot files found in scratch directory!');
    }
    files.sort();
    fileToLoad = path.join(scratchDir, files[files.length - 1]);
  }

  console.log(`Loading backup data from: ${fileToLoad}`);
  const rawData = JSON.parse(fs.readFileSync(fileToLoad, 'utf8'));

  // Normalize: could be an array of rows or an object with haatza_rows / rows
  let backupRows;
  if (Array.isArray(rawData)) {
    backupRows = rawData;
  } else if (rawData.haatza_rows && Array.isArray(rawData.haatza_rows)) {
    backupRows = rawData.haatza_rows;
  } else if (rawData.rows && Array.isArray(rawData.rows)) {
    backupRows = rawData.rows;
  } else {
    throw new Error('Unrecognized backup file format.');
  }

  // Filter only HAATZA rows (w0001..w0169) to ensure W017..W023 are NEVER touched
  const haatzaRows = backupRows.filter(r => /^w[0-9]{4}$/.test(r.widget_id));

  if (haatzaRows.length !== 169) {
    throw new Error(`Backup file is invalid: expected 169 HAATZA rows, found ${haatzaRows.length}`);
  }

  console.log(`HAATZA backup rows loaded: ${haatzaRows.length}`);

  if (isDryRun) {
    console.log('DRY RUN MODE ENABLED: Validating restore statements without executing on live database...');
    for (const r of haatzaRows) {
      if (!r.widget_id || !Array.isArray(r.items) || !r.updated_at) {
        throw new Error(`Invalid row in backup: ${JSON.stringify(r)}`);
      }
      if (/^W[0-9]{3}$/.test(r.widget_id)) {
        throw new Error(`SAFETY VIOLATION: Legacy row ${r.widget_id} found in restore targets! Aborting.`);
      }
    }
    console.log('DRY RUN SUCCESSFUL: All 169 HAATZA rows are valid. 0 legacy rows touched.');
    return { success: true, dryRun: true, rowCount: haatzaRows.length };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log('Starting restore in ONE transaction...');
  await client.query('BEGIN;');

  try {
    let totalRestored = 0;
    for (const r of haatzaRows) {
      const res = await client.query(
        `UPDATE dashboard 
         SET items = $1::jsonb, updated_at = $2::timestamptz, updated_by = $3 
         WHERE widget_id = $4;`,
        [JSON.stringify(r.items), new Date(r.updated_at).toISOString(), r.updated_by || 'admin1', r.widget_id]
      );

      if (res.rowCount !== 1) {
        throw new Error(`CRITICAL: Restore on ${r.widget_id} affected ${res.rowCount} rows instead of exactly 1! Rolling back.`);
      }
      totalRestored++;
    }

    if (totalRestored !== 169) {
      throw new Error(`CRITICAL: Total restored rows is ${totalRestored}, expected 169! Rolling back.`);
    }

    await client.query('COMMIT;');
    console.log(`RESTORE COMPLETE: Successfully restored all ${totalRestored} rows to their backup state.`);
    return { success: true, dryRun: false, rowCount: totalRestored };
  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('ERROR during restore transaction. Rolled back:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  const targetFile = process.argv.find(arg => arg.endsWith('.json'));
  restoreDashboardItems(targetFile, isDryRun).catch(console.error);
}

module.exports = { restoreDashboardItems };
