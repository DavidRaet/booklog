import express from 'express';
import cors from 'cors';
import BookSchema from './schemas/BookSchema.js';
import * as bookQueries from './db/bookQueries.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { verifyBookOwnership } from './utils/verifyBookOwnership.js';
const app = express();
const API_BASE_URL = "http://localhost:3002/api";


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());



app.use('/api/auth', authRoutes);




app.get("/api/books", authenticateToken, async (req, res) => {
    try {
        const books = await bookQueries.getBooksByUserId(req.userId);
        res.status(200).json(books);
    } catch (err) {
        console.error('[GET /api/books] Database error:', {
            userId: req.userId,
            error: err.message,
            stack: err.stack
        })
        res.status(500).json({ message: "Failed to fetch books." });
    }
});

app.get("/api/books/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const book = await verifyBookOwnership(id, req.userId)
        res.status(200).json(book)
    } catch (err) {
        if (err.statusCode) res.status(500).json({ message: "Failed to fetch book" });
    }
});


app.post("/api/books", authenticateToken, async (req, res) => {
    console.log('User ID from token:', req.userId);
    const result = BookSchema.omit({ id: true, user_id: true }).safeParse(req.body);

    if (result.success) {
        try {
            const bookData = { ...result.data, user_id: req.userId }
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

app.put("/api/books/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    const validation = BookSchema.omit({ user_id: true }).safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid book data.",
            errors: validation.error.issues
        });
    }

    try {
        const book = await verifyBookOwnership(id, req.userId);
        res.status(200).json(book);

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: "Failed to create book" });
    }
});

app.delete("/api/books/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const existingBook = await bookQueries.getBookById(id)

        if (!existingBook) {
            return res.status(404).json({ message: 'Book was not found.' })
        }

        if (existingBook.user_id !== req.userId) {
            return res.status(403).json({ message: "You don't have access to this book." })
        }

        await bookQueries.deleteBook(id);
        res.status(204).send();
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: "Failed to delete book" });
    }
});


app.listen(3002, () => {
    console.log(`Server running on ${API_BASE_URL}`);
});


