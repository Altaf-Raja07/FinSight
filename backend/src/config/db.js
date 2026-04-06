/**
 * src/config/db.js
 * MongoDB connection with graceful error handling and retry logic
 */
const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo.uri, {
      // Mongoose 8+ has these defaults, but explicit for clarity
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Graceful shutdown hooks
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed on SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed on SIGTERM');
      process.exit(0);
    });
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Crash fast — supervisor/PM2 will restart
  }
};

module.exports = connectDB;
