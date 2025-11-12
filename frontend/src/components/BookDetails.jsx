const BookDetails = ({ book, onEdit, onDelete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <p className="text-xl text-gray-700 mb-2">by {book.author}</p>
        <div className="flex gap-4 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
            {book.genre}
          </span>
          <span className="text-yellow-500">
            {'⭐'.repeat(book.rating)}
          </span>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{book.review}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onEdit(book)}>✏️ Edit</button>
          <button onClick={() => onDelete(book.id)}>🗑️ Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default BookDetails