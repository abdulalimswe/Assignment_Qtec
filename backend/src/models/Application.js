const { pool } = require('../config/db');

const create = async ({ jobId, name, email, resumeLink, coverNote }) => {
  const result = await pool.query(
    `INSERT INTO applications (job_id, name, email, resume_link, cover_note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [jobId, name, email, resumeLink, coverNote || '']
  );
  return result.rows[0];
};

const findByJobId = async (jobId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
    [jobId]
  );
  return result.rows;
};

module.exports = { create, findByJobId };
