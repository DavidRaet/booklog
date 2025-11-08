// -----------------------------------------
// BookCard Component
// Displays: Title, Author, Genre (tag), Rating, Review snippet, Edit/Delete icons
// -----------------------------------------

const BookCard = ({ book }) => {
    // TODO: Implement edit/delete handlers
    
    return (
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {book?.title || 'Book Title'}
                </h3>
                <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    <button className="hover:bg-gray-100 p-1 rounded" aria-label="Edit">
                        ✏️
                    </button>
                    <button className="hover:bg-gray-100 p-1 rounded" aria-label="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
                {book?.author || 'Author Name'}
            </p>
            
            <div className="flex gap-4 items-center mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {book?.genre || 'Genre'}
                </span>
                <span className="text-sm text-orange-500 font-medium">
                    ⭐ {book?.rating || 0}/5
                </span>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed">
                {book?.review?.substring(0, 100) || 'No review yet...'}
                {book?.review?.length > 100 && '...'}
            </p>
        </div>
    );
};

export default BookCard;
