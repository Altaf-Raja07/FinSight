/**
 * src/services/auth.service.js
 * Authentication service — all auth business logic lives here
 */
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

/**
 * Register a new user
 * @param {{ name, email, password, role }} data
 * @returns {{ user: Object, token: string }}
 */
const registerUser = async ({ name, email, password, role }) => {
  // Check duplicate email
  const exists = await User.emailExists(email);
  if (exists) {
    const error = new Error('Email is already registered.');
    error.statusCode = 409;
    throw error;
  }

  // Create user — password hashing handled by pre-save hook in model
  const user = await User.create({ name, email, password, role });

  const token = signToken({ userId: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

/**
 * Log in an existing user
 * @param {{ email, password }} credentials
 * @returns {{ user: Object, token: string }}
 */
const loginUser = async ({ email, password }) => {
  // Include password field (excluded by default via `select: false`)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.status === 'INACTIVE') {
    const error = new Error('Account is deactivated. Contact an administrator.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ userId: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

/**
 * Strip sensitive fields from user object before returning
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

module.exports = { registerUser, loginUser };
