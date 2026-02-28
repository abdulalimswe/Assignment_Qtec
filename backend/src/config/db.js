const { Pool } = require('pg');

// ─── Pool configuration ───────────────────────────────────────────────────────
const baseConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host:     process.env.PG_HOST     || 'localhost',
      port:     Number(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE || 'quickhire',
      user:     process.env.PG_USER     || 'postgres',
      password: process.env.PG_PASSWORD || '',
    };

// In a serverless environment each function instance handles a small number of
// concurrent requests, so a large pool wastes limited DB connections.
const pool = new Pool({
  ...baseConfig,
  max:                     process.env.NODE_ENV === 'production' ? 2 : 10,
  idleTimeoutMillis:       10_000,  // release idle clients quickly
  connectionTimeoutMillis: 15_000,  // allow Render free-tier DB to wake up (~10s)
});

pool.on('error', (err) => {
  // Log but do NOT call process.exit() — in serverless, killing the process
  // prevents Vercel from returning a proper HTTP error response.
  console.error('Unexpected PostgreSQL client error:', err.message);
});

// ─── Test connectivity (called once at cold-start via api/index.js) ───────────
const connectDB = async () => {
  const client = await pool.connect();
  const dbName = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.split('/').pop().split('?')[0]
    : `${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'quickhire'}`;
  console.log(`PostgreSQL connected: ${dbName}`);
  client.release();
};

module.exports = { pool, connectDB };
