// -----------------------------------------
// RatingFilter Component
// Filters or sorts by rating
// -----------------------------------------

const RatingFilter = ({ selectedRating, onRatingChange }) => {
    // TODO: You'll implement filtering/sorting logic
    const ratingOptions = [
        { label: 'All Ratings', value: 'All' },
        { label: '5 Stars', value: '5' },
        { label: '4+ Stars', value: '4' },
        { label: '3+ Stars', value: '3' },
    ];

    return (
        <div className="flex items-center">
            <select
                value={selectedRating || 'all'}
                onChange={(e) => onRatingChange?.(e)}
                className="px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg bg-white cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]"
            >
                {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RatingFilter;
