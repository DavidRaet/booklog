import './App.css';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilter/SearchFilterBar';
import BookGrid from './components/BookGrid';
import AddBookModal from './components/AddBookModal';
import BookDetailsPage from './components/BookDetailsPage';
import { bookService } from './services/bookService';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  const [books, setBooks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchBook, setSearchBook] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, isAuthenticated, logout } = useAuth()

  console.log('Auth state', { user, isAuthenticated })

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      const fetchBooks = async () => {
        try {
          const data = await bookService.getAllBooks()
          setBooks(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchBooks()
    }
  }, [isAuthenticated])


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
      if (window.confirm("Are you sure you want to delete this book?")) {
        await bookService.deleteBook(bookID)
        setBooks(books.filter(book => book.id !== bookID))
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
    <div className={isAuthPage ? "" : "min-h-screen bg-gray-50"}>
      {!isAuthPage && <Header onLogout={logout} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/' element={
          <ProtectedRoute>
            <>
              <SearchFilterBar
                searchTerm={searchBook}
                onSearchChange={(e) => setSearchBook(e.target.value)}
                selectedGenre={selectedGenre}
                onGenreChange={(e) => setSelectedGenre(e.target.value)}
                selectedRating={selectedRating}
                onRatingChange={(e) => setSelectedRating(e.target.value)}
                onAddBook={() => {
                  setIsModalOpen(true)
                  setEditingBook(null)
                }}
              />

              <BookGrid
                books={filteredBooks}
                onEdit={handleUpdateBook}
                onDelete={handleDeleteBook}
              />
            </>
          </ProtectedRoute>
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
