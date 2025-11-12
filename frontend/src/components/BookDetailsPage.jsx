import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { bookService } from '../services/bookService'
import BookDetails from '../components/BookDetails'

const BookDetailsPage = ({onDelete, onEdit}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id)
        setBook(data)
      } catch (err) {
        alert('Book not found: ' + err.message)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id, navigate])
  
  const handleEdit = async (book) => {
    onEdit(book)
    navigate('/')
  }
  
  const handleDelete = async (bookId) => {
    try {
      if (window.confirm("Delete this book?")) {
        await onDelete(bookId)
        navigate('/')
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }
  
  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!book) return <div className="text-center py-20">Book not found</div>
  
  return (
    <BookDetails 
      book={book} 
      onEdit={handleEdit}
      onDelete={handleDelete}
      onClose={() => navigate('/')}
    />
  )
}

export default BookDetailsPage