import { useState } from 'react'
import { bookService } from '../services/bookService';
import { BookContext } from './BookContext';

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [searchBook, setSearchBook] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddBook = async (newBook) => {
    try {
      const bookData = await bookService.createBook(newBook)
      console.log('Book from API:', bookData)
      console.log('Current books:', books)
      console.log('New books array:', [...books, bookData])
      setBooks([...books, bookData])
    } catch (err) {
      throw new Error("Failed to add book: " + err.message);
    }
  }

  const handleUpdateBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleSaveNewEditedBook = async (updatedBook) => {
    try {
      const updatedBookData = await bookService.updateBook(updatedBook.id, updatedBook)
      setBooks(books.map(book => book.id === updatedBookData.id ? updatedBookData : book))

    } catch (err) {
        throw new Error("Failed to add book: " + err.message);
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

    const value = {
        books, 
        searchBook,
        selectedGenre,
        selectedRating,
        filteredBooks,
        editingBook,
        isModalOpen,
        setIsModalOpen,
        setBooks,
        setSearchBook,
        setSelectedGenre,
        setSelectedRating,
        setEditingBook,
        handleAddBook,
        handleUpdateBook,
        handleSaveNewEditedBook,
        handleDeleteBook
    };
    return (
    <BookContext.Provider value={value}>
        {children}
    </BookContext.Provider>
    );
  }