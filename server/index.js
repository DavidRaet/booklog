import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import books from './books.js';
import BookSchema from './BookSchema.js';
const app = express();


app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());


const API_BASE_URL = "http://localhost:3002/api";

app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

app.get("/api/books/:id", (req, res) => {
    const id = req.params.id;
    const bookID = books.findIndex(book => id === book.id);

    if(bookID !== -1){
        res.status(200).json(books[bookID]);
    } else {
        res.status(404).json({message: "Book not found."});
    }
});

app.post("/api/books", (req, res) => {
    const result = BookSchema.omit({ id: true }).safeParse(req.body);

    if (result.success){
        const newBook = {id: uuidv4(), ...result.data };
        books.push(newBook);
        res.status(201).json(newBook);
    } else {
        res.status(400).json({ 
            message: "Invalid Book Data",
            errors: result.error.issues
        });
    }
}); 

app.put("/api/books/:id", (req, res) => {
    const id = req.params.id;
    const bookID = books.findIndex(book => book.id === id);

    const updatedBook = BookSchema.safeParse(req.body); 

    if (bookID === -1){
        return res.status(404).json({ message: "Book not found." });
    }


    if(!updatedBook.success){
        return res.status(400).json({ 
            message: "Invalid book data.",
            errors: updatedBook.error.issues 
        });
    }

    books[bookID] = updatedBook.data;
    res.status(200).json(books[bookID]); 
});

app.delete("/api/books/:id", (req, res) => {
    const id = req.params.id;
    const bookID = books.findIndex(book => book.id === id);

    if (bookID !== -1){
        books.splice(bookID, 1); 
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Book you are trying to delete cannot be found." });
    }
});


app.listen(3002, () => {
    console.log(`Server running on ${API_BASE_URL}`);
});


