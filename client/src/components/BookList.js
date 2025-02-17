import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKS } from '../queries';

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Book List</h2>
      {data && data.books && data.books.length > 0 ? (
        <ul>
          {data.books.map(({ id, title, author }) => (
            <li key={id}>
              {title} by {author}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
}

export default BookList;