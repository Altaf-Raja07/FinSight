/**
 * src/controllers/export.controller.js
 * Export controller — streams CSV to client
 */
const { exportTransactionsAsCSV } = require('../services/export.service');

const exportTransactions = async (req, res, next) => {
  try {
    await exportTransactionsAsCSV(req.query, req.user._id, req.user.role, res);
    // Response is handled inside the service (streaming)
  } catch (error) {
    next(error);
  }
};

module.exports = { exportTransactions };
