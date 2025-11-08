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
  const [books, setBooks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [filter, setFilter] = useState() | Confused about what type is this filter 
  // 

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <SearchFilterBar
        searchTerm=""
        onSearchChange={null}
        selectedGenre="All"
        onGenreChange={null}
        selectedRating="all"
        onRatingChange={null}
      />
      
      <BookGrid 
        books={books}
      />
      
      <button className="fixed bottom-8 right-8 px-8 py-4 text-xl font-bold bg-blue-600 text-white border-none rounded-full cursor-pointer shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">
        + Add Book
      </button>
      
      <AddBookModal
        isOpen={false}
        onClose={null}
        onSubmit={null}
      />
    </div>
  );
}

export default App;
