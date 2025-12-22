import * as jwtUtils from '../utils/jwt.js';
import * as userQueries from '../db/userQueries.js';
/**
 * AuthService handles user authentication logic including signup and login.
 * It interacts with the userQueries module to perform database operations.
 * Methods:
 * - signup(username, email, password): Registers a new user and returns a JWT token.
 * - login(email, password): Authenticates a user and returns a JWT token.
 */
export class AuthService {
    
    /**
     * This is the signup method for registering a new user.
     * If the email is already registered, it throws an error and warns the user.
     * that the email is already in use.
     * @param {string} username provided username by the user.
     * @param {string} email provided email by the user.
     * @param {string} password provided password by the user that will be hashed.
     * @returns {Promise<{token: string, user: {id: number, username: string, email: string}}>} 
     * An object containing the JWT token and user info.
     * @throws {Error} 409 - if the email is already registered.
     */
    async signup(username, email, password) {
        const existingUser = await userQueries.getUserByEmail(email);
        if(existingUser) {
            const error = new Error('Email is already registered');
            error.statusCode = 409;
            throw error;
        }
        const user = await userQueries.createUser(username, email, password);
        const token = jwtUtils.generateToken(user.id);

        return {
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }

    /**
     * This is the login method for authenticating an existing user.
     * It checks if the email exists and if the password matches.
     * If either check fails, it throws an error indicating invalid credentials.
     * @param {string} email the email provided by the user.
     * @param {string} password the password provided by the user.
     * @returns {Promise<{token: string, user: {id: number, username: string, email: string}}>}  
     * An object containing the JWT token and user info.
     * @throws {Error} 401 - if the email does not exist or the password is incorrect.
     */
    async login(email, password) {
        const user = await userQueries.getUserByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        } 
        const isValidPassword = await userQueries.confirmPassword(password, user.password_hash);
        if (!isValidPassword) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwtUtils.generateToken(user.id);

        return {
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }
}

// Export a singleton instance of AuthService for use in other parts of the application.
export const authService = new AuthService();
