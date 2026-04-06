/**
 * app.js
 * Express application setup — middleware, routes, health check, error handler
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const routes = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler');
const { apiLimiter } = require('./src/middlewares/rateLimiter');
const { sendSuccess, sendError } = require('./src/utils/response');
const cacheUtil = require('./src/utils/cache');
const AppError = require('./src/utils/AppError');

const app = express();

// ─── Performance Middleware ───────────────────────────────────────────────────
app.use(compression());

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// CORS — allow the Next.js dev server and any configured production origin
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP Request Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return sendSuccess(res, {
    message: 'FinSight API is running.',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: dbState[mongoose.connection.readyState] || 'unknown',
      cache: cacheUtil.stats(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.url}`, 404));
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
