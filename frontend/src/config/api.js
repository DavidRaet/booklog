
/**
 * API configuration settings for the frontend application.
 * This module centralizes all API-related configurations, making it easier to manage and maintain consistency across the frontend codebase.
 * This includes the base URL for API requests, timeout settings, default headers, and retry attempts.
 * This module was made to improve maintainability and readability and to not violate DRY principles.
 * The use of this module will be in various parts of the frontend application where API calls are made.
 * e.g fetching data, submitting forms, etc.
 */
module.exports = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.API_TIMEOUT, 10) || 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS, 10) || 3,
};