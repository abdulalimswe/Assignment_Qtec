const { pool } = require('./db');

const initDb = async () => {
  const client = await pool.connect();
  try {
    // CREATE TABLE statements are no-ops for the JSON store and real DDL for PostgreSQL
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(100)  NOT NULL,
        company     VARCHAR(100)  NOT NULL,
        location    VARCHAR(255)  NOT NULL,
        category    VARCHAR(100)  NOT NULL,
        description TEXT          NOT NULL,
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id          SERIAL PRIMARY KEY,
        job_id      INTEGER       NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        name        VARCHAR(100)  NOT NULL,
        email       VARCHAR(255)  NOT NULL,
        resume_link TEXT          NOT NULL,
        cover_note  TEXT          NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Database tables initialised');

    // Auto-seed when table is empty
    const { rows } = await client.query('SELECT COUNT(*) AS count FROM jobs');
    const count = parseInt(rows[0].count, 10);
    if (count === 0) {
      console.log('Seeding database with sample jobs...');
      await require('./seed').run(client);
    }
  } finally {
    client.release();
  }
};

module.exports = initDb;
