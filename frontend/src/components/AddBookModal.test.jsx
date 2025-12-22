import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBookModal from './AddBookModal';
import "@testing-library/jest-dom/vitest";


vi.mock('./Button', () => ({
    default: ({ children, onClick, type, disabled, variant, className }) => (
        <button 
        onClick={onClick}
        type={type}
        disabled={disabled}
        data-variant={variant}
        className={className}
        >
            {children}
        </button>
    ),
}));

vi.mock('./Input', () => ({

    default: ({ label, value, onChange, placeholder, type, required, ...props }) => (
        <div>
            <label>
                {label}
            </label>
            <input 
            type={type} 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            aria-label={label}
            {...props}       
            />
        </div>
    ),
}));

vi.mock('lucide-react', () => ({
    X: () => <span>X</span>
}))

describe('AddBookModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    })

    it('should not render when isOpen is false', () => {
        const { container } = render(<AddBookModal isOpen={false} onSubmit={mockOnSubmit} onClose={mockOnClose}  />);

        expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
    render(<AddBookModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose}  />);
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });

    it('should show "Edit Book" when user is presenting a book to edit and the info of the book on the input boxes', () => {
        const editingBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        rating: 4.5,
        review: 'Great book',
        };

        render(<AddBookModal editingBook={editingBook} isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose}  />);
        expect(screen.getByText('Edit Book')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Fiction')).toBeInTheDocument();
        expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Great book')).toBeInTheDocument();
    });

    it('should update input fields when user types', async () => {
        const user = userEvent.setup();

        render(<AddBookModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        const titleInput = screen.getByLabelText('Title');
        await user.type(titleInput, 'New Book');
        expect(titleInput).toHaveValue('New Book');

        const ratingInput = screen.getByLabelText('Rating (0-5)');
        await user.type(ratingInput, '4');
        expect(ratingInput).toHaveValue(4);
    });

    it('should close the modal when the user presses the close button', async () => {
        const user = userEvent.setup();
        render(<AddBookModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const closeButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'X');
        await user.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close the modal when the user presses the backdrop of the modal', async () => {
        const user = userEvent.setup();
        const { container } = render(<AddBookModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
        const backdrop = container.firstChild;
        await user.click(backdrop); 
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close the modal when the user presses the modal content', async () => {
        const user = userEvent.setup();
        render(<AddBookModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const modalContent = screen.getByText('Add New Book').closest('div')
        await user.click(modalContent); 
        expect(mockOnClose).toHaveBeenCalledTimes(0);
    });

    it('should close the modal when the user presses the cancel button', async () => {
        const user = userEvent.setup();
        render(<AddBookModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel')
        await user.click(cancelButton); 
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should submit form with correct data', async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockResolvedValue();
        render(<AddBookModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText('Title'), 'Test Book');
        await user.type(screen.getByLabelText('Author'), 'Test Author');
        await user.type(screen.getByLabelText('Genre'), 'Fiction');
        await user.type(screen.getByLabelText('Rating (0-5)'), '4.5');
        await user.type(screen.getByPlaceholderText('Write your review...'), 'Amazing book!');

        const submitButton = screen.getByText('Add Book');
        user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Fiction',
                rating: 4.5,
                review: 'Amazing book!',
            });
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should submit form with book id when editing', async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockResolvedValue();
        const editingBook = {
                id: 1,
                title: 'New Book',
                author: 'New Author',
                genre: 'Sci-Fi',
                rating: 4.4,
                review: 'Splendid book',
        };

        render(<AddBookModal editingBook={editingBook} isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose}  />);

        const submitButton = screen.getByText('Update Book');
        user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                id: 1,
                title: 'New Book',
                author: 'New Author',
                genre: 'Sci-Fi',
                rating: 4.4,
                review: 'Splendid book',
            });
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should reset form modal if its closed and reopened', () => {
        const { rerender } = render(<AddBookModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
        const titleInput = screen.getByLabelText('Title');
        fireEvent.change(titleInput, { target: { value: 'Test' } });
        rerender(<AddBookModal isOpen={false} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
        rerender(<AddBookModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

        expect(screen.getByLabelText('Title')).toHaveValue('');

    })
});


