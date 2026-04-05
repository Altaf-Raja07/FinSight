/**
 * src/validations/transaction.validation.js
 * Joi validation schemas for transaction routes
 */
const Joi = require('joi');
const { validate } = require('./auth.validation');

const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  type: Joi.string().valid('INCOME', 'EXPENSE').required().messages({
    'any.only': 'Type must be INCOME or EXPENSE',
    'any.required': 'Transaction type is required',
  }),
  category: Joi.string().max(100).required().messages({
    'any.required': 'Category is required',
  }),
  date: Joi.date().iso().default(() => new Date()),
  note: Joi.string().max(500).allow('').default(''),
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid('INCOME', 'EXPENSE'),
  category: Joi.string().max(100),
  date: Joi.date().iso(),
  note: Joi.string().max(500).allow(''),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const getTransactionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  type: Joi.string().valid('INCOME', 'EXPENSE'),
  category: Joi.string().max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  userId: Joi.string().hex().length(24), // ObjectId
  search: Joi.string().max(100),
  sortBy: Joi.string().valid('date', 'amount', 'createdAt').default('date'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Validate query parameters (not body)
 */
const validateQuery = (schema) => async (req, res, next) => {
  try {
    req.query = await schema.validateAsync(req.query, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err) {
    const errors = err.details.map((d) => d.message);
    return res.status(422).json({ success: false, message: 'Invalid query parameters', errors });
  }
};

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
  validate,
  validateQuery,
};
