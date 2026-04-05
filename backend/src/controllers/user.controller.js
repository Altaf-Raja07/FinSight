/**
 * src/controllers/user.controller.js
 * User management controller (ADMIN only)
 */
const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, role, status } = req.query;
    const result = await userService.getAllUsers({ page, limit, role, status });

    return sendSuccess(res, {
      message: 'Users retrieved successfully.',
      data: result.users,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, { message: 'User retrieved.', data: user });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(422).json({
        success: false,
        message: 'Status must be ACTIVE or INACTIVE',
      });
    }

    const user = await userService.updateUserStatus(req.params.id, status);
    return sendSuccess(res, { message: `User status updated to ${status}.`, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUserStatus };
