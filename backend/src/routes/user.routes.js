/**
 * src/routes/user.routes.js
 * User management routes — ADMIN only
 */
const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// All user management routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

// GET /api/v1/users
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:id
router.get('/:id', userController.getUserById);

// PATCH /api/v1/users/:id/status
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;
