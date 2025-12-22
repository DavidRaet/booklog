/**
 * Create Central Configuration Module
 * This module will centralize all environment variables used across the server application.
 * It helps in managing configurations easily and ensures consistency throughout the codebase.
 * Each configuration parameter is fetched from environment variables with a default fallback value.
 * This module was made to improve maintainability and readability and to not violate DRY principles.
 * The use of this module will be in various parts of the server application where configuration settings are required.
 * e.g database connection, server port, authentication secrets, etc.
 */
export default {
    port: process.env.PORT || 3000,
    dbUri: process.env.POSTGRES_URL || 'postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&param2=value2]',
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    corsOrigin: process.env.CORS_ORIGIN || '*',
};

