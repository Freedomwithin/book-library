import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, REMOVE_BOOK } from '../queries';

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRemove = async (id) => {
    try {
      await removeBook({ variables: { id } });
    } catch (err) {
      console.error("Error removing book:", err);
    }
  };

  return (
    <div>
      <h2>Book List</h2>
      {data && data.books && data.books.length > 0 ? (
        <ul>
          {data.books.map(({ id, title, author }) => (
            <li key={id}>
              {title} by {author}
              <button onClick={() => handleRemove(id)}>Remove</button>
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