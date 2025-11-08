// -----------------------------------------
// GenreFilter Component
// Filters visible books by genre
// -----------------------------------------

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
    // TODO: You'll populate genres dynamically from your books data
    const genres = ['All', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Biography'];

    return (
        <div className="flex items-center">
            <select
                value={selectedGenre || 'All'}
                onChange={(e) => onGenreChange?.(e.target.value)}
                className="px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg bg-white cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]"
            >
                {genres.map((genre) => (
                    <option key={genre} value={genre}>
                        {genre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GenreFilter;
