const { pool } = require('./db');

const initDb = async () => {
  const client = await pool.connect();
  try {
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
  } finally {
    client.release();
  }
};

module.exports = initDb;
