require('dotenv').config();

const { db } = require('./client');
const { users } = require('./schema');

async function testDrizzleConnection() {
  try {
    // Try to select from users table (adjust to a table that exists in your DB)
    const result = await db.execute(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
console.log('Tables in your database:', result);
    return true;
  } catch (error) {
    console.error('Drizzle connection failed:', error);
    return false;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testDrizzleConnection();
}
