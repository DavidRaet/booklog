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
import { useBook } from './hooks/useBook'
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';


function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { 
    isAuthenticated, 
    logout 
          } = useAuth();
  const { 
    searchBook, 
    selectedRating, 
    selectedGenre, 
    filteredBooks, 
    editingBook, 
    isModalOpen,
    setBooks, 
    setSearchBook, 
    setSelectedGenre, 
    setSelectedRating, 
    setEditingBook,
    setIsModalOpen, 
    handleAddBook, 
    handleUpdateBook, 
    handleSaveNewEditedBook, 
    handleDeleteBook, 
                  } = useBook();
  
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
  }, [isAuthenticated]);

  return (
    <div className={isAuthPage ? "" : "min-h-screen bg-gray-50"}>
      {!isAuthPage && <Header onLogout={logout} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/' element={
          <ProtectedRoute>
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : (
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
            )}
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
        onSubmit={editingBook ? handleSaveNewEditedBook : handleAddBook}
        editingBook={editingBook}
      />
    </div>
  )
}

export default App;
