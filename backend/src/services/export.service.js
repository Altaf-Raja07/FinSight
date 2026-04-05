/**
 * src/services/export.service.js
 * CSV export service using fast-csv
 */
const { format } = require('@fast-csv/format');
const Transaction = require('../models/Transaction');

/**
 * Stream transactions as CSV to the HTTP response
 * @param {Object} filters - Same filters as getTransactions
 * @param {string} userId
 * @param {string} role
 * @param {Object} res - Express response object
 */
const exportTransactionsAsCSV = async (filters, userId, role, res) => {
  const query = { isDeleted: false };

  // Role-based scoping
  if (role === 'ANALYST') {
    query.userId = userId;
  } else if (role === 'ADMIN' && filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = { $regex: filters.category, $options: 'i' };
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  // Set HTTP headers for file download
  const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Create CSV formatter stream
  const csvStream = format({ headers: true, writeBOM: true });
  csvStream.pipe(res);

  // Stream transactions from DB using cursor (memory efficient for large datasets)
  const cursor = Transaction.find(query)
    .populate('userId', 'name email')
    .sort({ date: -1 })
    .cursor();

  for await (const transaction of cursor) {
    csvStream.write({
      ID: transaction._id.toString(),
      Date: transaction.date.toISOString().split('T')[0],
      Type: transaction.type,
      Category: transaction.category,
      Amount: transaction.amount.toFixed(2),
      Note: transaction.note || '',
      User: transaction.userId?.name || 'N/A',
      Email: transaction.userId?.email || 'N/A',
      CreatedAt: transaction.createdAt.toISOString(),
    });
  }

  csvStream.end();
};

module.exports = { exportTransactionsAsCSV };
