/**
 * src/validations/auth.validation.js
 * Joi validation schemas for authentication routes
 */
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('ADMIN', 'ANALYST', 'VIEWER').default('VIEWER'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

/**
 * Generic Joi validator middleware factory
 * @param {Joi.Schema} schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err) {
    const errors = err.details.map((d) => d.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};

module.exports = { registerSchema, loginSchema, validate };
