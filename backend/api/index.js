'use strict';
require('dotenv').config();

const { connectDB } = require('../src/config/db');
const initDb = require('../src/config/initDb');
const app = require('../app');

// ─── Lazy one-time DB initialisation ─────────────────────────────────────────
let _ready = null;

function ensureReady() {
  if (!_ready) {
    _ready = connectDB()
      .then(() => initDb())
      .catch((err) => {
        _ready = null;
        return Promise.reject(err);
      });
  }
  return _ready;
}

// ─── Vercel serverless handler ────────────────────────────────────────────────
module.exports = async (req, res) => {
  // Lightweight ping — available even when DB is down so we can diagnose issues
  if (req.url === '/health' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      message: 'QuickHire API is running',
      dbReady: !!_ready,
      env: {
        hasDbUrl:  !!process.env.DATABASE_URL,
        nodeEnv:   process.env.NODE_ENV || 'not set',
        hasCors:   !!process.env.CORS_ORIGIN,
      },
    }));
    return;
  }

  try {
    await ensureReady();
  } catch (err) {
    console.error('DB initialisation failed:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      message: 'Service temporarily unavailable',
      reason:  err.message,
    }));
    return;
  }

  return app(req, res);
};
