import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Star, BookOpen } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete }) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/books/${book.id}`)
    }

    return (
        <div
            className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={handleCardClick}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 line-clamp-1">
                        {book?.title || 'Untitled Book'}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        {book?.author || 'Unknown Author'}
                    </p>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(book)
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(book.id)
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex gap-3 items-center mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <BookOpen size={12} />
                    {book?.genre || 'Uncategorized'}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {book?.rating || 0}
                </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {book?.review || 'No review added yet.'}
            </p>
        </div>
    );
};

export default BookCard;
