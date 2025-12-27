import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from '../../../middleware/errorHandler.js';
import logger from '../../../utils/logger.js';

// Mock the logger
vi.mock('../../../utils/logger.js', () => ({
    default: {
        error: vi.fn()
    }
}));

describe('Error Handler Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        vi.clearAllMocks();

        mockReq = {
            path: '/api/test',
            method: 'GET'
        };

        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        mockNext = vi.fn();

        // Reset NODE_ENV for each test
        process.env.NODE_ENV = 'test';
    });

    describe('Logging', () => {
        it('should log error with logger.error() and a 500 status code if no specific error is given', () => {
            // Arrange
            const error = new Error('Unknown error');
            error.statusCode = 500;
            error.stack = 'Error stack trace';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalled();
        });

        it('should log error message', () => {
            // Arrange
            const error = new Error('Specific error message');

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalledWith(
                'Request error',
                expect.objectContaining({
                    message: 'Specific error message'
                })
            );
        });

        it('should log error stack trace', () => {
            // Arrange
            const error = new Error('Error with stack');
            
            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalledWith(
                'Request error',
                expect.objectContaining({
                    stack: expect.any(String)
                })
            );
        });

        it('should log request path and method', () => {
            // Arrange
            const error = new Error('Test error');
            mockReq.path = '/api/books/123';
            mockReq.method = 'DELETE';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalledWith(
                'Request error',
                expect.objectContaining({
                    path: '/api/books/123',
                    method: 'DELETE'
                })
            );
        });

        it('should log status code in error details', () => {
            // Arrange
            const error = new Error('Not found');
            error.statusCode = 404;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalledWith(
                'Request error',
                expect.objectContaining({
                    statusCode: 404
                })
            );
        });

        it('should log full error object with all properties', () => {
            // Arrange
            const error = new Error('Not found');
            error.statusCode = 404;
            mockReq.path = '/api/books/123';
            mockReq.method = 'GET';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(logger.error).toHaveBeenCalledWith(
                'Request error',
                expect.objectContaining({
                    message: 'Not found',
                    stack: expect.any(String),
                    statusCode: 404,
                    path: '/api/books/123',
                    method: 'GET'
                })
            );
        });
    });

    describe('Error Response', () => {
        it('should return custom status code when error has statusCode', () => {
            // Arrange
            const error = new Error('Not found');
            error.statusCode = 404;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 when error has no statusCode', () => {
            // Arrange
            const error = new Error('Something went wrong');

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });

        it('should return error message in response', () => {
            // Arrange
            const error = new Error('Custom error message');
            error.statusCode = 400;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Custom error message'
                })
            );
        });

        it('should return "Internal Server Error" for errors without message', () => {
            // Arrange
            const error = new Error();
            error.message = '';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Internal Server Error'
                })
            );
        });
    });

    describe('Status Codes', () => {
        it('should handle 400 Bad Request errors', () => {
            const error = new Error('Validation failed');
            error.statusCode = 400;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        it('should handle 401 for invalid or expired sessions', () => {
            const error = new Error('Authentication required');
            error.statusCode = 401;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        it('should handle 403 for unauthorized access', () => {
            const error = new Error('Access denied');
            error.statusCode = 403;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
        });

        it('should handle 404 for not found resources', () => {            
            const error = new Error('Resource not found');
            error.statusCode = 404;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle 409 Conflict errors', () => {
            const error = new Error('Resource already exists');
            error.statusCode = 409;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(409);
        });

        it('should handle 500 Internal Server errors', () => {
            const error = new Error('Database connection failed');
            error.statusCode = 500;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });


    describe('Development Mode Stack Trace', () => {
        it('should include stack trace in response when NODE_ENV is development', () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            const error = new Error('Dev error');
            error.stack = 'Error: Dev error\n    at test.js:1:1';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    stack: expect.any(String)
                })
            );
        });

        it('should NOT include stack trace in response when NODE_ENV is production', () => {
            // Arrange
            process.env.NODE_ENV = 'production';
            const error = new Error('Prod error');
            error.stack = 'Error: Prod error\n    at test.js:1:1';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    stack: expect.anything()
                })
            );
        });

        it('should NOT include stack trace in response when NODE_ENV is test', () => {
            // Arrange
            process.env.NODE_ENV = 'test';
            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at test.js:1:1';

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    stack: expect.anything()
                })
            );
        });
    });

    describe('JSON Response Structure', () => {
        it('should return proper JSON structure', () => {
            // Arrange
            const error = new Error('Test error');
            error.statusCode = 400;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.json).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledTimes(1);
        });

        it('should chain status and json calls correctly', () => {
            // Arrange
            const error = new Error('Chain test');
            error.statusCode = 403;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert - verify the chaining works
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        it('should handle error with invalid message', () => {
            // Arrange
            const error = new Error('No status code');
            error.message = null;

            // Act
            errorHandler(error, mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should handle error object without stack, path, or method properties', () => {
            // Arrange
            const error = { message: 'Custom error object', statusCode: 400 };

            // Act & Assert - should not throw
            expect(() => {
                errorHandler(error, mockReq, mockRes, mockNext);
            }).not.toThrow();

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });
});
