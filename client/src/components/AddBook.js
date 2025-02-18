import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK } from '../queries';
import './AddBook.css'; // New CSS file

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [addBook] = useMutation(ADD_BOOK);

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook({ variables: { title, author } });
    setTitle('');
    setAuthor('');
  };

  return (
    <div className="add-book-container">
      <header>
        <nav>
          <div className="container">
            <a href="/" className="logo">Book Library</a>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/books">Books</a></li>
              <li><a href="/add-book">Add Book</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <section id="add-book" className="container add-book-section">
        <h2>Add a New Book</h2>
        <p className="section-intro">Add a new book to your library collection.</p>

        <div className="add-book-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Add Book</button>
          </form>
        </div>
      </section>

      <footer className="footer bg-dark text-white text-center">
        <div className="container">
          <p>&copy; 2025 Book Library</p>
        </div>
      </footer>
    </div>
  );
};

export default AddBook;