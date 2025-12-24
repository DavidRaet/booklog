/**
 * Health Check Route
 * 
 * WHY THIS EXISTS:
 * - Load balancers (AWS ELB, Kubernetes, etc.) need an endpoint to verify the server is healthy
 * - Container orchestration systems use health checks to decide when to restart containers
 * - Monitoring tools poll this endpoint to track uptime and availability
 * - Provides quick verification that both the server and database are operational
 * 
 * USAGE:
 *   GET /health - Returns server health status and database connectivity
 * 
 * RESPONSE STRUCTURE:
 *   {
 *     "status": "healthy" | "unhealthy",
 *     "timestamp": "2025-12-24T10:30:45.000Z",
 *     "uptime": 12345.67,
 *     "checks": {
 *       "database": { "status": "healthy", "latency": 5 }
 *     }
 *   }
 * 
 * HTTP STATUS CODES:
 *   200 - All systems healthy
 *   503 - One or more systems unhealthy (enables load balancer to route traffic elsewhere)
 */

import express from 'express';
import sequelize from '../config/database.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /health
 * 
 * Performs health checks on critical system components:
 * 1. Database connectivity - Executes a simple query to verify connection
 * 
 * This endpoint should:
 * - Be fast (no heavy operations)
 * - Not require authentication (load balancers need access)
 * - Return consistent response structure
 */
router.get('/', async (req, res) => {
    const healthcheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {}
    };

    // Check database connectivity
    const dbStart = Date.now();
    try {
        await sequelize.authenticate();
        healthcheck.checks.database = {
            status: 'healthy',
            latency: Date.now() - dbStart
        };
    } catch (error) {
        logger.error('Health check failed: Database unreachable', { 
            error: error.message 
        });
        healthcheck.status = 'unhealthy';
        healthcheck.checks.database = {
            status: 'unhealthy',
            error: error.message
        };
    }

    // Return 503 if any check failed, so load balancers can route traffic elsewhere
    const statusCode = healthcheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthcheck);
});

export default router;
