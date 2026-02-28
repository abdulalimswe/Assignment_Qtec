'use strict';
require('dotenv').config();

const { connectDB } = require('../src/config/db');
const initDb = require('../src/config/initDb');
const app = require('../app');

// ─── Lazy one-time DB initialisation ─────────────────────────────────────────
// Serverless containers may be reused across requests (warm start) or spun up
// fresh (cold start).  We initialise the DB connection once per container
// instance using a module-scoped promise so we never double-initialise.
let _ready = null;

function ensureReady() {
  if (!_ready) {
    _ready = connectDB().then(() => initDb());
  }
  return _ready;
}

// ─── Vercel serverless handler ────────────────────────────────────────────────
module.exports = async (req, res) => {
  try {
    await ensureReady();
  } catch (err) {
    console.error('DB initialisation failed:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Service temporarily unavailable' }));
    return;
  }
  return app(req, res);
};
