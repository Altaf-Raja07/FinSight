/**
 * src/services/transaction.service.js
 * Transaction CRUD + advanced filtering, pagination, and search
 */
const Transaction = require('../models/Transaction');
const cacheUtil = require('../utils/cache');

/**
 * Create a new transaction
 * Invalidates dashboard cache after write
 */
const createTransaction = async ({ userId, amount, type, category, date, note }) => {
  const transaction = await Transaction.create({ userId, amount, type, category, date, note });
  // Invalidate all dashboard cache entries for this user
  cacheUtil.delByPrefix(`dashboard:${userId}`);
  return transaction;
};

/**
 * Get transactions with rich filtering, search, and pagination
 * @param {Object} filters - Query parameters
 * @param {string} requestingUserId - ID of the requesting user
 * @param {string} requestingUserRole - Role of the requesting user
 */
const getTransactions = async (filters, requestingUserId, requestingUserRole) => {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    startDate,
    endDate,
    userId,
    search,
    sortBy = 'date',
    sortOrder = 'desc',
  } = filters;

  // Build the MongoDB query filter
  const query = { isDeleted: false };

  // ANALYST can only see their own transactions
  // ADMIN can see all or filter by userId
  if (requestingUserRole === 'ANALYST') {
    query.userId = requestingUserId;
  } else if (requestingUserRole === 'ADMIN' && userId) {
    query.userId = userId;
  }

  if (type) query.type = type;
  if (category) query.category = { $regex: category, $options: 'i' };

  // Date range filter
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Full-text search across note and category
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('userId', 'name email role')
      .sort(sortObj)
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(query),
  ]);

  return {
    transactions,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single transaction by ID (with ownership check)
 */
const getTransactionById = async (transactionId, requestingUserId, requestingUserRole) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    isDeleted: false,
  }).populate('userId', 'name email');

  if (!transaction) {
    const error = new Error('Transaction not found.');
    error.statusCode = 404;
    throw error;
  }

  // ANALYST can only view their own transactions
  if (
    requestingUserRole === 'ANALYST' &&
    transaction.userId._id.toString() !== requestingUserId.toString()
  ) {
    const error = new Error('Access denied. You can only view your own transactions.');
    error.statusCode = 403;
    throw error;
  }

  return transaction;
};

/**
 * Update a transaction (with ownership check)
 */
const updateTransaction = async (transactionId, updates, requestingUserId, requestingUserRole) => {
  // First verify existence and access
  await getTransactionById(transactionId, requestingUserId, requestingUserRole);

  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  // Invalidate cache
  cacheUtil.delByPrefix(`dashboard:${requestingUserId}`);

  return transaction;
};

/**
 * Soft delete a transaction
 */
const deleteTransaction = async (transactionId, requestingUserId, requestingUserRole) => {
  // Only ADMIN can delete any transaction; ANALYST can only delete their own
  const transaction = await getTransactionById(transactionId, requestingUserId, requestingUserRole);

  transaction.isDeleted = true;
  await transaction.save();

  // Invalidate cache
  cacheUtil.delByPrefix(`dashboard:`);

  return { message: 'Transaction deleted successfully.' };
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
