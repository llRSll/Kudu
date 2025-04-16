require('dotenv').config();

const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const statuses = ['ACTIVE', 'INACTIVE'];
const roles = ['user', 'admin', 'moderator'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
  return '+1' + Math.floor(1000000000 + Math.random() * 9000000000);
}

async function seedUsers() {
  const users = Array.from({ length: 15 }).map((_, i) => {
    const first = `User${i+1}`;
    const surname = `Test${i+1}`;
    const email = `user${i+1}@example.com`;
    const fullName = `${first} ${surname}`;
    return {
      id: crypto.randomUUID(),
      email,
      first_name: first,
      middle_initial: String.fromCharCode(65 + (i % 26)),
      surname,
      full_name: fullName,
      phone_number: randomPhone(),
      dob: randomDate(new Date(1980,0,1), new Date(2005,0,1)).toISOString().slice(0,10),
      tax_file_number: `TFN${1000 + i}`,
      avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${first}${surname}`,
      preferences: JSON.stringify({ theme: i % 2 === 0 ? 'dark' : 'light' }),
      status: statuses[i % statuses.length],
      role: roles[i % roles.length],
      created_at: new Date(),
      updated_at: new Date(),
      last_login: randomDate(new Date(2024,0,1), new Date()),
    };
  });

  const columns = Object.keys(users[0]);
  const values = users.map(u => `(${columns.map(c => `$${columns.length * users.indexOf(u) + columns.indexOf(c) + 1}`).join(',')})`).join(',\n');
  const flat = users.flatMap(u => columns.map(c => u[c]));
  const sql = `INSERT INTO "Users" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${values}`;
  try {
    await pool.query(sql, flat);
    console.log('Seeded 15 users!');
  } catch (err) {
    console.error('Failed to seed users:', err);
  } finally {
    await pool.end();
  }
}

seedUsers();
