/**
 * src/models/Transaction.js
 * Transaction model with soft delete support and indexed fields for analytics queries
 */
const mongoose = require('mongoose');

const TYPES = ['INCOME', 'EXPENSE'];

const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Utilities',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: {
        values: TYPES,
        message: 'Type must be INCOME or EXPENSE',
      },
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for fast analytics aggregations
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, isDeleted: 1 });
transactionSchema.index({ userId: 1, category: 1, isDeleted: 1 });
transactionSchema.index({ date: 1, isDeleted: 1 });

// Full-text search on note and category
transactionSchema.index({ note: 'text', category: 'text' });

/**
 * Query helper: Automatically exclude soft-deleted records
 */
transactionSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
module.exports.TYPES = TYPES;
module.exports.CATEGORIES = CATEGORIES;
