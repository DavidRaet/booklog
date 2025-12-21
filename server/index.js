import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';

const app = express();
const API_BASE_URL = "http://localhost:3002/api";


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3002, () => {
        console.log(`Server running on ${API_BASE_URL}`);
    });
}

export default app;


