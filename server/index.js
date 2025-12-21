import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import env from './config/env.js';

const app = express();
const API_BASE_URL = env.apiBaseUrl;
const corsURL = env.corsOrigin;
const port = env.port;

app.use(cors({
    origin: corsURL,
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on ${API_BASE_URL}`);
    });
}

export default app;


