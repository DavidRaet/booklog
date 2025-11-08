// -----------------------------------------
// AddBookModal Component
// Modal for adding/editing books (hidden by default)
// -----------------------------------------

const AddBookModal = ({ isOpen, onClose, onSubmit, book }) => {
    // TODO: You'll implement form state and submission logic
    // book prop is for editing existing books (pre-fill form)
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]" onClick={onClose}>
            <div className="bg-white rounded-xl p-8 max-w-lg w-[90%] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {book ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <button 
                        className="text-2xl text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded transition-colors" 
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className="flex flex-col gap-4" onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: You'll implement form data collection and validation
                    onSubmit?.();
                }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Title</label>
                        <input
                            type="text"
                            placeholder="Enter book title"
                            className="px-3 py-3 text-base border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Author</label>
                        <input
                            type="text"
                            placeholder="Enter author name"
                            className="px-3 py-3 text-base border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Genre</label>
                        <input
                            type="text"
                            placeholder="e.g., Fiction, Sci-Fi"
                            className="px-3 py-3 text-base border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Rating (0-5)</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="0.0"
                            className="px-3 py-3 text-base border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Review</label>
                        <textarea
                            placeholder="Write your review..."
                            rows="4"
                            className="px-3 py-3 text-base border border-gray-300 rounded-md outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>

                    <div className="flex gap-4 mt-4 justify-end">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-3 text-base border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-3 text-base border-none rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                            {book ? 'Update' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;
