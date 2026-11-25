import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { generate169DashboardRows } from '../src/modules/dashboard/dashboard-seed.util';

dotenv.config();

/**
 * Standalone CLI runner to seed the 169 HAATZA dashboard rows.
 * Uses ON CONFLICT (widget_id) DO NOTHING: safe to re-run and never overwrites existing rows.
 */
export async function seedDashboardCli(): Promise<{ totalInserted: number; totalAttempted: number }> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const rows = generate169DashboardRows();
    console.log(`Generated ${rows.length} rows to seed.`);

    let inserted = 0;
    for (const row of rows) {
      const query = `
        INSERT INTO dashboard (
          widget_id, widget_name, widget_redirect_to, placement, sequence,
          territory, items, category_id, module, status,
          effective_from, effective_to, created_by, updated_by
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14
        )
        ON CONFLICT (widget_id) DO NOTHING;
      `;
      const values = [
        row.widget_id,
        row.widget_name,
        row.widget_redirect_to,
        row.placement,
        row.sequence,
        row.territory,
        JSON.stringify(row.items),
        row.category_id,
        row.module,
        row.status,
        row.effective_from,
        row.effective_to,
        row.created_by,
        row.updated_by,
      ];

      const res = await client.query(query, values);
      if (res.rowCount && res.rowCount > 0) {
        inserted++;
      }
    }

    console.log(`Seed completed: ${inserted} row(s) inserted out of ${rows.length} attempted.`);
    return { totalInserted: inserted, totalAttempted: rows.length };
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  seedDashboardCli().catch((err) => {
    console.error('Seed CLI failed:', err);
    process.exit(1);
  });
}
