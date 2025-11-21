import { getBookById } from "../db/bookQueries.js";


export const verifyBookOwnership = async (bookId, userId) => {
    const book = await getBookById(bookId);
    
    if (!book) {
        const error = new Error('Book not found');
        error.statusCode = 404;
        throw error;
    }

    if (book.user_id !== userId) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
    }

    return book;
};

