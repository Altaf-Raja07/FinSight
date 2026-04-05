/**
 * src/middlewares/auth.js
 * JWT Authentication middleware
 * Validates Bearer token and attaches decoded user to req.user
 */
const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // 1. Extract Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, {
        statusCode: 401,
        message: 'Authentication required. Please provide a Bearer token.',
      });
    }

    // 2. Decode token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // 3. Check user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return sendError(res, { statusCode: 401, message: 'User no longer exists.' });
    }
    if (user.status === 'INACTIVE') {
      return sendError(res, {
        statusCode: 403,
        message: 'Your account has been deactivated. Contact an administrator.',
      });
    }

    // 4. Attach user to request context
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, { statusCode: 401, message: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, { statusCode: 401, message: 'Invalid token. Please log in again.' });
    }
    next(error);
  }
};

module.exports = authenticate;
