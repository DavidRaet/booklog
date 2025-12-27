import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import pool from '../../database.js';
import { createRandomUser } from '../helpers/createRandomUser.js';
import { getUserByEmail, createUser } from '../../db/userQueries.js';

describe('Auth Routes Integration', () => {
    // Store test user for duplicate email test
    let existingTestUser;

    beforeAll(async () => {
        // Create a known user for duplicate email testing
        const uniqueUser = createRandomUser();
        existingTestUser = {
            username: uniqueUser.username,
            email: `existing_${Date.now()}@test.com`,
            password: uniqueUser.password
        };
        await createUser(existingTestUser.username, existingTestUser.email, existingTestUser.password);
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new user successfully', async () => {
            const testUser = createRandomUser();
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(testUser);
            expect(res.status).toBe(201);
            expect(res.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
            expect(res.body).toMatchObject({
                user: {
                    id: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String)
                }
            });
        });

        it('should return 400 for invalid input', async () => {
            const invalidUser = { username: "fakeUser", email: "fakeEmail222@gmail.com"};
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(invalidUser);
            expect(res.status).toBe(400);
        });

        it('should return 409 for duplicate email', async () => {
            const duplicateUser = {
                username: 'newUsername',
                email: existingTestUser.email,
                password: 'ValidPassword123'
            };
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(duplicateUser);
            expect(res.status).toBe(409);
        });

        it('should return 400 for missing required fields', async () => {
            const missingEmail = { username: "testUser", password: "TestPassword123" };
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(missingEmail);
            expect(res.status).toBe(400);
        });

        it('should return 400 for invalid email format', async () => {
            const invalidEmail = { username: "testUser", email: "not-an-email", password: "TestPassword123" };
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(invalidEmail);
            expect(res.status).toBe(400);
        });

        it('should return 400 for password too short', async () => {
            const shortPassword = { username: "testUser", email: "valid@email.com", password: "123" };
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(shortPassword);
            expect(res.status).toBe(400);
        });

        it('should not include password_hash in response', async () => {
            const testUser = createRandomUser();
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(testUser);
            expect(res.status).toBe(201);
            expect(res.body.user).not.toHaveProperty('password_hash');
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should return valid JWT token format', async () => {
            const testUser = createRandomUser();
            const res = await request(app)
                            .post('/api/auth/signup')
                            .send(testUser);
            expect(res.status).toBe(201);
            // JWT format: header.payload.signature
            const tokenParts = res.body.token.split('.');
            expect(tokenParts).toHaveLength(3);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const user = await getUserByEmail('meEmail@example.com');
            const res = await request(app)
                                .post('/api/auth/login')
                                .send({"email": user.email, "password": "PasswordIsMe"});
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
        });

        it('should return 401 for invalid credentials', async () => {
            const user = await getUserByEmail('meEmail@example.com');
            
            const res = await request(app)
                                .post('/api/auth/login')
                                .send({"email": user.email, "password": "PasswordIsNotMe"});

            expect(res.status).toBe(401);
        });

        it('should return 401 for non-existent user', async () => {
            const res = await request(app)
                            .post('/api/auth/login')
                            .send({ email: 'nonexistent_user_12345@fake.com', password: 'anypassword' });
            expect(res.status).toBe(401);
        });

        it('should return 400 for missing email', async () => {
            const res = await request(app)
                            .post('/api/auth/login')
                            .send({ password: 'somepassword' });
            expect(res.status).toBe(400);
        });

        it('should return 400 for missing password', async () => {
            const res = await request(app)
                            .post('/api/auth/login')
                            .send({ email: 'valid@email.com' });
            expect(res.status).toBe(400);
        });

        it('should not include password_hash in login response', async () => {
            const user = await getUserByEmail('meEmail@example.com');
            const res = await request(app)
                                .post('/api/auth/login')
                                .send({ email: user.email, password: "PasswordIsMe" });
            expect(res.status).toBe(200);
            expect(res.body.user).not.toHaveProperty('password_hash');
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should return valid JWT token on successful login', async () => {
            const user = await getUserByEmail('meEmail@example.com');
            const res = await request(app)
                                .post('/api/auth/login')
                                .send({ email: user.email, password: "PasswordIsMe" });
            expect(res.status).toBe(200);
            // JWT format: header.payload.signature
            const tokenParts = res.body.token.split('.');
            expect(tokenParts).toHaveLength(3);
        });

        it('should return user object with expected fields', async () => {
            const user = await getUserByEmail('meEmail@example.com');
            const res = await request(app)
                                .post('/api/auth/login')
                                .send({ email: user.email, password: "PasswordIsMe" });
            expect(res.status).toBe(200);
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user).toHaveProperty('username');
            expect(res.body.user).toHaveProperty('email');
        });
    });
});
