import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import healthRoutes from './routes/health.js';
import errorHandler from './middleware/errorHandler.js';
import env from './config/env.js';
import logger from './utils/logger.js';

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

// Health check endpoint - no auth required, used by load balancers/monitoring
app.use('/health', healthRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger.info('Server started', { url: API_BASE_URL, port });
    });
}

export default app;


