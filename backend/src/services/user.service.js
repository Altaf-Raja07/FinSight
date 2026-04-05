/**
 * src/services/user.service.js
 * User management service (ADMIN role operations)
 */
const User = require('../models/User');

/**
 * Get all users with optional filters
 * @param {{ page, limit, role, status }} query
 * @returns {{ users: Array, total: number, page: number, totalPages: number }}
 */
const getAllUsers = async ({ page = 1, limit = 20, role, status } = {}) => {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single user by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update user status (activate/deactivate)
 * @param {string} userId
 * @param {'ACTIVE'|'INACTIVE'} status
 */
const updateUserStatus = async (userId, status) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getAllUsers, getUserById, updateUserStatus };
