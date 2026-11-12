/**
 * Run once to create all tables in PostgreSQL.
 * Usage: node scripts/setupDb.js
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import pg from 'pg';

const pool = new pg.Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'coffeedb',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});

const sql = readFileSync(join(__dirname, '../database/schema.sql'), 'utf8');

try {
  await pool.query(sql);
  console.log('✅ Database schema applied successfully!');
} catch (err) {
  console.error('❌ Schema error:', err.message);
} finally {
  await pool.end();
}
