/**
 * src/controllers/transaction.controller.js
 * Transaction CRUD controller
 */
const transactionService = require('../services/transaction.service');
const auditLogService = require('../services/auditLog.service');
const { sendSuccess } = require('../utils/response');

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction({
      ...req.body,
      userId: req.user._id,
    });

    await auditLogService.createAuditLog({
      userId: req.user._id,
      action: 'CREATE_TRANSACTION',
      entity: 'Transaction',
      entityId: transaction._id,
      metadata: { amount: transaction.amount, type: transaction.type, category: transaction.category },
      ipAddress: req.ip,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Transaction created successfully.',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getTransactions(
      req.query,
      req.user._id,
      req.user.role
    );

    return sendSuccess(res, {
      message: 'Transactions retrieved.',
      data: result.transactions,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return sendSuccess(res, { message: 'Transaction retrieved.', data: transaction });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );

    await auditLogService.createAuditLog({
      userId: req.user._id,
      action: 'UPDATE_TRANSACTION',
      entity: 'Transaction',
      entityId: transaction._id,
      metadata: req.body,
      ipAddress: req.ip,
    });

    return sendSuccess(res, { message: 'Transaction updated.', data: transaction });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user._id, req.user.role);

    await auditLogService.createAuditLog({
      userId: req.user._id,
      action: 'DELETE_TRANSACTION',
      entity: 'Transaction',
      entityId: req.params.id,
      metadata: {},
      ipAddress: req.ip,
    });

    return sendSuccess(res, { message: 'Transaction deleted (soft delete).' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
