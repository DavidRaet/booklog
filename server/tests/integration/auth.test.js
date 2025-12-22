import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import pool from '../../database.js';
import { createRandomUser } from '../helpers/createRandomUser.js';
import { getUserByEmail } from '../../db/userQueries.js';

describe('Auth Routes Integration', () => {

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
    });
});
