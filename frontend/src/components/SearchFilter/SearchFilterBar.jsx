// -----------------------------------------
// SearchFilterBar Component
// Container for search and filter controls
// -----------------------------------------

import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';

const SearchFilterBar = ({
    searchTerm,
    onSearchChange,
    selectedGenre,
    onGenreChange,
    selectedRating,
    onRatingChange,
}) => {
    // TODO: You'll wire up state management and pass handlers to children
    
    return (
        <div className="flex flex-wrap gap-4 items-center p-6 bg-gray-50 rounded-lg max-w-7xl mx-auto my-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
            <GenreFilter selectedGenre={selectedGenre} onGenreChange={onGenreChange} />
            <RatingFilter selectedRating={selectedRating} onRatingChange={onRatingChange} />
        </div>
    );
};

export default SearchFilterBar;
