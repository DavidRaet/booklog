import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookService } from '../../services/bookService.js';
import * as bookQueries from '../../db/bookQueries.js';

// Mock dependencies
vi.mock('../../db/bookQueries.js');

describe('BookService', () => {
    let bookService;

    const mockUserId = 'user-123';
    const mockOtherUserId = 'user-456';
    
    const mockBook = {
        id: 'book-1',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        rating: 4.5,
        review: 'Great book!',
        user_id: mockUserId
    };

    const mockBooks = [
        mockBook,
        {
            id: 'book-2',
            title: 'Another Book',
            author: 'Another Author',
            genre: 'Non-Fiction',
            rating: 3.5,
            review: 'Good read',
            user_id: mockUserId
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        bookService = new BookService();
    });

    describe('getBooksByUser()', () => {
        it('should return array of books for a user', async () => {
            // Arrange
            bookQueries.getBooksByUserId.mockResolvedValue(mockBooks);

            // Act
            const result = await bookService.getBooksByUser(mockUserId);

            // Assert
            expect(bookQueries.getBooksByUserId).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockBooks);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return empty array when user has no books', async () => {
            // Arrange
            bookQueries.getBooksByUserId.mockResolvedValue([]);

            // Act
            const result = await bookService.getBooksByUser(mockUserId);

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('getBookById()', () => {
        it('should return book when user owns it', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act
            const result = await bookService.getBookById(mockBook.id, mockUserId);

            // Assert
            expect(bookQueries.getBookById).toHaveBeenCalledWith(mockBook.id);
            expect(result).toEqual(mockBook);
        });

        it('should throw error with statusCode 404 when book does not exist', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(null);

            // Act & Assert
            await expect(bookService.getBookById('nonexistent-id', mockUserId))
                .rejects
                .toMatchObject({
                    message: 'Book not found',
                    statusCode: 404
                });
        });

        it('should throw error with statusCode 403 when user does not own the book', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act & Assert
            await expect(bookService.getBookById(mockBook.id, mockOtherUserId))
                .rejects
                .toMatchObject({
                    message: 'Access denied',
                    statusCode: 403
                });
        });
    });

    describe('createBook()', () => {
        it('should create a new book successfully', async () => {
            // Arrange
            const newBookData = {
                title: 'New Book',
                author: 'New Author',
                genre: 'Mystery',
                rating: 4.0,
                review: 'Interesting',
                user_id: mockUserId
            };
            const createdBook = { id: 'book-3', ...newBookData };
            bookQueries.createBook.mockResolvedValue(createdBook);

            // Act
            const result = await bookService.createBook(newBookData);

            // Assert
            expect(bookQueries.createBook).toHaveBeenCalledWith(newBookData);
            expect(result).toEqual(createdBook);
        });

        it('should pass all book properties to createBook query', async () => {
            // Arrange
            const bookData = {
                title: 'Test',
                author: 'Author',
                genre: 'Genre',
                rating: 5,
                review: 'Review',
                user_id: mockUserId
            };
            bookQueries.createBook.mockResolvedValue({ id: '1', ...bookData });

            // Act
            await bookService.createBook(bookData);

            // Assert
            expect(bookQueries.createBook).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Test',
                    author: 'Author',
                    genre: 'Genre',
                    rating: 5,
                    review: 'Review',
                    user_id: mockUserId
                })
            );
        });
    });

    describe('updateBook()', () => {
        it('should update book when user owns it', async () => {
            // Arrange
            const updateData = { title: 'Updated Title', rating: 5 };
            const updatedBook = { ...mockBook, ...updateData };
            bookQueries.getBookById.mockResolvedValue(mockBook);
            bookQueries.updateBook.mockResolvedValue(updatedBook);

            // Act
            const result = await bookService.updateBook(mockBook.id, mockUserId, updateData);

            // Assert
            expect(bookQueries.getBookById).toHaveBeenCalledWith(mockBook.id);
            expect(bookQueries.updateBook).toHaveBeenCalledWith(mockBook.id, updateData);
            expect(result).toEqual(updatedBook);
        });

        it('should throw error with statusCode 404 when book does not exist', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(null);

            // Act & Assert
            await expect(bookService.updateBook('nonexistent-id', mockUserId, { title: 'Test' }))
                .rejects
                .toMatchObject({
                    message: 'Book not found',
                    statusCode: 404
                });

            expect(bookQueries.updateBook).not.toHaveBeenCalled();
        });

        it('should throw error with statusCode 403 when user does not own the book', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act & Assert
            await expect(bookService.updateBook(mockBook.id, mockOtherUserId, { title: 'Test' }))
                .rejects
                .toMatchObject({
                    message: 'Access denied',
                    statusCode: 403
                });

            expect(bookQueries.updateBook).not.toHaveBeenCalled();
        });

        it('should verify ownership before updating', async () => {
            // Arrange
            const updateData = { title: 'Updated' };
            bookQueries.getBookById.mockResolvedValue(mockBook);
            bookQueries.updateBook.mockResolvedValue({ ...mockBook, ...updateData });

            // Act
            await bookService.updateBook(mockBook.id, mockUserId, updateData);

            // Assert - getBookById (for ownership check) should be called before updateBook
            expect(bookQueries.getBookById.mock.invocationCallOrder[0])
                .toBeLessThan(bookQueries.updateBook.mock.invocationCallOrder[0]);
        });
    });

    describe('deleteBook()', () => {
        it('should delete book when user owns it', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);
            bookQueries.deleteBook.mockResolvedValue(undefined);

            // Act
            await bookService.deleteBook(mockBook.id, mockUserId);

            // Assert
            expect(bookQueries.getBookById).toHaveBeenCalledWith(mockBook.id);
            expect(bookQueries.deleteBook).toHaveBeenCalledWith(mockBook.id);
        });

        it('should throw error with statusCode 404 when book does not exist', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(null);

            // Act & Assert
            await expect(bookService.deleteBook('nonexistent-id', mockUserId))
                .rejects
                .toMatchObject({
                    message: 'Book not found',
                    statusCode: 404
                });

            expect(bookQueries.deleteBook).not.toHaveBeenCalled();
        });

        it('should throw error with statusCode 403 when user does not own the book', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act & Assert
            await expect(bookService.deleteBook(mockBook.id, mockOtherUserId))
                .rejects
                .toMatchObject({
                    message: 'Access denied',
                    statusCode: 403
                });

            expect(bookQueries.deleteBook).not.toHaveBeenCalled();
        });

        it('should verify ownership before deleting', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);
            bookQueries.deleteBook.mockResolvedValue(undefined);

            // Act
            await bookService.deleteBook(mockBook.id, mockUserId);

            // Assert - getBookById (for ownership check) should be called before deleteBook
            expect(bookQueries.getBookById.mock.invocationCallOrder[0])
                .toBeLessThan(bookQueries.deleteBook.mock.invocationCallOrder[0]);
        });

        it('should not return any value on successful deletion', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);
            bookQueries.deleteBook.mockResolvedValue(undefined);

            // Act
            const result = await bookService.deleteBook(mockBook.id, mockUserId);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('verifyBookOwnership()', () => {
        it('should return book when ownership is verified', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act
            const result = await bookService.verifyBookOwnership(mockBook.id, mockUserId);

            // Assert
            expect(result).toEqual(mockBook);
        });

        it('should throw 404 error when book does not exist', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(null);

            // Act & Assert
            await expect(bookService.verifyBookOwnership('nonexistent', mockUserId))
                .rejects
                .toMatchObject({
                    message: 'Book not found',
                    statusCode: 404
                });
        });

        it('should throw 403 error when user does not own the book', async () => {
            // Arrange
            bookQueries.getBookById.mockResolvedValue(mockBook);

            // Act & Assert
            await expect(bookService.verifyBookOwnership(mockBook.id, mockOtherUserId))
                .rejects
                .toMatchObject({
                    message: 'Access denied',
                    statusCode: 403
                });
        });

        it('should check 404 condition before 403 condition', async () => {
            // A non-existent book should return 404, not 403
            // This prevents information leakage about book existence
            bookQueries.getBookById.mockResolvedValue(null);

            await expect(bookService.verifyBookOwnership('nonexistent', mockOtherUserId))
                .rejects
                .toMatchObject({
                    statusCode: 404
                });
        });
    });
});
