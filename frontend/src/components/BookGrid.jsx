import BookCard from './BookCard';
import { BookPlus } from 'lucide-react';

const BookGrid = ({ books, onEdit, onDelete }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 pb-12">
            {books && books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <BookCard
                                book={book}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                        <BookPlus size={48} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No books found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Your library is looking a bit empty. Why not add your first book to get started?
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookGrid;
