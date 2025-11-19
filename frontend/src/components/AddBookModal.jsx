import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const AddBookModal = ({ isOpen, onClose, onSubmit, editingBook }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [genre, setGenre] = useState('')
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (editingBook) {
            setTitle(editingBook.title)
            setAuthor(editingBook.author)
            setGenre(editingBook.genre)
            setRating(editingBook.rating)
            setReview(editingBook.review)
        }
    }, [editingBook])

    useEffect(() => {
        if (!isOpen) {
            setTitle('')
            setAuthor('')
            setGenre('')
            setRating(0)
            setReview('')
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const newBook = {
            title,
            author,
            genre,
            rating: parseFloat(rating),
            review,
            ...(editingBook && { id: editingBook.id })
        }
        try {
            await onSubmit(newBook)
            onClose()
        } catch (err) {
            console.error("Submit failed: ", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl p-8 max-w-lg w-[90%] max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {editingBook ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <button
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <Input
                        label="Title"
                        placeholder="Enter book title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Input
                        label="Author"
                        placeholder="Enter author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Genre"
                            placeholder="e.g., Fiction"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            required
                        />
                        <Input
                            label="Rating (0-5)"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="0.0"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Review</label>
                        <textarea
                            placeholder="Write your review..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-blue-600 focus:ring-blue-100 resize-y"
                        />
                    </div>

                    <div className="flex gap-3 mt-4 justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-auto"
                        >
                            {editingBook ? 'Update Book' : 'Add Book'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;
