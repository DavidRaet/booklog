import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateToken } from '../../../middleware/auth.js';
import * as jwtUtils from '../../../utils/jwt.js';

// Mock dependencies
vi.mock('../../../utils/jwt.js');

describe('Auth Middleware - authenticateToken', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        vi.clearAllMocks();

        // Create fresh mocks for each test
        mockReq = {
            headers: {}
        };

        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        mockNext = vi.fn();
    });

    describe('Valid Token', () => {
        it('should call next() and set req.userId when token is valid', () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer valid-token';
            jwtUtils.verifyToken.mockReturnValue({userId : 'user-123'});
            // Act
            authenticateToken(mockReq, mockRes, mockNext);
            // Assert
            expect(mockReq.userId).toBe('user-123');
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(jwtUtils.verifyToken).toHaveBeenCalledWith('valid-token');
        });
    });

    describe('Missing Token', () => {
        it('should return 401 when no authorization header is provided', () => {
            // Arrange
            mockReq.headers = {};

            // Act
            authenticateToken(mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Access token required'});
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header has only Bearer prefix', () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer ';
            
            // Act
            authenticateToken(mockReq, mockRes, mockNext); 

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Access token required'});
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Invalid Token', () => {
        it('should return 403 when token is either invalid or expired', () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer invalid-token';
            jwtUtils.verifyToken.mockReturnValue(null);

            // Act
            authenticateToken(mockReq, mockRes, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Invalid or expired token'});
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Token Extraction', () => {
        it('should correctly extract token with special characters from Bearer scheme', () => {
            // Arrange
            const token = 'my-jwt-token-123';
            mockReq.headers.authorization = `Bearer ${token}`;
            jwtUtils.verifyToken.mockReturnValue({ userId: 'user-1' });

            // Act
            authenticateToken(mockReq, mockRes, mockNext);

            // Assert
            expect(jwtUtils.verifyToken).toHaveBeenCalledWith(token);
        });
    });

    describe('Security Considerations', () => {
        it('should not expose internal error details', () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer bad-token';
            jwtUtils.verifyToken.mockReturnValue(null);

            // Act
            authenticateToken(mockReq, mockRes, mockNext);

            // Assert - error message should be generic
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.not.stringContaining('jwt')
                })
            );
        });

        it('should return 401 before 403 based on missing vs invalid token', () => {
            // Test missing token returns 401
            authenticateToken(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);

            // Reset mocks
            mockRes.status.mockClear();
            mockRes.json.mockClear();

            // Test invalid token returns 403
            mockReq.headers.authorization = 'Bearer invalid';
            jwtUtils.verifyToken.mockReturnValue(null);
            authenticateToken(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
        });
    });
});
