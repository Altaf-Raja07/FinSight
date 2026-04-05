/**
 * src/utils/response.js
 * Standardized API response helpers
 * Ensures all responses follow a consistent shape:
 * { success, message, data, meta }
 */

/**
 * Send a success response
 */
const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null }) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

/**
 * Send an error response
 */
const sendError = (res, { statusCode = 500, message = 'Internal Server Error', errors = null }) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
