/**
 * src/routes/auth.routes.js
 */
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerSchema, loginSchema, validate } = require('../validations/auth.validation');

// POST /api/v1/auth/register
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// GET /api/v1/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;
