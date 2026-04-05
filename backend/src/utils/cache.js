/**
 * src/utils/cache.js
 * In-memory caching wrapper using node-cache
 * Supports TTL-based expiry and manual invalidation
 */
const NodeCache = require('node-cache');
const config = require('../config/env');

// Single cache instance for the application
const cache = new NodeCache({
  stdTTL: config.cache.ttl,    // Default TTL in seconds
  checkperiod: 120,             // Check for expired keys every 2 minutes
  useClones: false,             // Faster — don't clone objects on get/set
});

/**
 * Get a value from cache
 * @param {string} key
 * @returns {*} Cached value or undefined
 */
const get = (key) => cache.get(key);

/**
 * Set a value in cache
 * @param {string} key
 * @param {*} value
 * @param {number} [ttl] - Optional TTL override in seconds
 */
const set = (key, value, ttl) => {
  if (ttl !== undefined) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
};

/**
 * Delete a specific cache key
 * @param {string} key
 */
const del = (key) => cache.del(key);

/**
 * Delete all cache keys matching a prefix pattern
 * @param {string} prefix
 */
const delByPrefix = (prefix) => {
  const keys = cache.keys();
  const matching = keys.filter((k) => k.startsWith(prefix));
  matching.forEach((k) => cache.del(k));
};

/**
 * Flush entire cache
 */
const flush = () => cache.flushAll();

/**
 * Get cache statistics
 */
const stats = () => cache.getStats();

module.exports = { get, set, del, delByPrefix, flush, stats };
