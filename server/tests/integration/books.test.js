import { describe, it, expect, beforeAll, afterAll} from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import pool from '../../database.js';
import { createUser } from '../../db/userQueries.js';
import { generateToken } from '../../utils/jwt.js';
import { createRandomUser } from '../../utils/createRandomUser.js';

describe('Book Routes Integration', () => {
    let authToken;
    let userId;
    
    beforeAll(async () => {
        const user = createRandomUser();
        const testUser = await createUser(user.username, user.email, user.password);
        userId = testUser.id;
        authToken = generateToken(userId);
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('GET /api/books', () => {
        it('should return all books for the authenticated user', async () => {
            const res = await request(app)
                            .get('/api/books')
                            .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);

            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 401 if no token is provided', async () => {

            const res = await request(app).get('/api/books');

            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/books', () => {
        it('should create a new book', async () => {
            const newBook = {"title": "TestBook", "author": "TestAuthor", "genre": "Fiction", "rating": 4.2, "review": "This rating is a test."};

            const res = await request(app)
                            .post('/api/books').set('Authorization', `Bearer ${authToken}`)
                            .send(newBook);

            expect(res.status).toBe(201);
            
            expect(res.body).toMatchObject(newBook);
        });

    });

    
});
