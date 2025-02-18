import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, REMOVE_BOOK, LOGOUT } from '../queries';
import { useNavigate } from 'react-router-dom';
import './BookList.css';
import './AddBook.css';

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      try {
        await removeBook({ variables: { id } });
      } catch (err) {
        console.error('Error removing book:', err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('bookLibraryToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div className="book-list-container">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      <h2>Book List</h2>
      {data && data.books && data.books.length > 0 ? (
        <div className="book-grid">
          {data.books.map(({ id, title, author }) => (
            <div key={id} className="book-card">
              <h3>{title}</h3>
              <p>by {author}</p>
              <button onClick={() => handleRemove(id)} className="remove-btn">
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-books">No books found</p>
      )}
    </div>
  );
}

export default BookList;