import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './authService.js';

// Mock the api config
vi.mock('../config/api.js', () => ({
    default: {
        apiBaseUrl: 'http://test-api.com/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
}));

describe('authService', () => {
    const mockToken = 'mock-jwt-token-123';
    const mockUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset fetch mock before each test
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('signup()', () => {
        it('should make POST request to signup endpoint', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.signup('testuser', 'test@example.com', 'password123');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/auth/signup',
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        it('should send correct body data', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.signup('newuser', 'new@example.com', 'securepass');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify({
                        username: 'newuser',
                        email: 'new@example.com',
                        password: 'securepass'
                    })
                })
            );
        });

        it('should send correct headers', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.signup('testuser', 'test@example.com', 'password');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
            );
        });

        it('should return token and user on success', async () => {
            // Arrange
            const responseData = { token: mockToken, user: mockUser };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => responseData
            });

            // Act
            const result = await authService.signup('testuser', 'test@example.com', 'password');

            // Assert
            expect(result).toEqual(responseData);
        });

        it('should throw error when response is not ok', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({ message: 'Validation failed' })
            });

            // Act & Assert
            await expect(authService.signup('testuser', 'test@example.com', 'password'))
                .rejects
                .toThrow('Failed to sign up user');
        });

        it('should throw error on 409 conflict (duplicate email)', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 409
            });

            // Act & Assert
            await expect(authService.signup('testuser', 'existing@example.com', 'password'))
                .rejects
                .toThrow();
        });

        it('should throw error on network failure', async () => {
            // Arrange
            global.fetch.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(authService.signup('testuser', 'test@example.com', 'password'))
                .rejects
                .toThrow('Network error');
        });
    });

    describe('login()', () => {
        it('should make POST request to login endpoint', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.login('test@example.com', 'password123');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/auth/login',
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        it('should send email and password in request body', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.login('user@test.com', 'mypassword');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify({
                        email: 'user@test.com',
                        password: 'mypassword'
                    })
                })
            );
        });

        it('should send correct headers', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ token: mockToken, user: mockUser })
            });

            // Act
            await authService.login('test@example.com', 'password');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
            );
        });

        it('should return token and user on success', async () => {
            // Arrange
            const responseData = { token: mockToken, user: mockUser };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => responseData
            });

            // Act
            const result = await authService.login('test@example.com', 'password');

            // Assert
            expect(result).toEqual(responseData);
        });

        it('should throw error when response is not ok', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act & Assert
            await expect(authService.login('test@example.com', 'wrongpassword'))
                .rejects
                .toThrow('Failed to login user');
        });

        it('should throw error on 401 unauthorized', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act & Assert
            await expect(authService.login('wrong@example.com', 'password'))
                .rejects
                .toThrow();
        });

        it('should throw error on network failure', async () => {
            // Arrange
            global.fetch.mockRejectedValue(new Error('Connection refused'));

            // Act & Assert
            await expect(authService.login('test@example.com', 'password'))
                .rejects
                .toThrow('Connection refused');
        });
    });

    describe('verifyToken()', () => {
        it('should make GET request to verify endpoint', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ valid: true, user: mockUser })
            });

            // Act
            await authService.verifyToken(mockToken);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/auth/verify',
                expect.objectContaining({
                    method: 'GET'
                })
            );
        });

        it('should include Authorization header with Bearer token', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ valid: true })
            });

            // Act
            await authService.verifyToken('my-token-abc');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer my-token-abc'
                    })
                })
            );
        });

        it('should merge default headers with Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ valid: true })
            });

            // Act
            await authService.verifyToken(mockToken);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': expect.stringContaining('Bearer')
                    })
                })
            );
        });

        it('should return response data on success', async () => {
            // Arrange
            const responseData = { valid: true, user: mockUser };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => responseData
            });

            // Act
            const result = await authService.verifyToken(mockToken);

            // Assert
            expect(result).toEqual(responseData);
        });

        it('should throw error when token is invalid', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act & Assert
            await expect(authService.verifyToken('invalid-token'))
                .rejects
                .toThrow('Failed to verify token');
        });

        it('should throw error when token is expired', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 403
            });

            // Act & Assert
            await expect(authService.verifyToken('expired-token'))
                .rejects
                .toThrow();
        });

        it('should throw error on network failure', async () => {
            // Arrange
            global.fetch.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(authService.verifyToken(mockToken))
                .rejects
                .toThrow('Network error');
        });
    });

    describe('API URL Configuration', () => {
        it('should use correct base URL for all methods', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({})
            });

            // Act
            await authService.signup('user', 'email@test.com', 'pass');
            await authService.login('email@test.com', 'pass');
            await authService.verifyToken('token');

            // Assert - all calls should use the mocked base URL
            const calls = fetch.mock.calls;
            expect(calls[0][0]).toContain('http://test-api.com/api');
            expect(calls[1][0]).toContain('http://test-api.com/api');
            expect(calls[2][0]).toContain('http://test-api.com/api');
        });
    });
});
