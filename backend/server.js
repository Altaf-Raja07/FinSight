/**
 * server.js
 * HTTP server bootstrap
 * Connects to MongoDB, then starts Express
 */
const app = require('./app');
const connectDB = require('./src/config/db');
const config = require('./src/config/env');

const startServer = async () => {
  // 1. Connect to MongoDB first
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(config.port, () => {
    console.log(`\n🚀 FinSight API running in ${config.env} mode`);
    console.log(`📡 Server: http://localhost:${config.port}`);
    console.log(`❤️  Health: http://localhost:${config.port}/health`);
    console.log(`📚 API:    http://localhost:${config.port}/api/v1\n`);
  });

  // Graceful shutdown — finish in-flight requests before closing
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    // Force close after 10 seconds if hanging
    setTimeout(() => {
      console.error('Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UnhandledRejection');
  });
};

startServer();
