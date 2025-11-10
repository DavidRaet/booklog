import './App.css';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilter/SearchFilterBar';
import BookGrid from './components/BookGrid';
import AddBookModal from './components/AddBookModal';
import { useState } from 'react';

function App() {
  // TODO: You'll implement state management here
  // - books array
  // - search/filter state
  // - modal open/close state
  // - CRUD operations (create, update, delete)
  const [books, setBooks] = useState([
    { id: 1, title: 'Test Book', author: 'Author', genre: 'Fiction', rating: 5 }, 
    { id: 2, title: 'Another Book', author: 'Author', genre: 'Fantasy', rating: 4 },
    { id: 3, title: 'Third Book', author: 'Writer', genre: 'Non-Fiction', rating: 3 }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchBook, setSearchBook] = useState('') 
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [editingBook, setEditingBook] = useState(null)


  const handleAddBook = (newBook) => {
    const bookWithId = {
      ...newBook ,
      id: Date.now(),
    }
    setBooks([...books, bookWithId])
    setIsModalOpen(false)
  }

  const handleUpdateBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleSaveNewBook = (bookToUpdate) => {
    setBooks(books.map(book => book.id === bookToUpdate.id ? bookToUpdate : book))
  }

  const handleDeleteBook = (bookToDelete) => {
    setBooks(books.filter(book => book.id !== bookToDelete.id ))
  }

  const filteredBooks = 
                 books.filter(book => book.title.includes(searchBook.toLowerCase()))
                      .filter(book => selectedGenre === 'All' || book.genre === selectedGenre)
                      .filter(book => selectedRating === 'All' || book.rating >= parseInt(selectedRating))
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <SearchFilterBar
        searchTerm={searchBook}
        onSearchChange={(e) => setSearchBook(e.target.value)}
        selectedGenre={selectedGenre}
        onGenreChange={(e) => setSelectedGenre(e.target.value)}
        selectedRating={selectedRating}
        onRatingChange={(e) => setSelectedRating(e.target.value)} 
      />
      
      <BookGrid 
        books={filteredBooks}
        onEdit={handleUpdateBook}
        onDelete={handleDeleteBook}
      />
      
      <button 
      className="fixed bottom-8 right-8 px-8 py-4 text-xl font-bold bg-blue-600 text-white border-none rounded-full cursor-pointer shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
      onClick={() => {
        setIsModalOpen(true)
        setEditingBook(null)
      }}
      >
        + Add Book
      </button>
      
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBook(null)
        }}
        onSubmit={editingBook ? handleSaveNewBook : handleAddBook}
        editingBook={editingBook}
      />
    </div>
  );
}

export default App;
