/**
 * src/utils/jwt.js
 * JWT utility — sign and verify tokens
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a signed JWT token for a user
 * @param {Object} payload - Data to encode (userId, role)
 * @returns {string} Signed JWT token
 */
const signToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'finsight-api',
    audience: 'finsight-client',
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret, {
    issuer: 'finsight-api',
    audience: 'finsight-client',
  });
};

module.exports = { signToken, verifyToken };
