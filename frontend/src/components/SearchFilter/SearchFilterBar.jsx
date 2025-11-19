import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';
import Button from '../Button';
import { Plus } from 'lucide-react';
const SearchFilterBar = ({
    searchTerm,
    onSearchChange,
    selectedGenre,
    onGenreChange,
    selectedRating,
    onRatingChange,
    onAddBook
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm max-w-7xl mx-auto my-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10">
            <div className="flex flex-1 flex-wrap gap-4 items-center w-full">
                <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
                <div className="flex gap-2">
                    <GenreFilter selectedGenre={selectedGenre} onGenreChange={onGenreChange} />
                    <RatingFilter selectedRating={selectedRating} onRatingChange={onRatingChange} />
                </div>
            </div>

            <div className="w-full md:w-auto">
                <Button onClick={onAddBook} className="flex items-center justify-center gap-2">
                    <Plus size={20} />
                    <span>Add Book</span>
                </Button>
            </div>
        </div>
    );
};

export default SearchFilterBar;
