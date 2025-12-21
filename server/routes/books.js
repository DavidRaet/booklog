import express from 'express';
import BookSchema from '../schemas/BookSchema.js';
import * as bookQueries from '../db/bookQueries.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyBookOwnership } from '../utils/verifyBookOwnership.js';

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const books = await bookQueries.getBooksByUserId(req.userId);
        res.status(200).json(books);
    } catch (err) {
        console.error('[GET /api/books] Database error:', {
            userId: req.userId,
            error: err.message,
            stack: err.stack
        });
        res.status(500).json({ message: "Failed to fetch books." });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const book = await verifyBookOwnership(id, req.userId);
        res.status(200).json(book);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || "Failed to fetch book" });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    console.log('User ID from token:', req.userId);
    const result = BookSchema.omit({ id: true, user_id: true }).safeParse(req.body);

    if (result.success) {
        try {
            const bookData = { ...result.data, user_id: req.userId };
            const newBook = await bookQueries.createBook(bookData);
            res.status(201).json(newBook);
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: "Failed to create book" });
        }
    } else {
        res.status(400).json({
            message: "Invalid Book Data",
            errors: result.error.issues
        });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const validation = BookSchema.omit({ user_id: true }).safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid book data.",
            errors: validation.error.issues
        });
    }

    try {
        await verifyBookOwnership(id, req.userId);
        const updatedBook = await bookQueries.updateBook(id, validation.data);
        res.status(200).json(updatedBook);
    } catch (err) {
        console.error('Database error:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || "Failed to update book" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        await verifyBookOwnership(id, req.userId);
        await bookQueries.deleteBook(id);
        res.status(204).send();
    } catch (err) {
        console.error('Database error:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || "Failed to delete book" });
    }
});

export default router;
