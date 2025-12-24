/**
 * Centralized Logging Utility
 * 
 * This module provides a structured logging abstraction using Winston.
 * 
 * WHY THIS EXISTS:
 * - Replaces scattered console.log/error calls with a consistent interface
 * - Enables log level control via LOG_LEVEL environment variable
 * - Formats logs differently for development (colorized, readable) vs production (JSON)
 * - Provides timestamp and context for easier debugging and log aggregation
 * - Supports future integration with log aggregation services (CloudWatch, Datadog, etc.)
 * 
 * USAGE:
 *   import logger from './utils/logger.js';
 *   logger.info('Server started', { port: 3000 });
 *   logger.error('Database connection failed', { error: err.message });
 *   logger.warn('Rate limit approaching', { ip: req.ip });
 *   logger.debug('Query executed', { sql: query, duration: ms });
 * 
 * LOG LEVELS (in order of severity):
 *   error > warn > info > http > debug
 * 
 * Set LOG_LEVEL in .env to control verbosity:
 *   - production: 'info' (default) - errors, warnings, and info messages
 *   - development: 'debug' - includes debug messages for troubleshooting
 */

import winston from 'winston';
import env from '../config/env.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

/**
 * Custom format for development: colorized, human-readable output
 * Example: 2025-12-24 10:30:45 [info]: Server started {"port":3000}
 */
const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

/**
 * Production format: JSON for easy parsing by log aggregation tools
 * Example: {"level":"info","message":"Server started","port":3000,"timestamp":"2025-12-24T10:30:45.000Z"}
 */
const prodFormat = combine(
    timestamp(),
    json()
);

/**
 * Determine if we're in production environment
 * Uses NODE_ENV to decide format and transport configuration
 */
const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
    level: env.logLevel || 'info',
    format: isProduction ? prodFormat : devFormat,
    defaultMeta: { service: 'booklog-api' },
    transports: [
        // Console transport for all environments
        new winston.transports.Console({
            // In test environment, silence logs to keep test output clean
            silent: process.env.NODE_ENV === 'test'
        })
    ]
});

/**
 * Add file transports in production for persistence
 * Separates error logs for easier monitoring and alerting
 */
if (isProduction) {
    logger.add(new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));
    logger.add(new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));
}

export default logger;
