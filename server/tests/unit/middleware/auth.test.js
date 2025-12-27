import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateToken } from '../../../middleware/auth.js';
import * as jwtUtils from '../../../utils/jwt.js';

vi.mock('../../../utils/jwt.js');

describe('Auth Middleware - authenticateToken unit testing', () => {
    let mockReq;
    let mockRes;
    let mockNext; 

    beforeEach(() => {
        vi.clearAllMocks();

        mockReq = {
            headers: {}
        };
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
        mockNext = vi.fn();
    })

    describe("Valid Token", () => {
        it("Should call next() and set req.userId when token is valid", () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer valid-token';
            jwtUtils.verifyToken.mockReturnValue({userId: 'user-123'});
            
            // Act 
            authenticateToken(mockReq, mockRes, mockNext); 

            // Assert 
            expect(mockReq.userId).toBe('user-123');
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe("Token Missing", () => {
        it("Should return the response status and json message when token is missins", () => {
            // Arrange
            mockReq.headers.authorization = 'Bearer';
            
            // Act
            authenticateToken(mockReq, mockRes, mockNext);

            // Assert 
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({message: "Access token required"});
            expect(mockNext).not.toHaveBeenCalled();
        })
    });

});