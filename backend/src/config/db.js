const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE || 'quickhire',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || '',
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err.message);
  process.exit(1);
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    const db = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.split('/').pop()
      : `${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'quickhire'}`;
    console.log(`PostgreSQL connected: ${db}`);
    client.release();
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
