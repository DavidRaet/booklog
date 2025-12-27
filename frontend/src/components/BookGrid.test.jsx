import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookGrid from './BookGrid';
import "@testing-library/jest-dom/vitest";

// Mock BookCard component
vi.mock('./BookCard', () => ({
    default: ({ book, onEdit, onDelete }) => (
        <div data-testid={`book-card-${book.id}`}>
            <span data-testid="book-title">{book.title}</span>
            <button data-testid={`edit-btn-${book.id}`} onClick={() => onEdit(book)}>Edit</button>
            <button data-testid={`delete-btn-${book.id}`} onClick={() => onDelete(book.id)}>Delete</button>
        </div>
    )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    BookPlus: ({ size, className }) => (
        <span data-testid="book-plus-icon" data-size={size} className={className}>
            BookPlus
        </span>
    )
}));

describe('BookGrid', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    const mockBooks = [
        {
            id: 'book-1',
            title: 'Book One',
            author: 'Author One',
            genre: 'Fiction',
            rating: 4,
            review: 'Great book'
        },
        {
            id: 'book-2',
            title: 'Book Two',
            author: 'Author Two',
            genre: 'Non-Fiction',
            rating: 3.5,
            review: 'Interesting read'
        },
        {
            id: 'book-3',
            title: 'Book Three',
            author: 'Author Three',
            genre: 'Mystery',
            rating: 5,
            review: 'Couldn\'t put it down!'
        }
    ];

    const renderBookGrid = (books = mockBooks, onEdit = mockOnEdit, onDelete = mockOnDelete) => {
        return render(
            <BrowserRouter>
                <BookGrid books={books} onEdit={onEdit} onDelete={onDelete} />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Rendering Books', () => {
        it('should render all books in the array', () => {
            renderBookGrid();

            expect(screen.getByTestId('book-card-book-1')).toBeInTheDocument();
            expect(screen.getByTestId('book-card-book-2')).toBeInTheDocument();
            expect(screen.getByTestId('book-card-book-3')).toBeInTheDocument();
        });

        it('should render correct number of BookCard components', () => {
            renderBookGrid();

            const bookCards = screen.getAllByTestId(/^book-card-/);
            expect(bookCards).toHaveLength(3);
        });

        it('should render single book correctly', () => {
            const singleBook = [mockBooks[0]];
            renderBookGrid(singleBook);

            expect(screen.getByTestId('book-card-book-1')).toBeInTheDocument();
            expect(screen.queryByTestId('book-card-book-2')).not.toBeInTheDocument();
        });

        it('should render book titles', () => {
            renderBookGrid();

            expect(screen.getByText('Book One')).toBeInTheDocument();
            expect(screen.getByText('Book Two')).toBeInTheDocument();
            expect(screen.getByText('Book Three')).toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        it('should display empty state when books array is empty', () => {
            renderBookGrid([]);

            expect(screen.getByText('No books found')).toBeInTheDocument();
        });

        it('should display empty state message', () => {
            renderBookGrid([]);

            expect(screen.getByText(/Your library is looking a bit empty/)).toBeInTheDocument();
        });

        it('should display BookPlus icon in empty state', () => {
            renderBookGrid([]);

            expect(screen.getByTestId('book-plus-icon')).toBeInTheDocument();
        });

        it('should not render any BookCard components when empty', () => {
            renderBookGrid([]);

            const bookCards = screen.queryAllByTestId(/^book-card-/);
            expect(bookCards).toHaveLength(0);
        });

        it('should display empty state when books is null', () => {
            renderBookGrid(null);

            expect(screen.getByText('No books found')).toBeInTheDocument();
        });
    });

    describe('Props Passing', () => {
        it('should pass onEdit prop to BookCard components', () => {
            renderBookGrid();

            const editButton = screen.getByTestId('edit-btn-book-1');
            editButton.click();

            expect(mockOnEdit).toHaveBeenCalledWith(mockBooks[0]);
        });

        it('should pass onDelete prop to BookCard components', () => {
            renderBookGrid();

            const deleteButton = screen.getByTestId('delete-btn-book-2');
            deleteButton.click();

            expect(mockOnDelete).toHaveBeenCalledWith('book-2');
        });

        it('should pass correct book object to each BookCard', () => {
            renderBookGrid();

            // Each BookCard should have the correct title from its book prop
            expect(screen.getByText('Book One')).toBeInTheDocument();
            expect(screen.getByText('Book Two')).toBeInTheDocument();
            expect(screen.getByText('Book Three')).toBeInTheDocument();
        });
    });

    describe('Grid Layout', () => {
        it('should render grid container with correct classes', () => {
            const { container } = renderBookGrid();

            const gridElement = container.querySelector('.grid');
            expect(gridElement).toBeInTheDocument();
        });

        it('should have responsive grid classes', () => {
            const { container } = renderBookGrid();

            const gridElement = container.querySelector('.grid');
            expect(gridElement).toHaveClass('grid-cols-1');
            expect(gridElement).toHaveClass('md:grid-cols-2');
            expect(gridElement).toHaveClass('lg:grid-cols-3');
        });
    });

    describe('Animation', () => {
        it('should apply animation delays to book cards', () => {
            const { container } = renderBookGrid();

            // Check that wrapper divs have animation delay styles
            const animatedDivs = container.querySelectorAll('.animate-in');
            expect(animatedDivs.length).toBeGreaterThan(0);
        });

        it('should have different animation delays for each card', () => {
            const { container } = renderBookGrid();

            const animatedDivs = container.querySelectorAll('[style*="animationDelay"]');
            
            // Each card should have a unique animation delay
            const delays = new Set();
            animatedDivs.forEach(div => {
                delays.add(div.style.animationDelay);
            });
            
            // Should have 3 unique delays for 3 books
            expect(delays.size).toBe(3);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty books array', () => {
            expect(() => renderBookGrid([])).not.toThrow();
        });

        it('should handle large number of books', () => {
            const manyBooks = Array.from({ length: 100 }, (_, i) => ({
                id: `book-${i}`,
                title: `Book ${i}`,
                author: `Author ${i}`,
                genre: 'Fiction',
                rating: 4,
                review: 'Review'
            }));

            expect(() => renderBookGrid(manyBooks)).not.toThrow();
            
            const bookCards = screen.getAllByTestId(/^book-card-/);
            expect(bookCards).toHaveLength(100);
        });

        it('should handle books with missing properties', () => {
            const incompleteBooks = [
                { id: 'incomplete-1', title: 'Only Title' },
                { id: 'incomplete-2', author: 'Only Author' }
            ];

            expect(() => renderBookGrid(incompleteBooks)).not.toThrow();
        });

        it('should use book.id as key for each card', () => {
            renderBookGrid();

            // Each book should be identifiable by its ID in the test IDs
            mockBooks.forEach(book => {
                expect(screen.getByTestId(`book-card-${book.id}`)).toBeInTheDocument();
            });
        });
    });

    describe('Container Styling', () => {
        it('should have max-width container class', () => {
            const { container } = renderBookGrid();

            expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
        });

        it('should have horizontal padding', () => {
            const { container } = renderBookGrid();

            expect(container.querySelector('.px-4')).toBeInTheDocument();
        });

        it('should have bottom padding', () => {
            const { container } = renderBookGrid();

            expect(container.querySelector('.pb-12')).toBeInTheDocument();
        });
    });
});
