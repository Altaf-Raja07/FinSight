/**
 * src/models/User.js
 * User model with role-based access control (RBAC) and bcrypt password hashing
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['ADMIN', 'ANALYST', 'VIEWER'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: 'Role must be one of: ADMIN, ANALYST, VIEWER',
      },
      default: 'VIEWER',
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: 'Status must be ACTIVE or INACTIVE',
      },
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for common queries (email index auto-created by unique:true constraint)
userSchema.index({ role: 1, status: 1 });

/**
 * Pre-save hook: Hash password before saving
 * Only runs when password field is modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Instance method: Compare provided password with stored hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static method: Check if email already exists
 */
userSchema.statics.emailExists = async function (email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

// Enum exports for use across the codebase
userSchema.statics.ROLES = ROLES;
userSchema.statics.STATUSES = STATUSES;

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
