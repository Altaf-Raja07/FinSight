/**
 * tests/transaction.service.test.js
 * Unit tests for transaction.service.js
 */
jest.mock('../src/models/Transaction');
jest.mock('../src/utils/cache');

const transactionService = require('../src/services/transaction.service');
const Transaction = require('../src/models/Transaction');
const cacheUtil = require('../src/utils/cache');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cacheUtil.delByPrefix = jest.fn();
    cacheUtil.get = jest.fn().mockReturnValue(null);
    cacheUtil.set = jest.fn();
  });

  // ─── createTransaction ─────────────────────────────────────────────────────
  describe('createTransaction', () => {
    it('should create a transaction and invalidate cache', async () => {
      const mockTransaction = {
        _id: 'tx1',
        userId: 'user1',
        amount: 500,
        type: 'EXPENSE',
        category: 'Food',
        date: new Date(),
        note: 'Lunch',
      };
      Transaction.create = jest.fn().mockResolvedValue(mockTransaction);

      const result = await transactionService.createTransaction({
        userId: 'user1',
        amount: 500,
        type: 'EXPENSE',
        category: 'Food',
        date: new Date(),
        note: 'Lunch',
      });

      expect(Transaction.create).toHaveBeenCalledTimes(1);
      expect(cacheUtil.delByPrefix).toHaveBeenCalledWith('dashboard:user1');
      expect(result.amount).toBe(500);
    });
  });

  // ─── getTransactionById ────────────────────────────────────────────────────
  describe('getTransactionById', () => {
    it('should return transaction for ADMIN', async () => {
      const mockTransaction = {
        _id: 'tx1',
        userId: { _id: 'user1', name: 'Alice', email: 'alice@test.com' },
        amount: 100,
      };
      Transaction.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTransaction),
      });

      const result = await transactionService.getTransactionById('tx1', 'adminUser', 'ADMIN');
      expect(result).toEqual(mockTransaction);
    });

    it('should throw 404 if transaction not found', async () => {
      Transaction.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(
        transactionService.getTransactionById('nonexistent', 'user1', 'ADMIN')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw 403 if ANALYST tries to access another user transaction', async () => {
      const mockTransaction = {
        _id: 'tx1',
        userId: {
          _id: { toString: () => 'otherUser' },
          name: 'Other',
          email: 'other@test.com',
        },
        amount: 200,
      };
      Transaction.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTransaction),
      });

      await expect(
        transactionService.getTransactionById('tx1', 'analystUser', 'ANALYST')
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  // ─── deleteTransaction ─────────────────────────────────────────────────────
  describe('deleteTransaction', () => {
    it('should soft delete a transaction', async () => {
      const mockTransaction = {
        _id: 'tx1',
        userId: { _id: { toString: () => 'user1' }, name: 'Alice', email: 'alice@test.com' },
        isDeleted: false,
        save: jest.fn().mockResolvedValue(true),
      };
      Transaction.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTransaction),
      });

      await transactionService.deleteTransaction('tx1', 'user1', 'ADMIN');

      expect(mockTransaction.isDeleted).toBe(true);
      expect(mockTransaction.save).toHaveBeenCalled();
      expect(cacheUtil.delByPrefix).toHaveBeenCalledWith('dashboard:');
    });
  });
});
