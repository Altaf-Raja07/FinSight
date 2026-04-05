/**
 * src/middlewares/errorHandler.js
 * Centralized error handling middleware
 * Catches all errors passed via next(error) and returns a consistent response
 */
const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  // Log error details (in production use Winston/Pino instead of console)
  console.error(`[ERROR] ${req.method} ${req.url}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, {
      statusCode: 409,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, {
      statusCode: 400,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // JWT errors (should be caught in auth middleware, but safety net)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, { statusCode: 401, message: 'Invalid or expired token.' });
  }

  // Custom application errors with a statusCode
  if (err.statusCode) {
    return sendError(res, { statusCode: err.statusCode, message: err.message });
  }

  // Generic fallback
  return sendError(res, {
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
};

module.exports = errorHandler;
