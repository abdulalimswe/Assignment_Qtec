'use strict';
require('dotenv').config();

const { connectDB } = require('../src/config/db');
const initDb = require('../src/config/initDb');
const app = require('../app');

// ─── Lazy one-time DB initialisation ─────────────────────────────────────────
// Module-scoped promise so we initialise once per warm container.
// On failure the promise is cleared so the next cold start retries.
let _ready = null;

function ensureReady() {
  if (!_ready) {
    _ready = connectDB()
      .then(() => initDb())
      .catch((err) => {
        _ready = null;          // allow retry on next invocation
        return Promise.reject(err);
      });
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
