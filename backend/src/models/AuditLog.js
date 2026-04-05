/**
 * src/models/AuditLog.js
 * Audit log model — immutable record of every significant action
 */
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      // e.g. CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION, LOGIN, REGISTER
    },
    entity: {
      type: String,
      required: true,
      // e.g. 'Transaction', 'User'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Extra context: { amount, type, category } etc.
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }, // Only track creation time
    capped: false, // Could be made capped collection for auto-rotation in production
  }
);

// Index for timeline queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
