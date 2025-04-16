require('dotenv').config();

const { db } = require('./client');

/**
 * Introspect columns for the given table names.
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
  const result = await db.execute({ sql, params: tableNames });
  return result.rows;
}

if (require.main === module) {
  introspectTableColumns(['Users', 'Families'])
    .then((rows) => {
      console.log('Table columns:', rows);
    })
    .catch((err) => {
      console.error('Introspection failed:', err);
    });
}
