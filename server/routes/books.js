import express from 'express';
import BookSchema from '../schemas/BookSchema.js';
import { bookService } from '../services/bookService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const books = await bookService.getBooksByUser(req.userId);
        res.status(200).json(books);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const book = await bookService.verifyBookOwnership(id, req.userId);
        res.status(200).json(book);
    } catch (err) {
        next(err);
    }
});

router.post("/", authenticateToken, async (req, res) => {
    console.log('User ID from token:', req.userId);
    const result = BookSchema.omit({ id: true, user_id: true }).safeParse(req.body);

    if (result.success) {
        try {
            const bookData = { ...result.data, user_id: req.userId };
            const newBook = await bookService.createBook(bookData);
            res.status(201).json(newBook);
        } catch (err) {
            next(err);
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
    const userId = req.userId;
    const validation = BookSchema.omit({ user_id: true }).safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid book data.",
            errors: validation.error.issues
        });
    }

    try {
        await bookService.verifyBookOwnership(id, userId);
        const updatedBook = await bookService.updateBook(id, userId);
        res.status(200).json(updatedBook);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        await bookService.deleteBook(id, req.userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
