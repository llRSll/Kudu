require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * @param {string[]} tableNames
 * @returns {Promise<any[]>}
 */
async function introspectTableColumns(tableNames) {
  const placeholders = tableNames.map((_x, i) => `$${i + 1}`).join(', ');
  const sql = `SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name IN (${placeholders})
    AND table_schema = 'public'
    ORDER BY table_name, ordinal_position;`;
  const result = await pool.query(sql, tableNames);
  return result.rows;
}

if (require.main === module) {
  introspectTableColumns(['Users', 'Families'])
    .then((rows) => {
      console.log('Table columns:', rows);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Introspection failed:', err);
      process.exit(1);
    });
}
