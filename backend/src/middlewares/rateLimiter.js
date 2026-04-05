/**
 * src/middlewares/rateLimiter.js
 * Rate limiting middleware using express-rate-limit
 * Prevents brute-force attacks and API abuse
 */
const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const { sendError } = require('../utils/response');

/**
 * General API rate limiter — applies to all routes
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.max,           // 100 requests per window
  standardHeaders: true,               // Return RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Too many requests. Please slow down and try again later.',
    });
  },
});

/**
 * Strict auth limiter — applied to /login and /register
 * Limits to 10 attempts per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Too many authentication attempts. Please wait 15 minutes and try again.',
    });
  },
});

module.exports = { apiLimiter, authLimiter };
