/**
 * src/routes/transaction.routes.js
 * Transaction CRUD routes
 */
const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
  validate,
  validateQuery,
} = require('../validations/transaction.validation');

// All transaction routes require authentication
router.use(authenticate);

// GET — ADMIN and ANALYST can list transactions
router.get(
  '/',
  authorize('ADMIN', 'ANALYST'),
  validateQuery(getTransactionsQuerySchema),
  transactionController.getTransactions
);

// GET by ID
router.get('/:id', authorize('ADMIN', 'ANALYST'), transactionController.getTransactionById);

// POST — create
router.post(
  '/',
  authorize('ADMIN', 'ANALYST'),
  validate(createTransactionSchema),
  transactionController.createTransaction
);

// PATCH — update
router.patch(
  '/:id',
  authorize('ADMIN', 'ANALYST'),
  validate(updateTransactionSchema),
  transactionController.updateTransaction
);

// DELETE (soft delete)
router.delete('/:id', authorize('ADMIN', 'ANALYST'), transactionController.deleteTransaction);

module.exports = router;
