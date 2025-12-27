import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookCard from './BookCard';
import "@testing-library/jest-dom/vitest";

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Edit2: ({ size }) => <span data-testid="edit-icon" data-size={size}>Edit</span>,
    Trash2: ({ size }) => <span data-testid="trash-icon" data-size={size}>Trash</span>,
    Star: ({ size, fill }) => <span data-testid="star-icon" data-size={size} data-fill={fill}>Star</span>,
    BookOpen: ({ size }) => <span data-testid="book-icon" data-size={size}>Book</span>
}));

describe('BookCard', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    const mockBook = {
        id: 'book-123',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        rating: 4.5,
        review: 'A classic tale of the American Dream.'
    };

    const renderBookCard = (book = mockBook, onEdit = mockOnEdit, onDelete = mockOnDelete) => {
        return render(
            <BrowserRouter>
                <BookCard book={book} onEdit={onEdit} onDelete={onDelete} />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Rendering', () => {
        it('should render book title correctly', () => {
            renderBookCard();
            expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
        });

        it('should render book author correctly', () => {
            renderBookCard();
            expect(screen.getByText('F. Scott Fitzgerald')).toBeInTheDocument();
        });

        it('should render book genre correctly', () => {
            renderBookCard();
            expect(screen.getByText('Fiction')).toBeInTheDocument();
        });

        it('should render book rating correctly', () => {
            renderBookCard();
            expect(screen.getByText('4.5')).toBeInTheDocument();
        });

        it('should render book review correctly', () => {
            renderBookCard();
            expect(screen.getByText('A classic tale of the American Dream.')).toBeInTheDocument();
        });

        it('should render edit button with title attribute', () => {
            renderBookCard();
            expect(screen.getByTitle('Edit')).toBeInTheDocument();
        });

        it('should render delete button with title attribute', () => {
            renderBookCard();
            expect(screen.getByTitle('Delete')).toBeInTheDocument();
        });

        it('should render star icon', () => {
            renderBookCard();
            expect(screen.getByTestId('star-icon')).toBeInTheDocument();
        });

        it('should render book icon for genre', () => {
            renderBookCard();
            expect(screen.getByTestId('book-icon')).toBeInTheDocument();
        });
    });

    describe('Default Values for Missing Data', () => {
        it('should display "Untitled Book" when title is missing', () => {
            const bookWithoutTitle = { ...mockBook, title: null };
            renderBookCard(bookWithoutTitle);
            expect(screen.getByText('Untitled Book')).toBeInTheDocument();
        });

        it('should display "Unknown Author" when author is missing', () => {
            const bookWithoutAuthor = { ...mockBook, author: null };
            renderBookCard(bookWithoutAuthor);
            expect(screen.getByText('Unknown Author')).toBeInTheDocument();
        });

        it('should display "Uncategorized" when genre is missing', () => {
            const bookWithoutGenre = { ...mockBook, genre: null };
            renderBookCard(bookWithoutGenre);
            expect(screen.getByText('Uncategorized')).toBeInTheDocument();
        });

        it('should display 0 when rating is missing', () => {
            const bookWithoutRating = { ...mockBook, rating: null };
            renderBookCard(bookWithoutRating);
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('should display "No review added yet." when review is missing', () => {
            const bookWithoutReview = { ...mockBook, review: null };
            renderBookCard(bookWithoutReview);
            expect(screen.getByText('No review added yet.')).toBeInTheDocument();
        });

        it('should handle undefined book properties gracefully', () => {
            const bookWithUndefined = {
                id: 'book-1',
                title: undefined,
                author: undefined,
                genre: undefined,
                rating: undefined,
                review: undefined
            };
            renderBookCard(bookWithUndefined);
            
            expect(screen.getByText('Untitled Book')).toBeInTheDocument();
            expect(screen.getByText('Unknown Author')).toBeInTheDocument();
            expect(screen.getByText('Uncategorized')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
            expect(screen.getByText('No review added yet.')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('should navigate to book details page when card is clicked', () => {
            renderBookCard();
            
            const card = screen.getByText('The Great Gatsby').closest('div[class*="cursor-pointer"]');
            fireEvent.click(card);

            expect(mockNavigate).toHaveBeenCalledWith('/books/book-123');
        });

        it('should navigate with correct book ID', () => {
            const bookWithDifferentId = { ...mockBook, id: 'different-id-456' };
            renderBookCard(bookWithDifferentId);

            const card = screen.getByText('The Great Gatsby').closest('div[class*="cursor-pointer"]');
            fireEvent.click(card);

            expect(mockNavigate).toHaveBeenCalledWith('/books/different-id-456');
        });
    });

    describe('Edit Button', () => {
        it('should call onEdit with book object when edit button is clicked', () => {
            renderBookCard();

            const editButton = screen.getByTitle('Edit');
            fireEvent.click(editButton);

            expect(mockOnEdit).toHaveBeenCalledWith(mockBook);
            expect(mockOnEdit).toHaveBeenCalledTimes(1);
        });

        it('should stop event propagation when edit button is clicked', () => {
            renderBookCard();

            const editButton = screen.getByTitle('Edit');
            fireEvent.click(editButton);

            // If propagation was stopped, navigate should NOT be called
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should pass complete book object to onEdit', () => {
            renderBookCard();

            const editButton = screen.getByTitle('Edit');
            fireEvent.click(editButton);

            expect(mockOnEdit).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'book-123',
                    title: 'The Great Gatsby',
                    author: 'F. Scott Fitzgerald',
                    genre: 'Fiction',
                    rating: 4.5,
                    review: 'A classic tale of the American Dream.'
                })
            );
        });
    });

    describe('Delete Button', () => {
        it('should call onDelete with book ID when delete button is clicked', () => {
            renderBookCard();

            const deleteButton = screen.getByTitle('Delete');
            fireEvent.click(deleteButton);

            expect(mockOnDelete).toHaveBeenCalledWith('book-123');
            expect(mockOnDelete).toHaveBeenCalledTimes(1);
        });

        it('should stop event propagation when delete button is clicked', () => {
            renderBookCard();

            const deleteButton = screen.getByTitle('Delete');
            fireEvent.click(deleteButton);

            // If propagation was stopped, navigate should NOT be called
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should pass correct book ID to onDelete', () => {
            const bookWithDifferentId = { ...mockBook, id: 'delete-me-789' };
            renderBookCard(bookWithDifferentId);

            const deleteButton = screen.getByTitle('Delete');
            fireEvent.click(deleteButton);

            expect(mockOnDelete).toHaveBeenCalledWith('delete-me-789');
        });
    });

    describe('Event Propagation', () => {
        it('should navigate when clicking anywhere on card except buttons', () => {
            renderBookCard();

            // Click on review text (not a button)
            const review = screen.getByText('A classic tale of the American Dream.');
            fireEvent.click(review);

            expect(mockNavigate).toHaveBeenCalled();
        });

        it('should not navigate when clicking edit button', () => {
            renderBookCard();

            const editButton = screen.getByTitle('Edit');
            fireEvent.click(editButton);

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(mockOnEdit).toHaveBeenCalled();
        });

        it('should not navigate when clicking delete button', () => {
            renderBookCard();

            const deleteButton = screen.getByTitle('Delete');
            fireEvent.click(deleteButton);

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(mockOnDelete).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        it('should handle book with empty strings', () => {
            const emptyBook = {
                id: 'empty-1',
                title: '',
                author: '',
                genre: '',
                rating: 0,
                review: ''
            };
            
            // Should not throw
            expect(() => renderBookCard(emptyBook)).not.toThrow();
        });

        it('should handle very long text gracefully', () => {
            const longTextBook = {
                ...mockBook,
                title: 'A'.repeat(200),
                review: 'B'.repeat(1000)
            };

            expect(() => renderBookCard(longTextBook)).not.toThrow();
        });

        it('should handle rating edge values', () => {
            const zeroRatingBook = { ...mockBook, rating: 0 };
            renderBookCard(zeroRatingBook);
            expect(screen.getByText('0')).toBeInTheDocument();

            cleanup();

            const fiveRatingBook = { ...mockBook, rating: 5 };
            renderBookCard(fiveRatingBook);
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('should handle decimal ratings', () => {
            const decimalBook = { ...mockBook, rating: 3.7 };
            renderBookCard(decimalBook);
            expect(screen.getByText('3.7')).toBeInTheDocument();
        });
    });
});
