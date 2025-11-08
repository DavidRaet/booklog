// -----------------------------------------
// BookGrid Component
// Displays books in a responsive grid layout
// -----------------------------------------

import BookCard from './BookCard';

const BookGrid = ({ books }) => {
    // TODO: You'll wire up actual books data here

    return (
        <div className="max-w-7xl mx-auto px-4 my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400 text-lg py-12">
                        No books to display. Add your first book!
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookGrid;
