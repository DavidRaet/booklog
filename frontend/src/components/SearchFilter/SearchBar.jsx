// -----------------------------------------
// SearchBar Component
// Filters books by title or author (client-side)
// -----------------------------------------

const SearchBar = ({ searchTerm, onSearchChange }) => {
    // TODO: You'll implement the search handler logic
    return (
        <div className="relative flex-1 max-w-md">
            <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full px-4 pr-10 py-3 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                🔍
            </span>
        </div>
    );
};

export default SearchBar;
