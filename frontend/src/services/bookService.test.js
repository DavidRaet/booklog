import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bookService } from './bookService.js';

// Mock the api config
vi.mock('../config/api.js', () => ({
    default: {
        apiBaseUrl: 'http://test-api.com/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
}));

describe('bookService', () => {
    const mockToken = 'mock-jwt-token-123';
    
    const mockBook = {
        id: 'book-1',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        rating: 4.5,
        review: 'Great book!'
    };

    const mockBooks = [
        mockBook,
        {
            id: 'book-2',
            title: 'Another Book',
            author: 'Another Author',
            genre: 'Non-Fiction',
            rating: 3.5,
            review: 'Interesting read'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset fetch mock
        global.fetch = vi.fn();
        // Mock localStorage
        global.localStorage = {
            getItem: vi.fn().mockReturnValue(mockToken),
            setItem: vi.fn(),
            removeItem: vi.fn()
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAllBooks()', () => {
        it('should make GET request to books endpoint', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            await bookService.getAllBooks();

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/books',
                expect.any(Object)
            );
        });

        it('should include Authorization header with token from localStorage', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            await bookService.getAllBooks();

            // Assert
            expect(localStorage.getItem).toHaveBeenCalledWith('token');
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should return array of books on success', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            const result = await bookService.getAllBooks();

            // Assert
            expect(result).toEqual(mockBooks);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should throw error when response is not ok', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act & Assert
            await expect(bookService.getAllBooks())
                .rejects
                .toThrow('Failed to fetch books.');
        });

        it('should throw error on network failure', async () => {
            // Arrange
            global.fetch.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(bookService.getAllBooks())
                .rejects
                .toThrow('Network error');
        });

        it('should work without token (though will likely fail auth)', async () => {
            // Arrange
            localStorage.getItem.mockReturnValue(null);
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => []
            });

            // Act
            await bookService.getAllBooks();

            // Assert - should still make the request
            expect(fetch).toHaveBeenCalled();
        });
    });

    describe('getBookById()', () => {
        it('should make GET request to correct endpoint with book ID', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBook
            });

            // Act
            await bookService.getBookById('book-123');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/books/book-123',
                expect.any(Object)
            );
        });

        it('should include Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBook
            });

            // Act
            await bookService.getBookById('book-1');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should return book on success', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBook
            });

            // Act
            const result = await bookService.getBookById('book-1');

            // Assert
            expect(result).toEqual(mockBook);
        });

        it('should throw error when book is not found', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 404
            });

            // Act & Assert
            await expect(bookService.getBookById('nonexistent'))
                .rejects
                .toThrow('Book not found.');
        });

        it('should throw error on 403 forbidden', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 403
            });

            // Act & Assert
            await expect(bookService.getBookById('someone-elses-book'))
                .rejects
                .toThrow();
        });
    });

    describe('createBook()', () => {
        const newBookData = {
            title: 'New Book',
            author: 'New Author',
            genre: 'Mystery',
            rating: 4.0,
            review: 'Exciting!'
        };

        it('should make POST request to books endpoint', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ id: 'new-id', ...newBookData })
            });

            // Act
            await bookService.createBook(newBookData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/books',
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        it('should send book data in request body', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ id: 'new-id', ...newBookData })
            });

            // Act
            await bookService.createBook(newBookData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify(newBookData)
                })
            );
        });

        it('should include Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ id: 'new-id', ...newBookData })
            });

            // Act
            await bookService.createBook(newBookData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should return created book on success', async () => {
            // Arrange
            const createdBook = { id: 'new-id', ...newBookData };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => createdBook
            });

            // Act
            const result = await bookService.createBook(newBookData);

            // Assert
            expect(result).toEqual(createdBook);
        });

        it('should throw error when creation fails', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 400
            });

            // Act & Assert
            await expect(bookService.createBook(newBookData))
                .rejects
                .toThrow('Failed to create book.');
        });

        it('should throw error on 401 unauthorized', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act & Assert
            await expect(bookService.createBook(newBookData))
                .rejects
                .toThrow();
        });
    });

    describe('updateBook()', () => {
        const updateData = {
            title: 'Updated Title',
            rating: 5
        };

        it('should make PUT request to correct endpoint with book ID', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ ...mockBook, ...updateData })
            });

            // Act
            await bookService.updateBook('book-123', updateData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/books/book-123',
                expect.objectContaining({
                    method: 'PUT'
                })
            );
        });

        it('should send update data in request body', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ ...mockBook, ...updateData })
            });

            // Act
            await bookService.updateBook('book-1', updateData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify(updateData)
                })
            );
        });

        it('should include Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ ...mockBook, ...updateData })
            });

            // Act
            await bookService.updateBook('book-1', updateData);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should return updated book on success', async () => {
            // Arrange
            const updatedBook = { ...mockBook, ...updateData };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => updatedBook
            });

            // Act
            const result = await bookService.updateBook('book-1', updateData);

            // Assert
            expect(result).toEqual(updatedBook);
        });

        it('should throw error when update fails', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 400
            });

            // Act & Assert
            await expect(bookService.updateBook('book-1', updateData))
                .rejects
                .toThrow('Failed to update book.');
        });

        it('should throw error on 403 forbidden (not owner)', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 403
            });

            // Act & Assert
            await expect(bookService.updateBook('someone-elses-book', updateData))
                .rejects
                .toThrow();
        });

        it('should throw error on 404 not found', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 404
            });

            // Act & Assert
            await expect(bookService.updateBook('nonexistent', updateData))
                .rejects
                .toThrow();
        });
    });

    describe('deleteBook()', () => {
        it('should make DELETE request to correct endpoint with book ID', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true
            });

            // Act
            await bookService.deleteBook('book-123');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'http://test-api.com/api/books/book-123',
                expect.objectContaining({
                    method: 'DELETE'
                })
            );
        });

        it('should include Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true
            });

            // Act
            await bookService.deleteBook('book-1');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should not return any value on success', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true
            });

            // Act
            const result = await bookService.deleteBook('book-1');

            // Assert
            expect(result).toBeUndefined();
        });

        it('should throw error when deletion fails', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 500
            });

            // Act & Assert
            await expect(bookService.deleteBook('book-1'))
                .rejects
                .toThrow('Failed to delete book.');
        });

        it('should throw error on 403 forbidden (not owner)', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 403
            });

            // Act & Assert
            await expect(bookService.deleteBook('someone-elses-book'))
                .rejects
                .toThrow();
        });

        it('should throw error on 404 not found', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: false,
                status: 404
            });

            // Act & Assert
            await expect(bookService.deleteBook('nonexistent'))
                .rejects
                .toThrow();
        });
    });

    describe('Headers Configuration', () => {
        it('should merge default headers with Authorization header', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            await bookService.getAllBooks();

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${mockToken}`
                    })
                })
            );
        });

        it('should only include default headers when no token exists', async () => {
            // Arrange
            localStorage.getItem.mockReturnValue(null);
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            await bookService.getAllBooks();

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
            );
        });
    });

    describe('Token Retrieval', () => {
        it('should get token from localStorage for each request', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockBooks
            });

            // Act
            await bookService.getAllBooks();
            await bookService.getBookById('1');
            await bookService.createBook({});

            // Assert
            expect(localStorage.getItem).toHaveBeenCalledTimes(3);
            expect(localStorage.getItem).toHaveBeenCalledWith('token');
        });
    });

    describe('API URL Configuration', () => {
        it('should use correct base URL for all methods', async () => {
            // Arrange
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({})
            });

            // Act
            await bookService.getAllBooks();
            await bookService.getBookById('1');
            await bookService.createBook({ title: 'Test' });
            await bookService.updateBook('1', { title: 'Updated' });
            await bookService.deleteBook('1');

            // Assert
            const calls = fetch.mock.calls;
            calls.forEach(call => {
                expect(call[0]).toContain('http://test-api.com/api/books');
            });
        });
    });
});
