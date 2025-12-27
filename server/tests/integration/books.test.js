import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import pool from '../../database.js';
import { createUser } from '../../db/userQueries.js';
import { generateToken } from '../../utils/jwt.js';
import { createRandomUser } from '../helpers/createRandomUser.js';
import { createBook } from '../../db/bookQueries.js';

describe('Book Routes Integration', () => {
    let authToken;
    let userId;
    let secondUserToken;
    let secondUserId;
    let testBookId;
    
    beforeAll(async () => {
        // Create first test user
        const user = createRandomUser();
        const testUser = await createUser(user.username, user.email, user.password);
        userId = testUser.id;
        authToken = generateToken(userId);

        // Create second test user for authorization tests
        const user2 = createRandomUser();
        const testUser2 = await createUser(user2.username, user2.email, user2.password);
        secondUserId = testUser2.id;
        secondUserToken = generateToken(secondUserId);

        // Create a book for user 1 to test get/update/delete
        const testBook = await createBook({
            title: 'Test Book for Integration',
            author: 'Test Author',
            genre: 'Fiction',
            rating: 4.0,
            review: 'This is a test book.',
            user_id: userId
        });
        testBookId = testBook.id;
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

        it('should return 403 for invalid token', async () => {
            const res = await request(app)
                            .get('/api/books')
                            .set('Authorization', 'Bearer invalid-token-here');
            expect(res.status).toBe(403);
        });

        it('should return empty array for user with no books', async () => {
            // Create a new user with no books
            const newUser = createRandomUser();
            const createdUser = await createUser(newUser.username, newUser.email, newUser.password);
            const newUserToken = generateToken(createdUser.id);

            const res = await request(app)
                            .get('/api/books')
                            .set('Authorization', `Bearer ${newUserToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('GET /api/books/:id', () => {
        it('should return a single book by ID', async () => {
            const res = await request(app)
                            .get(`/api/books/${testBookId}`)
                            .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', testBookId);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('author');
        });

        it('should return 404 for non-existent book', async () => {
            const res = await request(app)
                            .get('/api/books/99999999')
                            .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });

        it('should return 403 when accessing another user\'s book', async () => {
            const res = await request(app)
                            .get(`/api/books/${testBookId}`)
                            .set('Authorization', `Bearer ${secondUserToken}`);

            expect(res.status).toBe(403);
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app).get(`/api/books/${testBookId}`);
            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/books', () => {
        it('should create a new book', async () => {
            const newBook = {
                title: "TestBook",
                author: "TestAuthor",
                genre: "Fiction",
                rating: 4.2,
                review: "This rating is a test."
            };

            const res = await request(app)
                            .post('/api/books')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(newBook);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject(newBook);
            expect(res.body).toHaveProperty('id');
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteBook = {
                title: "Only Title"
                // missing author, genre, rating
            };

            const res = await request(app)
                            .post('/api/books')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(incompleteBook);

            expect(res.status).toBe(400);
        });

        it('should return 400 for invalid rating (outside 0-5 range)', async () => {
            const invalidRating = {
                title: "Test",
                author: "Author",
                genre: "Fiction",
                rating: 10, // Invalid - should be 0-5
                review: "Test"
            };

            const res = await request(app)
                            .post('/api/books')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(invalidRating);

            expect(res.status).toBe(400);
        });

        it('should return 400 for negative rating', async () => {
            const negativeRating = {
                title: "Test",
                author: "Author",
                genre: "Fiction",
                rating: -1,
                review: "Test"
            };

            const res = await request(app)
                            .post('/api/books')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(negativeRating);

            expect(res.status).toBe(400);
        });

        it('should return 401 without auth token', async () => {
            const newBook = {
                title: "Test",
                author: "Author",
                genre: "Fiction",
                rating: 4,
                review: "Test"
            };

            const res = await request(app)
                            .post('/api/books')
                            .send(newBook);

            expect(res.status).toBe(401);
        });

        it('should associate created book with authenticated user', async () => {
            const newBook = {
                title: "User Association Test",
                author: "Test Author",
                genre: "Fiction",
                rating: 3.5,
                review: "Testing user association"
            };

            const res = await request(app)
                            .post('/api/books')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(newBook);

            expect(res.status).toBe(201);
            expect(res.body.user_id).toBe(userId);
        });
    });

    describe('PUT /api/books/:id', () => {
        let bookToUpdate;

        beforeAll(async () => {
            // Create a book specifically for update tests
            bookToUpdate = await createBook({
                title: 'Book To Update',
                author: 'Original Author',
                genre: 'Drama',
                rating: 3.0,
                review: 'Original review',
                user_id: userId
            });
        });

        it('should update own book successfully', async () => {
            const updateData = {
                title: 'Updated Title',
                rating: 4.5
            };

            const res = await request(app)
                            .put(`/api/books/${bookToUpdate.id}`)
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated Title');
            expect(res.body.rating).toBe(4.5);
        });

        it('should return 403 when updating another user\'s book', async () => {
            const updateData = { title: 'Unauthorized Update' };

            const res = await request(app)
                            .put(`/api/books/${testBookId}`)
                            .set('Authorization', `Bearer ${secondUserToken}`)
                            .send(updateData);

            expect(res.status).toBe(403);
        });

        it('should return 404 for non-existent book', async () => {
            const updateData = { title: 'Update Non-existent' };

            const res = await request(app)
                            .put('/api/books/99999999')
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(updateData);

            expect(res.status).toBe(404);
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app)
                            .put(`/api/books/${testBookId}`)
                            .send({ title: 'No Auth Update' });

            expect(res.status).toBe(401);
        });

        it('should return 400 for invalid update data', async () => {
            const invalidUpdate = {
                rating: 15 // Invalid rating
            };

            const res = await request(app)
                            .put(`/api/books/${bookToUpdate.id}`)
                            .set('Authorization', `Bearer ${authToken}`)
                            .send(invalidUpdate);

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /api/books/:id', () => {
        let bookToDelete;

        beforeAll(async () => {
            // Create a book specifically for delete tests
            bookToDelete = await createBook({
                title: 'Book To Delete',
                author: 'Delete Author',
                genre: 'Horror',
                rating: 2.0,
                review: 'Will be deleted',
                user_id: userId
            });
        });

        it('should delete own book successfully', async () => {
            const res = await request(app)
                            .delete(`/api/books/${bookToDelete.id}`)
                            .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(204);

            // Verify book is actually deleted
            const getRes = await request(app)
                            .get(`/api/books/${bookToDelete.id}`)
                            .set('Authorization', `Bearer ${authToken}`);
            expect(getRes.status).toBe(404);
        });

        it('should return 403 when deleting another user\'s book', async () => {
            const res = await request(app)
                            .delete(`/api/books/${testBookId}`)
                            .set('Authorization', `Bearer ${secondUserToken}`);

            expect(res.status).toBe(403);
        });

        it('should return 404 for non-existent book', async () => {
            const res = await request(app)
                            .delete('/api/books/99999999')
                            .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app).delete(`/api/books/${testBookId}`);
            expect(res.status).toBe(401);
        });
    });
});
