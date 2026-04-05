/**
 * src/controllers/auth.controller.js
 * Auth controller — thin request/response layer
 * All logic is in auth.service.js
 */
const authService = require('../services/auth.service');
const auditLogService = require('../services/auditLog.service');
const { sendSuccess } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    // Audit: Log registration event
    await auditLogService.createAuditLog({
      userId: user._id,
      action: 'REGISTER',
      entity: 'User',
      entityId: user._id,
      metadata: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    // Audit: Log login event
    await auditLogService.createAuditLog({
      userId: user._id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id,
      metadata: { email: user.email },
      ipAddress: req.ip,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Login successful.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /auth/me — Return currently authenticated user profile
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      message: 'Profile retrieved.',
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
