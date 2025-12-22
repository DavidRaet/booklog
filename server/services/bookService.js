import * as bookQueries from '../db/bookQueries.js';

/**
 * BookService class to handle book-related operations for users.
 * Methods:
 * - getBooksByUser(userId): Fetches all books associated with a specific user.
 * - createBook(book): Creates a new book entry for a user.
 * - updateBook(id, book): Updates an existing book entry.
 * - deleteBook(id): Deletes a book entry.
 * - verifyBookOwnership(bookId, userId): Ensures that a book belongs to a specific user.
 */
export class BookService {
    /**
     * This is the method to get all books for a specific user.
     * @param {string} userId the ID of the user whose books are to be fetched.
     * @returns {Promise<Book[]>} an array of books belonging to the user.
     */
    async getBooksByUser(userId) {
        return await bookQueries.getBooksByUserId(userId);
    }

    /**
     * This is the method to get a specific book by its ID 
     * We first verify that the book belongs to the user making the request.
     * Then, we return the book details.
     * @param {string} bookId the ID of the book to be fetched.
     * @param {string} userId the ID of the user requesting the book.
     * @returns {Promise<Book>} the book details if ownership is verified to the user.
     */
    async getBookById(bookId, userId) {
        const verifiedBook = await this.verifyBookOwnership(bookId, userId);
        return verifiedBook;
    } 

    /**
     * This is the method to create a new book entry for a user.
     * @param {Book} book the properties of the book to be created.
     * @returns {Promise<Book>} the newly created book entry. 
     */
    async createBook(book) {
        return await bookQueries.createBook(book);
    }

    /**
     * This method updates an existing book entry.
     * It first verifies that the book belongs to the user making the request before allowing the update
     * by calling getBookById, which performs the ownership check.
     * @param {string} bookId the ID of the book to be updated.
     * @param {string} userId the ID of the user requesting the update.
     * @returns {Promise<Book>} the updated book entry.
     */
    async updateBook(bookId, userId, bookData) {
        await this.getBookById(bookId, userId);
        return await bookQueries.updateBook(bookId, bookData);
    }

    /**
     * This method deletes a book entry.
     * It first verifies that the book belongs to the user making the request before allowing the deletion
     * by calling getBookById, which performs the ownership check.
     * Since this method deletes the book, it does not return any value.
     * On the router level, we send a 204 No Content response to signal successful deletion.
     * @param {string} bookId the ID of the book to be deleted.
     * @param {string} userId the ID of the user requesting the deletion.
     */
    async deleteBook(bookId, userId) {
        await this.getBookById(bookId, userId);
        await bookQueries.deleteBook(bookId);
    }
    
    /**
     * This method verifies that a book belongs to a specific user.
     * The verification is done by comparing the user_id of the book with the provided userId.
     * If the book does not exist, it throws a 404 error.
     * If the book exists but does not belong to the user, it throws a 403 error.
     * The 403 error indicates that the user is authenticated but does not have permission to access the resource.
     * The 404 error indicates that the resource does not exist.
     * @param {*} bookId 
     * @param {*} userId 
     * @returns the book if ownership is verified.
     */
    async verifyBookOwnership(bookId, userId) {
        const book = await bookQueries.getBookById(bookId);
    
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
}


// Exporting a singleton instance of BookService for use in other parts of the application. 
export const bookService = new BookService();