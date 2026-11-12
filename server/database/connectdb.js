import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host:     String(process.env.PG_HOST     || 'localhost'),
  port:     Number(process.env.PG_PORT     || 5432),
  database: String(process.env.PG_DATABASE || 'coffeedb'),
  user:     String(process.env.PG_USER     || 'postgres'),
  password: String(process.env.PG_PASSWORD || 'postgres'),
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('⚠️  Unexpected PostgreSQL pool error:', err.message);
});

// Test connection and log
const connectDB = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT version()');
    console.log(`✅ PostgreSQL connected: ${rows[0].version.split(',')[0]}`);
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

export { pool };
export default connectDB;
