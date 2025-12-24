import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../services/authService.js';
import * as userQueries from '../../db/userQueries.js';
import * as jwtUtils from '../../utils/jwt.js';

// Mock dependencies
vi.mock('../../db/userQueries.js');
vi.mock('../../utils/jwt.js');

describe('AuthService', () => {
    let authService;

    const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password'
    };

    const mockToken = 'mock-jwt-token';

    beforeEach(() => {
        vi.clearAllMocks();
        authService = new AuthService();
        
        // Default mock implementations
        jwtUtils.generateToken.mockReturnValue(mockToken);
    });

    describe('signup()', () => {
        it('should create a new user and return token with user info', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(null);
            userQueries.createUser.mockResolvedValue(mockUser);

            // Act
            const result = await authService.signup('testuser', 'test@example.com', 'password123');

            // Assert
            expect(userQueries.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(userQueries.createUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
            expect(jwtUtils.generateToken).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual({
                token: mockToken,
                user: {
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email
                }
            });
        });

        it('should throw error with statusCode 409 when email already exists', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(mockUser);

            // Act & Assert
            await expect(authService.signup('testuser', 'test@example.com', 'password123'))
                .rejects
                .toMatchObject({
                    message: 'Email is already registered',
                    statusCode: 409
                });

            expect(userQueries.createUser).not.toHaveBeenCalled();
            expect(jwtUtils.generateToken).not.toHaveBeenCalled();
        });

        it('should not include password_hash in returned user object', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(null);
            userQueries.createUser.mockResolvedValue(mockUser);

            // Act
            const result = await authService.signup('testuser', 'test@example.com', 'password123');

            // Assert
            expect(result.user).not.toHaveProperty('password_hash');
        });

        it('should call getUserByEmail before creating user', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(null);
            userQueries.createUser.mockResolvedValue(mockUser);

            // Act
            await authService.signup('testuser', 'test@example.com', 'password123');

            // Assert - verify call order
            expect(userQueries.getUserByEmail.mock.invocationCallOrder[0])
                .toBeLessThan(userQueries.createUser.mock.invocationCallOrder[0]);
        });
    });

    describe('login()', () => {
        it('should authenticate user and return token with user info', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(mockUser);
            userQueries.confirmPassword.mockResolvedValue(true);

            // Act
            const result = await authService.login('test@example.com', 'password123');

            // Assert
            expect(userQueries.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(userQueries.confirmPassword).toHaveBeenCalledWith('password123', mockUser.password_hash);
            expect(jwtUtils.generateToken).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual({
                token: mockToken,
                user: {
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email
                }
            });
        });

        it('should throw error with statusCode 401 when email does not exist', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.login('nonexistent@example.com', 'password123'))
                .rejects
                .toMatchObject({
                    message: 'Invalid email or password',
                    statusCode: 401
                });

            expect(userQueries.confirmPassword).not.toHaveBeenCalled();
            expect(jwtUtils.generateToken).not.toHaveBeenCalled();
        });

        it('should throw error with statusCode 401 when password is incorrect', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(mockUser);
            userQueries.confirmPassword.mockResolvedValue(false);

            // Act & Assert
            await expect(authService.login('test@example.com', 'wrongpassword'))
                .rejects
                .toMatchObject({
                    message: 'Invalid email or password',
                    statusCode: 401
                });

            expect(jwtUtils.generateToken).not.toHaveBeenCalled();
        });

        it('should not include password_hash in returned user object', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(mockUser);
            userQueries.confirmPassword.mockResolvedValue(true);

            // Act
            const result = await authService.login('test@example.com', 'password123');

            // Assert
            expect(result.user).not.toHaveProperty('password_hash');
        });

        it('should generate token only after successful password verification', async () => {
            // Arrange
            userQueries.getUserByEmail.mockResolvedValue(mockUser);
            userQueries.confirmPassword.mockResolvedValue(true);

            // Act
            await authService.login('test@example.com', 'password123');

            // Assert - verify call order
            expect(userQueries.confirmPassword.mock.invocationCallOrder[0])
                .toBeLessThan(jwtUtils.generateToken.mock.invocationCallOrder[0]);
        });

        it('should return same error message for invalid email and invalid password', async () => {
            // This ensures we don't leak information about which field is wrong
            
            // Test invalid email
            userQueries.getUserByEmail.mockResolvedValue(null);
            const emailError = await authService.login('wrong@example.com', 'password123')
                .catch(e => e.message);

            // Test invalid password
            userQueries.getUserByEmail.mockResolvedValue(mockUser);
            userQueries.confirmPassword.mockResolvedValue(false);
            const passwordError = await authService.login('test@example.com', 'wrong')
                .catch(e => e.message);

            // Assert - both should have identical error messages (security best practice)
            expect(emailError).toBe(passwordError);
            expect(passwordError).toBe('Invalid email or password');
        });
    });
});
