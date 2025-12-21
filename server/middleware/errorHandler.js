/**
 * Global error handler middleware for the booklog backend. 
 * Logs error details and sends a structured JSON response.
 * @param {*} err error object that was thrown
 * @param {*} req request object that was made
 * @param {*} res response object to send back
 * @param {*} next next middleware function in the stack
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}; 

export default errorHandler;

