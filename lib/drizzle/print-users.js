require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function printUsers() {
  try {
    const result = await pool.query('SELECT * FROM "Users" LIMIT 10;');
    console.log(result.rows);
  } catch (err) {
    console.error('Failed to fetch Users:', err);
  } finally {
    await pool.end();
  }
}

printUsers();
