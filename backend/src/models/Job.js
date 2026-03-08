const { pool } = require('../config/db');

const findAll = async ({ search, category, location, limit, offset }) => {
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    const idx = params.length;
    conditions.push(
      `(title LIKE $${idx} OR company LIKE $${idx} OR location LIKE $${idx})`
    );
  }

  if (category) {
    params.push(`%${category}%`);
    conditions.push(`category LIKE $${params.length}`);
  }

  if (location) {
    params.push(`%${location}%`);
    conditions.push(`location LIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) AS count FROM jobs ${where}`,
    params
  );
  const countRow = countResult.rows[0];
  const total = parseInt(countRow.count ?? countRow['COUNT(*)'] ?? 0, 10);

  params.push(limit);
  params.push(offset);
  const dataResult = await pool.query(
    `SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { total, rows: dataResult.rows };
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const create = async ({ title, company, location, category, description }) => {
  const result = await pool.query(
    `INSERT INTO jobs (title, company, location, category, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, company, location, category, description]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM jobs WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { findAll, findById, create, remove };
