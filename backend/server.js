/**
 * server.js
 * HTTP server bootstrap
 * Connects to MongoDB, then starts Express
 */
const app = require('./app');
const connectDB = require('./src/config/db');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');

const startServer = async () => {
  // 1. Connect to MongoDB first
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(config.port, () => {
    logger.info(`🚀 FinSight API running in ${config.env} mode on port ${config.port}`);
    logger.info(`📡 Server: http://localhost:${config.port}`);
  });

  // Graceful shutdown — finish in-flight requests before closing
  const shutdown = (signal) => {
    logger.info(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });

    // Force close after 10 seconds if hanging
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection processing:', reason);
    shutdown('UnhandledRejection');
  });
  
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown:', err);
    shutdown('UncaughtException');
  });
};

startServer();
