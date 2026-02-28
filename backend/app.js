const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');

const jobRoutes         = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

// ─── Trust proxy ──────────────────────────────────────────────────────────────
// Vercel and most cloud providers sit behind a reverse proxy.  This setting
// tells Express to trust the X-Forwarded-For header so rate-limiting and
// IP-based logic use the real client address, not the proxy IP.
app.set('trust proxy', 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// CORS_ORIGIN env var: comma-separated list of allowed origins.
// Falls back to localhost ports for local development.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:8080', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no Origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── HTTP logging ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));        // structured Apache-style logs for prod
} else if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));             // coloured, concise logs for development
}

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Rate limiter ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'QuickHire API is running' });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/jobs',         jobRoutes);
app.use('/api/applications', applicationRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
