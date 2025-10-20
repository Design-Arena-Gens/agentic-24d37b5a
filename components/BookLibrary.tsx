'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBook, FaStickyNote, FaTimes } from 'react-icons/fa';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  notes: string;
  highlights: string[];
  addedDate: Date;
}

const categories = [
  'All',
  'Algebra',
  'Geometry',
  'Calculus',
  'Statistics',
  'Number Theory',
  'Trigonometry',
  'General',
];

export default function BookLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'General',
    tags: '',
    coverUrl: '',
    notes: '',
  });

  useEffect(() => {
    const savedBooks = localStorage.getItem('bookLibrary');
    if (savedBooks) {
      const parsed = JSON.parse(savedBooks);
      setBooks(parsed.map((b: any) => ({ ...b, addedDate: new Date(b.addedDate) })));
    }
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('bookLibrary', JSON.stringify(books));
    }
  }, [books]);

  const handleAddBook = () => {
    if (!formData.title || !formData.author) {
      alert('Please fill in title and author');
      return;
    }

    const newBook: Book = {
      id: editingBook?.id || Date.now().toString(),
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      coverUrl: formData.coverUrl,
      notes: formData.notes,
      highlights: editingBook?.highlights || [],
      addedDate: editingBook?.addedDate || new Date(),
    };

    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? newBook : b));
    } else {
      setBooks([...books, newBook]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'General',
      tags: '',
      coverUrl: '',
      notes: '',
    });
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      category: book.category,
      tags: book.tags.join(', '),
      coverUrl: book.coverUrl || '',
      notes: book.notes,
    });
    setIsModalOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
    }
  };

  const handleAddNote = (bookId: string, note: string) => {
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, notes: b.notes + (b.notes ? '\n\n' : '') + note } : b
    ));
  };

  const handleAddHighlight = (bookId: string, highlight: string) => {
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, highlights: [...b.highlights, highlight] } : b
    ));
  };

  const handleDeleteHighlight = (bookId: string, index: number) => {
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, highlights: b.highlights.filter((_, i) => i !== index) } : b
    ));
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Book Library</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaPlus />
            <span>Add Book</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or tags..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery || selectedCategory !== 'All'
              ? 'No books found matching your filters'
              : 'No books in your library yet. Add your first book!'}
          </div>
        ) : (
          filteredBooks.map(book => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <FaBook className="text-6xl text-white opacity-50" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {book.category}
                  </span>
                  {book.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {book.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      +{book.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBook(book);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                    className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedBook.author}</p>
                  {selectedBook.isbn && (
                    <p className="text-sm text-gray-500 mt-1">ISBN: {selectedBook.isbn}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Close"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Tags and Category */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Category & Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedBook.category}
                    </span>
                    {selectedBook.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FaStickyNote className="mr-2" /> Notes
                  </h4>
                  {selectedBook.notes ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 whitespace-pre-wrap">
                      {selectedBook.notes}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No notes yet</p>
                  )}
                  <div className="mt-3">
                    <textarea
                      placeholder="Add a new note..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          const target = e.target as HTMLTextAreaElement;
                          if (target.value.trim()) {
                            handleAddNote(selectedBook.id, target.value.trim());
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to add note</p>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Highlights</h4>
                  <div className="space-y-2 mb-3">
                    {selectedBook.highlights.length === 0 ? (
                      <p className="text-gray-500 italic">No highlights yet</p>
                    ) : (
                      selectedBook.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r flex justify-between items-start"
                        >
                          <p className="text-gray-700 flex-1">{highlight}</p>
                          <button
                            onClick={() => handleDeleteHighlight(selectedBook.id, index)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label="Delete highlight"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Add a new highlight..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            handleAddHighlight(selectedBook.id, target.value.trim());
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Enter to add highlight</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Book Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g., textbook, reference, advanced"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.coverUrl}
                      onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Add any notes about this book..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddBook}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
