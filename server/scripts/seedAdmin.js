import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'coffeedb',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});

const { rows } = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
if (rows.length > 0) {
  console.log('ℹ️  Admin already exists. Skipping.');
  await pool.end();
  process.exit(0);
}

const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash('admin123', salt);

await pool.query(
  `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,'admin')`,
  ['admin', 'admin@coffeeshop.com', hashed]
);

console.log('✅ Admin created!');
console.log('   Email:    admin@coffeeshop.com');
console.log('   Password: admin123');
console.log('⚠️  Change the password after first login!');

await pool.end();
process.exit(0);
