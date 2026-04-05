/**
 * src/middlewares/rbac.js
 * Role-Based Access Control (RBAC) middleware factory
 * Usage: authorize('ADMIN', 'ANALYST')
 */
const { sendError } = require('../utils/response');

/**
 * Middleware factory — accepts one or more allowed roles
 * @param  {...string} roles - Allowed roles e.g. 'ADMIN', 'ANALYST', 'VIEWER'
 * @returns {Function} Express middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user must be populated by authenticate middleware first
    if (!req.user) {
      return sendError(res, { statusCode: 401, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, {
        statusCode: 403,
        message: `Access denied. Route requires role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = authorize;
