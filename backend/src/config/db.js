const path = require('path');
const fs   = require('fs');

let pool;
let isSQLite = false;

if (process.env.DATABASE_URL) {
  // ── PostgreSQL (production) ──────────────────────────────────────────────
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  });
  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err.message);
  });
} else {
  // ── Pure-JS JSON store (local dev – no native modules needed) ────────────
  isSQLite = true;

  const dataDir = path.join(__dirname, '..', '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const DB_FILE = path.join(dataDir, 'db.json');

  function readDB() {
    if (!fs.existsSync(DB_FILE)) return { jobs: [], applications: [], _seq: { jobs: 0, applications: 0 } };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }

  function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }

  function now() {
    return new Date().toISOString();
  }

  // query() shim – understands the subset of SQL used in models/initDb
  function query(sql, params = []) {
    const trimmed = sql.trim().replace(/\s+/g, ' ');
    const db = readDB();

    // ── CREATE TABLE ──────────────────────────────────────────────────────
    if (/^CREATE TABLE/i.test(trimmed)) {
      return { rows: [] };
    }

    // ── SELECT COUNT(*) FROM jobs ─────────────────────────────────────────
    if (/^SELECT COUNT\(\*\)/i.test(trimmed) && /FROM jobs/i.test(trimmed)) {
      return { rows: [{ count: String(db.jobs.length) }] };
    }

    // ── SELECT * FROM jobs … ORDER BY … LIMIT … OFFSET ───────────────────
    if (/^SELECT \* FROM jobs/i.test(trimmed)) {
      let results = [...db.jobs];
      // Apply LIKE filters (params in order: search?, category?, location?, limit, offset)
      const searchMatch = trimmed.match(/title LIKE \?/i);
      const categoryMatch = trimmed.match(/category LIKE \?/i);
      const locationMatch = trimmed.match(/location LIKE \?/i);
      let pi = 0;
      if (searchMatch) {
        const term = (params[pi++] || '').replace(/%/g, '').toLowerCase();
        if (term) results = results.filter(j =>
          j.title.toLowerCase().includes(term) ||
          j.company.toLowerCase().includes(term) ||
          j.location.toLowerCase().includes(term));
      }
      if (categoryMatch) {
        const term = (params[pi++] || '').replace(/%/g, '').toLowerCase();
        if (term) results = results.filter(j => j.category.toLowerCase().includes(term));
      }
      if (locationMatch) {
        const term = (params[pi++] || '').replace(/%/g, '').toLowerCase();
        if (term) results = results.filter(j => j.location.toLowerCase().includes(term));
      }
      // Sort newest first
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      // LIMIT / OFFSET
      if (/LIMIT/i.test(trimmed)) {
        const limit  = parseInt(params[pi++], 10);
        const offset = parseInt(params[pi++], 10) || 0;
        results = results.slice(offset, offset + limit);
      }
      return { rows: results };
    }

    // ── SELECT * FROM jobs WHERE id = ? ───────────────────────────────────
    if (/^SELECT \* FROM jobs WHERE id/i.test(trimmed)) {
      const id = parseInt(params[0], 10);
      const row = db.jobs.find(j => j.id === id) || null;
      return { rows: row ? [row] : [] };
    }

    // ── INSERT INTO jobs ──────────────────────────────────────────────────
    if (/^INSERT INTO jobs/i.test(trimmed)) {
      db._seq.jobs = (db._seq.jobs || 0) + 1;
      const job = {
        id:          db._seq.jobs,
        title:       params[0],
        company:     params[1],
        location:    params[2],
        category:    params[3],
        description: params[4],
        created_at:  now(),
        updated_at:  now(),
      };
      db.jobs.push(job);
      writeDB(db);
      return { rows: [job] };
    }

    // ── DELETE FROM jobs WHERE id = ? ─────────────────────────────────────
    if (/^DELETE FROM jobs WHERE id/i.test(trimmed)) {
      const id  = parseInt(params[0], 10);
      const idx = db.jobs.findIndex(j => j.id === id);
      if (idx === -1) { return { rows: [] }; }
      const [deleted] = db.jobs.splice(idx, 1);
      // Cascade delete applications
      db.applications = db.applications.filter(a => a.job_id !== id);
      writeDB(db);
      return { rows: [deleted] };
    }

    // ── DELETE FROM jobs (seed reset) ─────────────────────────────────────
    if (/^DELETE FROM jobs$/i.test(trimmed)) {
      db.jobs = [];
      db.applications = [];
      db._seq = { jobs: 0, applications: 0 };
      writeDB(db);
      return { rows: [] };
    }

    // ── INSERT INTO applications ──────────────────────────────────────────
    if (/^INSERT INTO applications/i.test(trimmed)) {
      db._seq.applications = (db._seq.applications || 0) + 1;
      const app = {
        id:          db._seq.applications,
        job_id:      parseInt(params[0], 10),
        name:        params[1],
        email:       params[2],
        resume_link: params[3],
        cover_note:  params[4] || '',
        created_at:  now(),
        updated_at:  now(),
      };
      db.applications.push(app);
      writeDB(db);
      return { rows: [app] };
    }

    // ── SELECT * FROM applications WHERE job_id = ? ───────────────────────
    if (/^SELECT \* FROM applications WHERE job_id/i.test(trimmed)) {
      const jobId = parseInt(params[0], 10);
      const rows  = db.applications.filter(a => a.job_id === jobId)
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { rows };
    }

    return { rows: [] };
  }

  pool = {
    query:   (sql, params) => Promise.resolve(query(sql, params)),
    connect: () => Promise.resolve({
      query:   (sql, params) => Promise.resolve(query(sql, params)),
      release: () => {},
    }),
  };
}

const connectDB = async () => {
  if (isSQLite) {
    console.log('JSON store connected: data/db.json');
    return;
  }
  const client = await pool.connect();
  const dbName = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.split('/').pop().split('?')[0]
    : 'postgres';
  console.log(`PostgreSQL connected: ${dbName}`);
  client.release();
};

module.exports = { pool, connectDB, isSQLite };
