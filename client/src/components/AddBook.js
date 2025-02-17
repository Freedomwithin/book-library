import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_BOOK, GET_BOOKS } from '../queries';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onError: (error) => {
      console.error('Error adding book:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);
      console.error('Network Error:', error.networkError);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting book:', { title, author });
    try {
      const result = await addBook({ variables: { title, author } });
      console.log('Book added successfully:', result);
      setTitle('');
      setAuthor('');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error.message}</p>
          <p>GraphQL Errors: {JSON.stringify(error.graphQLErrors)}</p>
          <p>Network Error: {JSON.stringify(error.networkError)}</p>
        </div>
      )}
    </div>
  );
}

export default AddBook;