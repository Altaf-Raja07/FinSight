/**
 * src/utils/logger.js
 * Winston logger configuration for application-wide logging.
 */
const { createLogger, format, transports } = require('winston');
const config = require('../config/env');

const ObjectFormatter = format((info) => {
  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }
  return info;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    ObjectFormatter(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'finsight-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (config.env !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(
        ({ level, message, timestamp, stack, ...meta }) => 
          `${timestamp} [${level}]: ${stack || message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
      )
    ),
  }));
}

module.exports = logger;