import express from 'express';
import cors from 'cors';
import BookSchema from './BookSchema.js';
import * as bookQueries from './db/bookQueries.js'


const app = express();


app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());


const API_BASE_URL = "http://localhost:3002/api";

app.get("/api/books", async (req, res) => {
    try {
        const books = await bookQueries.getAllBooks()
        res.status(200).json(books);
    } catch (err) {
        console.log('Database error: ', err)
        res.status(500).json({ message: "Failed to fetch books" })
    }
});

app.get("/api/books/:id", async (req, res) => {
    try {
    const id = req.params.id;
    const book = await bookQueries.getBookById(id)
    if(book){
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found." });
    }
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: "Failed to fetch book"})
    }
});


app.post("/api/books", async (req, res) => {
    const result = BookSchema.omit({ id: true }).safeParse(req.body);

    if (result.success){
        try {
            const newBook = await bookQueries.createBook(result.data);
            res.status(201).json(newBook);
        } catch (err) {
            console.error('Database error:', err)
            res.status(500).json({ message: "Failed to create book"})
        }
    } else {
        res.status(400).json({ 
            message: "Invalid Book Data",
            errors: result.error.issues
        });
    }
}); 

app.put("/api/books/:id", async (req, res) => {
    const id = req.params.id;

    const updatedBook = BookSchema.safeParse(req.body); 

    if(!updatedBook.success){
        return res.status(400).json({ 
            message: "Invalid book data.",
            errors: updatedBook.error.issues 
        });
    }

    try {
        const book = await bookQueries.updateBook(id, updatedBook.data)

        if(book){
            res.status(200).json(book)
        }
        else{
            return res.status(404).json({ message: "Book not found." });
        }
    } catch (err) {
            console.error('Database error:', err)
            res.status(500).json({ message: "Failed to create book"})
    }
});

app.delete("/api/books/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        await bookQueries.deleteBook(id)
        res.status(204).send()
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: "Failed to delete book"})
    }
});


app.listen(3002, () => {
    console.log(`Server running on ${API_BASE_URL}`);
});


