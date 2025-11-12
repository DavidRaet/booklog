import './App.css';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilter/SearchFilterBar';
import BookGrid from './components/BookGrid';
import AddBookModal from './components/AddBookModal';
import BookDetailsPage from './components/BookDetailsPage';
import { bookService } from './services/bookService';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'

function App() {
  const [books, setBooks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchBook, setSearchBook] = useState('') 
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() =>{
    setLoading(true)
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks()
        setBooks(data)
      } catch (err){
        setError(err.message)
      } finally{
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])


  const handleAddBook = async (newBook) => {
    try {
        const bookData = await bookService.createBook(newBook)
        console.log('Book from API:', bookData)  
        console.log('Current books:', books)      
        console.log('New books array:', [...books, bookData])  
        setBooks([...books, bookData])
    } catch (err) {
      alert("Failed to add book: " + err.message)
      console.error(err)
    }
  }

  const handleUpdateBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleSaveNewBook = async (updatedBook) => {
    try {
        const updatedBookData = await bookService.updateBook(updatedBook.id, updatedBook)
        setBooks(books.map(book => book.id === updatedBookData.id ? updatedBookData : book))

    } catch (err) {
        alert("Failed to update book: " + err.message)
        throw err
    }
  }

  const handleDeleteBook = async (bookID) => {
    try {
      if (window.confirm("Are you sure you want to delete this book?")){
          await bookService.deleteBook(bookID)
          setBooks(books.filter(book => book.id !== bookID ))
      } else {
        return 
      }
    } catch (err) {
      alert("Failed to delete book: " + err.message)
    }
  }

  const filteredBooks = 
                 books.filter(book => book.title.toLowerCase().includes(searchBook.toLowerCase()))
                      .filter(book => selectedGenre === 'All' || book.genre === selectedGenre)
                      .filter(book => selectedRating === 'All' || book.rating >= parseInt(selectedRating))
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path='/' element={
          <>
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
          </>
        } />
        <Route path='/books/:id' element={<BookDetailsPage onDelete={handleDeleteBook} onEdit={handleUpdateBook} />} />
      </Routes>
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
